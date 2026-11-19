import importlib.util
import unittest
from pathlib import Path

MODULE = Path(__file__).parents[1] / "scripts" / "ingest_public.py"
SPEC = importlib.util.spec_from_file_location("ingest_public", MODULE)
INGEST = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(INGEST)


class NormalizeTests(unittest.TestCase):
    def test_normalizes_and_deduplicates_public_schedule_rows(self):
        rows = [
            {"game_id": "2024_01_A_B", "season": "2024", "week": "1", "attendance": "70123.0", "home_team": "A"},
            {"game_id": "2024_01_A_B", "season": "2024", "week": "1", "attendance": "70123", "home_team": "A"},
            {"game_id": "", "season": "2024"},
            {"game_id": "bad", "season": "x"},
        ]
        result = INGEST.normalize(rows)
        self.assertEqual(len(result), 1)
        self.assertEqual(result[0]["reported_attendance"], "70123")

    def test_invalid_attendance_is_missing_and_not_a_gate_scan_claim(self):
        result = INGEST.normalize([{"game_id": "g", "season": "2023", "attendance": "unknown"}])
        self.assertEqual(result[0]["reported_attendance"], "")


if __name__ == "__main__":
    unittest.main()
