#!/usr/bin/env python3
"""Offline checks and explicit, bounded collection of public operational references."""
import argparse,hashlib,json,math,re,time,zipfile,io
from datetime import datetime,timezone
from html.parser import HTMLParser
from pathlib import Path
from urllib.request import Request,urlopen
from urllib.parse import urlsplit
from urllib.robotparser import RobotFileParser
from xml.etree import ElementTree as ET
ROOT=Path(__file__).resolve().parents[1]
RAW=ROOT/'work/phase7'
OUT=ROOT/'data/operations'
SOURCES=[
 {'id':'bls-national','file':'bls-national-zip','url':'https://www.bls.gov/oes/special.requests/oesm23nat.zip','title':'May 2023 National Occupational Employment and Wage Estimates','publisher':'U.S. Bureau of Labor Statistics','publication_year':2024,'observation_year':2023,'geography':'United States','venue_type':'Cross-industry occupational employers, not NFL-specific','methodology':'OEWS employer survey/model-based occupational wage estimates; nominal May 2023 hourly wages; excludes self-employed workers.','usage':'U.S. government statistical facts; attribution retained; only selected observations redistributed.'},
 {'id':'msfa-2024','file':'msfa-2024.pdf','url':'https://www.msfa.com/df-data/files/Final%20-%20MSFA%202024%20Legislative%20Report.pdf','title':'2024 Legislative Report, including FY2024 audited financial statements','publisher':'Minnesota Sports Facilities Authority','publication_year':2025,'publication_year_note':'Cover letter dated January 15, 2025; report title and financial observation year are 2024.','observation_year':2024,'geography':'Minneapolis, Minnesota','venue_type':'Public stadium authority / U.S. Bank Stadium, all authority operations','methodology':'Accrual-basis statement of revenues, expenses and changes in net position; fiscal year ended June 30, 2024, printed page 24 / PDF page 46.','usage':'Limited factual extraction from public financial disclosure; attribution; full report not redistributed.'},
 {'id':'los-capacity','file':'los-capacity','url':'https://www.lucasoilstadium.com/tours-stadium-info/background-history/','title':'About Lucas Oil Stadium: Background & History','publisher':'Indiana Convention Center & Lucas Oil Stadium','publication_year':None,'publication_year_note':'Source page is undated; retrieval year is not a publication year.','observation_year':None,'geography':'Indianapolis, Indiana','venue_type':'NFL football stadium configuration','methodology':'Venue-published approximate football seating capacity; not event-specific saleable inventory.','usage':'Limited factual extraction with attribution; full page not redistributed.'},
 {'id':'sgsa-ingress','file':'sgsa-ingress','url':'https://sgsa.org.uk/physical-factors/circulation/ingress/','title':'Ingress: entry capacity – rates of entry','publisher':'Sports Grounds Safety Authority','publication_year':None,'publication_year_note':'Undated online guidance; publication year is unavailable.','observation_year':None,'geography':'United Kingdom','venue_type':'Sports grounds guidance, not an NFL security-screening study','methodology':'Guidance requires lower measured rates to be used where below 660 people/entry point/hour, and annual entry-rate measurement.','usage':'Limited factual reference with attribution; guidance text not redistributed.'}
]
ROLES={'33-9032':'security','39-3031':'ushers','35-3023':'food','53-6021':'parking','37-2011':'cleaning','33-1091':'supervisors'}
class Text(HTMLParser):
 def __init__(self):super().__init__();self.parts=[]
 def handle_data(self,data):self.parts.append(data)
def xlsx_rows(content):
 ns={'s':'http://schemas.openxmlformats.org/spreadsheetml/2006/main'}
 with zipfile.ZipFile(io.BytesIO(content)) as z:
  strings=[]
  if 'xl/sharedStrings.xml' in z.namelist():
   strings=[''.join(x.itertext()) for x in ET.fromstring(z.read('xl/sharedStrings.xml')).findall('s:si',ns)]
  rows=[]
  for row in ET.fromstring(z.read('xl/worksheets/sheet1.xml')).findall('.//s:sheetData/s:row',ns):
   values={}
   for cell in row.findall('s:c',ns):
    col=re.match('[A-Z]+',cell.attrib['r'])[0];v=cell.find('s:v',ns);value=v.text if v is not None else None
    if cell.attrib.get('t')=='s' and value is not None:value=strings[int(value)]
    elif cell.attrib.get('t')=='inlineStr':value=''.join(cell.find('s:is',ns).itertext())
    values[col]=value
   rows.append(values)
  header=rows[0];return [{name:r.get(col) for col,name in header.items()} for r in rows[1:]]
