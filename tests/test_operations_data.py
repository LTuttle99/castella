import copy,importlib.util,json,unittest,hashlib
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
spec=importlib.util.spec_from_file_location('operations_pipeline',ROOT/'scripts/operations_pipeline.py');pipeline=importlib.util.module_from_spec(spec);spec.loader.exec_module(pipeline)
class OperationsDataTests(unittest.TestCase):
 def setUp(self):self.data=json.loads((ROOT/'data/operations/benchmarks.json').read_text())
 def test_published_export_hash_and_metadata(self):
  q=json.loads((ROOT/'data/operations/validation.json').read_text());self.assertEqual(hashlib.sha256((ROOT/'data/operations/benchmarks.json').read_bytes()).hexdigest(),q['bundle_sha256']);self.assertEqual(pipeline.validate(self.data)['records'],17)
 def test_source_dates_and_financial_definitions(self):
  r=next(r for r in self.data['records'] if r['id']=='msfa-2024-total-expenses');self.assertEqual((r['value'],r['publication_year'],r['observation_year']),(96927811,2025,2024));self.assertIn('depreciation',r['limitations'])
 def test_missing_metadata_fails(self):
  for key in ['unit','geography','publication_year','source_id','limitations']:
   d=copy.deepcopy(self.data);del d['records'][0][key]
   with self.subTest(key=key),self.assertRaises((ValueError,KeyError)):pipeline.validate(d)
 def test_unavailable_research_stays_unavailable(self):
  self.assertFalse(self.data['availability']['spending_per_attendee']['available']);self.assertFalse(self.data['availability']['indianapolis_wages']['available'])
 def test_wages_are_not_full_compensation(self):
  for r in self.data['records']:
   if r['category']=='labor':self.assertFalse(r['includes_benefits']);self.assertFalse(r['includes_employer_burden']);self.assertEqual(r['observation_year'],2023)
 def test_synthetic_value_never_published_as_assumption(self):
  self.data['records'][0]['evidence_type']='illustrative-placeholder'
  with self.assertRaises(ValueError):pipeline.validate(self.data)
if __name__=='__main__':unittest.main()
