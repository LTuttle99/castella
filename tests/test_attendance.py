"""Synthetic fixtures below are for testing only and are never exported."""
import csv
import io
import sys
import unittest
from pathlib import Path
sys.path.insert(0,str(Path(__file__).parents[1]/'scripts'))
import attendance_pipeline as pipeline


def fixture():
    stream=io.StringIO();writer=csv.writer(stream);writer.writerow(pipeline.COLUMNS)
    for week in range(1,18):
        writer.writerow(['St. Louis','Rams',2000,1600,800,800,week,100 if week<17 else 'NA'])
    return stream.getvalue().encode()


class AttendanceTests(unittest.TestCase):
    def test_season_totals_are_not_summed_seventeen_times(self):
        rows,quality=pipeline.normalize(fixture())
        self.assertEqual(rows[0]['home'],800)
        self.assertEqual(len(rows),1)
        self.assertEqual(rows[0]['team'],'St. Louis Rams')
        self.assertEqual(quality['missing_weekly_attendance'],1)
    def test_duplicate_is_counted_once(self):
        raw=fixture(); rows,q=pipeline.normalize(raw+raw.splitlines(keepends=True)[1]);self.assertEqual(q['duplicates'],1)
    def test_conflict_fails(self):
        with self.assertRaises(ValueError):pipeline.normalize(fixture().replace(b',1600,800,800,',b',1601,800,800,',1))
    def test_missing_week_fails(self):
        with self.assertRaises(ValueError):pipeline.normalize(b'\n'.join(fixture().splitlines()[:-1]))
    def test_negative_attendance_fails(self):
        with self.assertRaises(ValueError):pipeline.normalize(fixture().replace(b',100\r',b',-100\r',1))
    def test_schema_drift_fails(self):
        with self.assertRaises(ValueError):pipeline.normalize(fixture().replace(b'weekly_attendance',b'attendance'))
    def test_invalid_season_fails(self):
        with self.assertRaises(ValueError):pipeline.normalize(fixture().replace(b',2000,',b',2025,'))
    def test_published_manifest_and_integrity(self):self.assertTrue(pipeline.check())