def record(source,key,value,unit,category,title,evidence,measurement,limitations,**extra):
 return {'id':key,'value':value,'unit':unit,'category':category,'title':title,'source_id':source['id'],'source_url':source['url'],'publisher':source['publisher'],'publication_year':source['publication_year'],'publication_year_note':source.get('publication_year_note','Published report/estimate release year.'),'observation_year':source['observation_year'],'geography':source['geography'],'venue_type':source['venue_type'],'methodology':source['methodology'],'evidence_type':evidence,'measurement_type':measurement,'limitations':limitations,'retrieved_at':source['retrieved_at'],'usage_status':source['usage'],**extra}
def validate(data):
 required={'id','value','unit','category','title','source_id','source_url','publisher','publication_year','publication_year_note','observation_year','geography','venue_type','methodology','evidence_type','measurement_type','limitations','retrieved_at','usage_status'}
 sources={s['id']:s for s in data['sources']};seen=set()
 for r in data['records']:
  if not required<=set(r):raise ValueError('Missing benchmark metadata')
  if r['id'] in seen:raise ValueError('Duplicate benchmark identifier')
  seen.add(r['id'])
  if not isinstance(r['value'],(float,int)) or isinstance(r['value'],bool) or not math.isfinite(r['value']) or r['value']<0:raise ValueError('Invalid benchmark value')
  if r['source_id'] not in sources or r['source_url']!=sources[r['source_id']]['url']:raise ValueError('Untraceable source')
  if r['evidence_type'] not in ('verified-observed-data','published-benchmark','derived-estimate'):raise ValueError('Unapproved evidence class in published records')
  if r['publication_year'] is not None and not 1900<=r['publication_year']<=2100:raise ValueError('Invalid publication year')
  if any(not r[k] for k in ['unit','geography','limitations','methodology','usage_status','publication_year_note']):raise ValueError('Blank provenance metadata')
  if r['category']=='labor' and (r['unit']!='USD/hour' or r.get('includes_benefits') is not False or r.get('includes_employer_burden') is not False):raise ValueError('Wage is not full compensation')
  if r['category'] in ('expenses','financial-revenue') and r['unit']!='USD/fiscal-year':raise ValueError('Annual financial scope changed')
 if data['availability']['spending_per_attendee']['available']:raise ValueError('No supported dollar-per-attendee benchmark was collected')
 return {'passed':True,'records':len(seen),'sources':len(sources),'duplicates':0,'financial_scope':'Annual authority figures, not per-event or per-attendee costs','missing_publication_years_explicit':sum(r['publication_year'] is None for r in data['records'])}
