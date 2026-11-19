"""Reproducible TidyTuesday team-week validation and compact season export."""
import argparse
import csv
import hashlib
import io
import json
import time
from collections import defaultdict
from datetime import datetime, timezone
from pathlib import Path
from urllib.request import Request, urlopen

ROOT = Path(__file__).resolve().parents[1]
URL = 'https://raw.githubusercontent.com/rfordatascience/tidytuesday/main/data/2020/2020-02-04/attendance.csv'
COLUMNS = ['team', 'team_name', 'year', 'total', 'home', 'away', 'week', 'weekly_attendance']
VERSION = '1.0.0'


def normalize(raw):
    reader = csv.DictReader(io.StringIO(raw.decode('utf-8-sig')))
    if reader.fieldnames != COLUMNS:
        raise ValueError('Unexpected attendance schema')
    seen, groups = {}, defaultdict(list)
    duplicates = missing = count = 0
    for row in reader:
        count += 1
        year, week = int(row['year']), int(row['week'])
        if not 2000 <= year <= 2019 or not 1 <= week <= 17:
            raise ValueError('Invalid season or week')
        if not row['team'].strip() or not row['team_name'].strip():
            raise ValueError('Missing historical team name')
        values = [int(row[k]) for k in ['total', 'home', 'away']]
        weekly = None if row['weekly_attendance'] in ('NA', '') else int(row['weekly_attendance'])
        if any(v < 0 for v in values) or (weekly is not None and weekly < 0):
            raise ValueError('Negative attendance')
        if values[0] != values[1] + values[2]:
            raise ValueError('Conflicting season totals')
        key = (row['team'], row['team_name'], year, week)
        normalized = (*values, weekly)
        if key in seen:
            if seen[key] != normalized:
                raise ValueError('Conflicting duplicate')
            duplicates += 1
            continue
        seen[key] = normalized
        missing += weekly is None
        groups[key[:3]].append((week, values, weekly))
    records = []
    for (city, name, year), rows in sorted(groups.items()):
        if len(rows) != 17 or len({tuple(r[1]) for r in rows}) != 1:
            raise ValueError('Incomplete weeks or inconsistent repeated season totals')
        rows.sort()
        total, home, away = rows[0][1]
        weekly = [r[2] for r in rows]
        if sum(v for v in weekly if v is not None) != total:
            raise ValueError('Weekly observations do not reconcile to season total')
        records.append({'id': f'{city}|{name}|{year}', 'team': f'{city} {name}', 'season': year,
                        'home': home, 'away': away, 'total': total, 'weekly': weekly})
    quality = {'raw_records': count, 'valid_team_week_records': len(seen), 'duplicates': duplicates,
               'invalid_records': 0, 'missing_weekly_attendance': missing, 'team_seasons': len(records),
               'seasons': len({r['season'] for r in records}), 'historical_team_labels': len({r['team'] for r in records}),
               'coverage': [min(r['season'] for r in records), max(r['season'] for r in records)],
               'joins': 'Not performed. No unique game-level records published.', 'ambiguous_matches': 0}
    return records, quality


def download(cache, refresh=False):
    if cache.exists() and not refresh:
        return cache.read_bytes(), 'cache'
    for attempt in range(3):
        try:
            with urlopen(Request(URL, headers={'User-Agent': 'Castella attendance research/1.0'}), timeout=30) as response:
                raw = response.read()
                status = response.status
            normalize(raw)  # never replace cache with invalid data
            cache.parent.mkdir(parents=True, exist_ok=True)
            cache.write_bytes(raw)
            return raw, status
        except Exception:
            if attempt == 2:
                raise
            time.sleep(2 ** attempt)


