#!/usr/bin/env python3
"""Offline checks for hand-collected game-day references (ticket price, no-shows, workforce).

Values were read manually on the cited pages; this script never downloads anything. It validates
provenance fields, recomputes the derived workforce ratio from the bundled attendance export, and
verifies the approved file hash.
"""
import argparse, hashlib, json, math
from pathlib import Path
ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT/'data'/'operations'/'event-references.json'
VALIDATION = ROOT/'data'/'operations'/'event-references.validation.json'
REQUIRED = {'id','value','unit','category','title','source_id','source_url','publisher','publication_year','publication_year_note',
            'observation_year','geography','venue_type','methodology','evidence_type','measurement_type','limitations','retrieved_at','usage_status'}
HOSTS = {'fortune.com','www.nbcsports.com','www.foxnews.com'}
EVIDENCE = {'published-benchmark','derived-estimate','verified-observed-data'}


def mean_reported_attendance(season):
    records = json.loads((ROOT/'data'/'processed'/'attendance.json').read_text())['records']
    values = [v for r in records if r['season'] == season for v in r['weekly'] if v is not None]
    return sum(values)/len(values), len(values)


def validate(data):
    seen = set()
    for r in data['records']:
        if not REQUIRED <= set(r): raise ValueError('Missing provenance: '+r.get('id','?'))
        if r['id'] in seen: raise ValueError('Duplicate id')
        seen.add(r['id'])
        if not isinstance(r['value'], (int, float)) or isinstance(r['value'], bool) or not math.isfinite(r['value']) or r['value'] < 0: raise ValueError('Invalid value')
        if r['evidence_type'] not in EVIDENCE: raise ValueError('Invalid evidence class')
        if not r['source_url'].startswith('https://') or r['source_url'].split('/')[2] not in HOSTS: raise ValueError('Unapproved source host')
        if any(not r[k] for k in ('unit','geography','methodology','limitations','usage_status','publication_year_note')): raise ValueError('Blank provenance')
    if data['records'] and 'concession_spending_per_attendee' not in data['not_available']: raise ValueError('Spending gap must stay explicit')
    by = {r['id']: r for r in data['records']}
    derived = by['workforce-per-1000-derived']
    mean, n = mean_reported_attendance(2010)
    if n != 512 or round(mean, 2) != derived['derivation']['denominator_value']: raise ValueError('Attendance denominator changed')
    expected = round(by[derived['derivation']['numerator_id']]['value']/mean*1000, 2)
    if expected != derived['value']: raise ValueError(f'Derived ratio mismatch: {expected}')
    return {'passed': True, 'records': len(seen), 'derived_ratio': expected, 'denominator': round(mean, 2)}


if __name__ == '__main__':
    parser = argparse.ArgumentParser(); parser.add_argument('--check', action='store_true'); parser.add_argument('--approve', action='store_true', help='Record the hash after a reviewed manual edit'); args = parser.parse_args()
    raw = DATA.read_bytes(); result = validate(json.loads(raw)); digest = hashlib.sha256(raw).hexdigest()
    if args.approve:
        VALIDATION.write_text(json.dumps({**result, 'sha256': digest}, indent=2)+'\n')
    elif args.check:
        if json.loads(VALIDATION.read_text())['sha256'] != digest: raise SystemExit('event-references.json changed; review and run with --approve')
    else: parser.error('Choose --check or --approve')
    print(json.dumps(result))