def rebuild():
 sources=[];now=datetime.now(timezone.utc).isoformat();logs=[]
 for path in RAW.glob('acquisition-*-pass.json'):logs+=json.loads(path.read_text())
 for s in SOURCES:
  p=RAW/s['file']
  if not p.exists():raise ValueError('Required source missing: '+s['id'])
  sources.append({**s,'retrieved_at':datetime.fromtimestamp(p.stat().st_mtime,timezone.utc).isoformat(),'sha256':hashlib.sha256(p.read_bytes()).hexdigest(),'raw_bundled':False,'acquisition':'HTTPS download succeeded; bounded public source retrieval'})
 by={s['id']:s for s in sources};records=[]
 with zipfile.ZipFile(RAW/'bls-national-zip') as z:rows=xlsx_rows(z.read('oesm23nat/national_M2023_dl.xlsx'))
 for row in rows:
  if row.get('OCC_CODE') not in ROLES:continue
  for field,stat in [('H_MEAN','mean'),('H_MEDIAN','median')]:
   value=float(row[field]);code=row['OCC_CODE'];records.append(record(by['bls-national'],f'bls-2023-{code}-{stat}',value,'USD/hour','labor',f"{row['OCC_TITLE']} — national hourly {stat}",'published-benchmark','survey-estimated','May 2023 nominal cross-industry wage; not an NFL rate, current quote, contractor bill rate, Indianapolis wage or total compensation.',occupation_code=code,role=ROLES[code],statistic=stat,includes_benefits=False,includes_employer_burden=False,table_field=field))
 from pypdf import PdfReader  # Optional collection dependency; offline checks do not import it.
 text=PdfReader(RAW/'msfa-2024.pdf').pages[45].extract_text()
 for key,label,value in [('msfa-2024-total-expenses','Total operating expenses',96927811),('msfa-2024-stadium-expenses','Stadium operating expenses',49479796),('msfa-2024-stadium-revenue','Stadium operating revenues',43832603)]:
  if not re.search(re.escape(label)+r'\s+'+re.escape(f'{value:,}'),text):raise ValueError('Financial statement row changed: '+label)
  records.append(record(by['msfa-2024'],key,value,'USD/fiscal-year','financial-revenue' if 'revenue' in key else 'expenses',label+' — FY2024','verified-observed-data','audited-accrual-financial','One authority and fiscal year, all operations. Total expense includes depreciation/amortization. Stadium revenue is not identified as gross concession sales. No valid per-attendee/event denominator; not a transferable NFL cost.',pdf_page=46,printed_page=24,selectable_for_calculation=False))
 for key,value,needle,unit,category,title,limit in [('los-capacity',67000,'approximately 67,000','seats','capacity','Lucas Oil Stadium approximate football seating','Approximate configuration reference; event capacity and saleable inventory can differ. Undated, not a current event guarantee.'),('sgsa-ingress',660,'660 persons per entry point per hour','people/entry-point/hour','entry','UK entry guidance reference','Reference guidance, not measured NFL throughput or a security-screening standard. Use lower measured rates; simplified lane math does not establish safe capacity.')]:
  parser=Text();parser.feed((RAW/key).read_text());flat=' '.join(' '.join(parser.parts).split())
  if needle not in flat:raise ValueError('Source statement changed: '+key)
  records.append(record(by[key],key+'-reference',value,unit,category,title,'published-benchmark','publisher-reference',limit,selectable_for_calculation=False))
 availability={key:{'available':False,'reason':reason} for key,reason in {
 'spending_per_attendee':'No suitable published absolute USD-per-attendee NFL observation with a verified denominator was collected. Custom gross-spending assumption only.',
 'staffing_ratio':'No universal empirical NFL staffing ratio was verified. Role counts and existing ratio remain planning assumptions.',
 'parking_mode_share':'No venue/event-specific measured mode share or vehicle occupancy dataset was verified.',
 'entry_throughput':'No measured NFL ticket/security processing rate was verified. UK guidance is reference-only.',
 'indianapolis_wages':'Official metropolitan ZIP and Indianapolis HTML attempts returned 403; national data are not city wages.'}.items()}
 data={'schema_version':1,'sources':sources,'records':records,'availability':availability,'acquisition_attempts':logs,'definitions':{'verified-observed-data':'Published observed/audited historical facts with documented scope.','published-benchmark':'Published estimate/reference with limited transferability.','derived-estimate':'Deterministic calculation from identified inputs.','user-assumption':'Explicit user-entered hypothetical value.','illustrative-placeholder':'Unsupported demonstrative starting value.'}}
 quality=validate(data);bundle=json.dumps(data,indent=2)+'\n';quality['bundle_sha256']=hashlib.sha256(bundle.encode()).hexdigest();OUT.mkdir(parents=True,exist_ok=True);(OUT/'benchmarks.json').write_text(bundle);(OUT/'validation.json').write_text(json.dumps(quality,indent=2)+'\n');(ROOT/'OPERATIONS_PROVENANCE.json').write_text(json.dumps({'sources':sources,'attempts':logs,'records':len(records)},indent=2)+'\n');print(json.dumps(quality))
def fetch():
 RAW.mkdir(parents=True,exist_ok=True);logs=[];agent='CastellaResearch/1.0'
 for source in SOURCES:
  url=source['url'];parts=urlsplit(url);robot_url=f'{parts.scheme}://{parts.netloc}/robots.txt';policy=RobotFileParser()
  try:
   with urlopen(Request(robot_url,headers={'User-Agent':agent}),timeout=30) as response:robot=response.read(100000).decode('utf-8','replace')
   policy.parse(robot.splitlines())
  except Exception as e:
   if getattr(e,'code',None)==404:policy.parse([])
   else:logs.append({'url':url,'error':'Robots policy unavailable; collection skipped: '+str(e)});continue
  if not policy.can_fetch(agent,url):logs.append({'url':url,'error':'Disallowed by robots.txt; skipped'});continue
  try:
   with urlopen(Request(url,headers={'User-Agent':agent}),timeout=30) as response:raw=response.read(20000001)
   if len(raw)>20000000:raise ValueError('Source exceeds 20 MB limit')
   (RAW/source['file']).write_bytes(raw);logs.append({'id':source['id'],'url':url,'status':200,'sha256':hashlib.sha256(raw).hexdigest(),'bytes':len(raw)})
  except Exception as e:logs.append({'url':url,'error':str(e)})
  time.sleep(2)
 (RAW/'acquisition-pipeline-pass.json').write_text(json.dumps(logs,indent=2));print(json.dumps(logs))
if __name__=='__main__':
 parser=argparse.ArgumentParser();parser.add_argument('--fetch',action='store_true');parser.add_argument('--rebuild',action='store_true');parser.add_argument('--check',action='store_true');args=parser.parse_args()
 if args.fetch:fetch()
 if args.rebuild:rebuild()
 if args.check:
  data=(OUT/'benchmarks.json').read_bytes();quality=json.loads((OUT/'validation.json').read_text())
  if hashlib.sha256(data).hexdigest()!=quality['bundle_sha256']:raise ValueError('Approved operations export hash mismatch')
  print(json.dumps(validate(json.loads(data))))
 if not any(vars(args).values()):parser.error('Choose --check, --fetch or --rebuild')