def validate_export(data):
    records = data['records']
    assert data['metadata']['grain'] == 'team-season with 17 team-week observations'
    assert len(records) == len({r['id'] for r in records})
    for r in records:
        assert type(r['season']) is int and 2000 <= r['season'] <= 2019
        assert len(r['weekly']) == 17
        assert all(v is None or (type(v) is int and v >= 0) for v in r['weekly'])
        assert all(type(r[k]) is int and r[k] >= 0 for k in ('home', 'away', 'total'))
        assert r['home'] + r['away'] == r['total']
        assert sum(v for v in r['weekly'] if v is not None) == r['total']
    return True


def run(raw, status, approve_source=False):
    records, quality = normalize(raw)
    checksum = hashlib.sha256(raw).hexdigest()
    prior_manifest = ROOT/'data'/'processed'/'manifest.json'
    if prior_manifest.exists() and not approve_source:
        assert json.loads(prior_manifest.read_text())['source_sha256'] == checksum, 'Source checksum changed. Inspect the source and explicitly approve with --approve-source.'
    metadata = {'source': 'TidyTuesday 2020-02-04, via Pro Football Reference', 'url': URL,
                'grain': 'team-season with 17 team-week observations', 'coverage': quality['coverage'],
                'definition': 'Source-reported attendance; no gate scans or verified physical counts.',
                'license': 'TidyTuesday repository CC0 1.0; upstream Pro Football Reference attribution retained. No raw data redistribution.',
                'sha256': checksum, 'transformation_version': VERSION}
    data = {'metadata': metadata, 'records': records}
    validate_export(data)
    provenance = {**metadata, 'retrieved_at_utc': datetime.now(timezone.utc).isoformat(), 'http_result': status,
                  'quality': quality, 'raw_bundled': False}
    out = ROOT / 'data' / 'processed'
    out.mkdir(parents=True, exist_ok=True)
    encoded = json.dumps(data, separators=(',', ':')).encode()
    manifest = {'source_sha256': checksum, 'export_sha256': hashlib.sha256(encoded).hexdigest(),
                'records': len(records), 'coverage': quality['coverage'], 'schema_version': VERSION}
    # All validation precedes output replacement.
    for path, payload in [(out/'attendance.json', encoded), (out/'manifest.json', json.dumps(manifest, indent=2).encode()),
                           (ROOT/'DATA_PROVENANCE.json', json.dumps(provenance, indent=2).encode())]:
        temp = path.with_suffix('.tmp')
        temp.write_bytes(payload)
        temp.replace(path)
    (ROOT/'DATA_QUALITY_REPORT.md').write_text('# Attendance data quality\n\n' + '\n'.join(f'- {k}: {v}' for k,v in quality.items()) + '\n\nMissing weekly observations remain null (the source describes a bye week). Home/away season totals are emitted once per team-season. Weekly observations include home and away appearances and may describe the same game twice. No NFL-wide unique-game total, verified home-game mean, or game ranking is published. Historical city/name labels are retained, including relocations.\n')
    print(json.dumps(quality, indent=2))


def check():
    out = ROOT/'data'/'processed'
    raw = (out/'attendance.json').read_bytes()
    data, manifest = json.loads(raw), json.loads((out/'manifest.json').read_text())
    validate_export(data)
    assert hashlib.sha256(raw).hexdigest() == manifest['export_sha256'], 'Export checksum changed'
    assert data['metadata']['sha256'] == manifest['source_sha256']
    assert len(data['records']) == manifest['records']
    assert [min(r['season'] for r in data['records']), max(r['season'] for r in data['records'])] == manifest['coverage']
    return True


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--input', type=Path)
    parser.add_argument('--refresh', action='store_true')
    parser.add_argument('--check', action='store_true')
    parser.add_argument('--approve-source', action='store_true', help='Explicitly approve a reviewed source checksum change')
    args = parser.parse_args()
    if args.check:
        check()
        print('Attendance export integrity passed')
    else:
        raw, status = (args.input.read_bytes(), 'GitHub connector HTTP success, UTF-8 repository asset') if args.input else download(ROOT/'work'/'cache'/'attendance.csv', args.refresh)
        run(raw, status, args.approve_source)
