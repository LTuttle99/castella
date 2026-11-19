#!/usr/bin/env python3
"""Fetch and normalize the public nflverse schedule release when networking permits."""
from __future__ import annotations

import csv
import json
import sys
from datetime import datetime, timezone
from pathlib import Path
from urllib.error import URLError
from urllib.request import Request, urlopen

SOURCE = "https://github.com/nflverse/nflverse-data/releases/download/schedules/games.csv"
OUT = Path(__file__).resolve().parents[1] / "data"


def normalize(rows: list[dict[str, str]]) -> list[dict[str, str]]:
    """Keep only public schedule fields and deduplicate by game identifier."""
    result: dict[str, dict[str, str]] = {}
    for row in rows:
        game_id = (row.get("game_id") or "").strip()
        season = (row.get("season") or "").strip()
        if not game_id or not season.isdigit():
            continue
        attendance = (row.get("attendance") or "").strip()
        try:
            attendance = str(int(float(attendance))) if attendance else ""
        except ValueError:
            attendance = ""
        result[game_id] = {
            "game_id": game_id,
            "season": season,
            "week": (row.get("week") or "").strip(),
            "gameday": (row.get("gameday") or "").strip(),
            "home_team": (row.get("home_team") or "").strip(),
            "away_team": (row.get("away_team") or "").strip(),
            "home_score": (row.get("home_score") or "").strip(),
            "away_score": (row.get("away_score") or "").strip(),
            "reported_attendance": attendance,
        }
    return sorted(result.values(), key=lambda item: (item["season"], item["week"], item["game_id"]))


def fetch() -> list[dict[str, str]]:
    request = Request(SOURCE, headers={"User-Agent": "Castella educational research demo"})
    with urlopen(request, timeout=20) as response:
        if response.status != 200:
            raise RuntimeError(f"Source returned HTTP {response.status}")
        text = response.read().decode("utf-8-sig")
    return normalize(list(csv.DictReader(text.splitlines())))


def write_data(rows: list[dict[str, str]]) -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    with (OUT / "games-normalized.csv").open("w", newline="", encoding="utf-8") as stream:
        writer = csv.DictWriter(stream, fieldnames=list(rows[0]) if rows else ["game_id"])
        writer.writeheader()
        writer.writerows(rows)
    report = {
        "source": SOURCE,
        "retrieved_at_utc": datetime.now(timezone.utc).isoformat(),
        "records": len(rows),
        "unique_game_ids": len({row["game_id"] for row in rows}),
        "seasons": sorted({row["season"] for row in rows}),
        "reported_attendance_records": sum(bool(row["reported_attendance"]) for row in rows),
        "attendance_definition": "Source-reported attendance only. Not verified gate scans or unique physical attendees.",
    }
    (OUT / "provenance.json").write_text(json.dumps(report, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(report, indent=2))


if __name__ == "__main__":
    try:
        records = fetch()
        if not records:
            raise RuntimeError("Source returned no valid schedule records")
        write_data(records)
    except (URLError, TimeoutError, UnicodeDecodeError, RuntimeError) as error:
        print(f"Data retrieval failed. No dataset was written. Source: {SOURCE}. Reason: {error}", file=sys.stderr)
        raise SystemExit(2)
