'use strict';
window.castellaHistory={records:[],context:{},status:'loading'};
(function(){
 const $=s=>document.querySelector(s), h=window.castellaHistory, core=CastellaHistory;
 const fmt=n=>Number(n).toLocaleString('en-US',{maximumFractionDigits:1});
 function filters(){return {team:$('#historyTeam').value,start:Number($('#historyStart').value),end:Number($('#historyEnd').value),metric:$('#historyMetric').value}}
 h.filters=filters;
 function bars(target,rows,value='mean'){
  const node=$(target);node.replaceChildren();const max=Math.max(1,...rows.map(r=>r[value]||0));
  rows.forEach(r=>{const line=document.createElement('div');line.style.margin='10px 0';const text=document.createElement('div');text.textContent=`${r.key}: ${fmt(r[value])}${value==='mean'?` (n=${r.n})`:''}`;const bar=document.createElement('div');bar.style.cssText=`height:9px;background:#436b2d;border-radius:4px;width:${(r[value]||0)/max*100}%`;line.append(text,bar);node.append(line)});
 }
 function render(){
  const f=filters(),metric=$('#historyMetric').value,rows=core.select(h.records,f);
  if(!Number.isInteger(f.start)||!Number.isInteger(f.end)||f.start>f.end){h.selected=null;$('#historyStatus').textContent='Enter whole seasons with start not after end.';['#historyTime','#historyTeams','#historyDistribution','#historyCoverage'].forEach(s=>$(s).replaceChildren());$('#historyInsight').textContent='';return}
  if(!rows.length){h.selected=null;$('#historyStatus').textContent='No validated attendance records are available for this selection.';['#historyTime','#historyTeams','#historyDistribution','#historyCoverage'].forEach(s=>$(s).replaceChildren());$('#historyInsight').textContent='';return}
  const s=core.stats(rows,metric);h.selected={...s,metric,filters:f};
  $('#historyStatus').textContent=`${rows.length} team-seasons · ${s.n} ${metric==='weekly'?'nonmissing team-week observations':'season totals'} · ${s.missing} missing weekly observations. Reported attendance, not scans.`;
  bars('#historyTime',core.group(rows,'season',metric));bars('#historyTeams',core.group(rows,'team',metric));bars('#historyDistribution',core.histogram(rows),'n');bars('#historyCoverage',core.group(rows,'season','weekly'),'n');
  const rank=core.group(rows,'team',metric).sort((a,b)=>b.mean-a.mean)[0];$('#historyInsight').textContent=`Highest observed team mean in this selection: ${rank.key}, ${fmt(rank.mean)} (n=${rank.n}). Metric: ${$('#historyMetric').selectedOptions[0].textContent}. Team-week distribution includes home and away appearances, potentially both observations of one game. These data do not establish causes.`;
 }
 h.render=render;
 h.applySelection=raw=>{const action=CastellaTools.validateAction(raw);if(!action||action.type!=='history'||!core.select(h.records,action).length)return false;$('#historyTeam').value=action.team;$('#historyStart').value=action.start;$('#historyEnd').value=action.end;$('#historyMetric').value=action.metric;render();return true};
 $('#historyReset').onclick=()=>{$('#historyTeam').value='';$('#historyStart').value=2000;$('#historyEnd').value=2019;$('#historyMetric').value='home';render()};
 ['#historyTeam','#historyStart','#historyEnd','#historyMetric'].forEach(s=>$(s).addEventListener('change',render));
 $('#compareHistorical').onclick=()=>{if(!h.selected){$('#historicalComparison').textContent='Select validated historical records in Analytics first.';return}const t=Number($('#tickets').value),u=Number($('#util').value)/100;if(!Number.isFinite(t)||t<0){$('#historicalComparison').textContent='Enter a valid ticket scenario first.';return}$('#historicalComparison').textContent=`Historical selected mean ${fmt(h.selected.mean)} (${h.selected.metric}, n=${h.selected.n}) versus ${fmt(Math.round(t*u))} illustrative arrivals from ${fmt(t)} tickets at ${Number((u*100).toFixed(1))}%. Numeric difference ${fmt(h.selected.mean-Math.round(t*u))}. Periods and definitions differ. This does not measure historical no-shows.`};
 fetch('data/processed/attendance.json').then(r=>{if(!r.ok)throw Error('HTTP '+r.status);return r.json()}).then(data=>{h.records=data.records;h.metadata=data.metadata;h.status='ready';[...new Set(h.records.map(r=>r.team))].sort().forEach(team=>{const option=document.createElement('option');option.value=team;option.textContent=team;$('#historyTeam').append(option)});render()}).catch(()=>{h.status='unavailable';$('#historyStatus').textContent='Validated historical attendance data could not be loaded. Please retry by refreshing the page.'});
})();
