(function(root){
'use strict';
const format=n=>Number(n).toLocaleString('en-US',{maximumFractionDigits:1});
const metricLabel=metric=>({home:'season home reported attendance',away:'season away reported attendance',total:'season combined reported attendance',weekly:'weekly reported attendance'}[metric]);
function select(records,{team='',start=2000,end=2019}={}){return records.filter(r=>(!team||r.team===team)&&r.season>=start&&r.season<=end)}
function stats(rows,metric='home'){
 if(!['home','away','total','weekly'].includes(metric))throw Error('Unsupported attendance metric');
 const values=metric==='weekly'?rows.flatMap(r=>r.weekly.filter(v=>v!==null)):rows.map(r=>r[metric]);
 const sum=values.reduce((a,b)=>a+b,0); return {n:values.length,sum,mean:values.length?sum/values.length:null,missing:rows.reduce((a,r)=>a+r.weekly.filter(v=>v===null).length,0)};
}
function group(rows,key,metric){const keys=[...new Set(rows.map(r=>r[key]))].sort((a,b)=>String(a).localeCompare(String(b)));return keys.map(k=>({key:k,...stats(rows.filter(r=>r[key]===k),metric)}))}
function histogram(rows){const values=rows.flatMap(r=>r.weekly.filter(v=>v!==null));return Array.from({length:Math.max(1,Math.floor(Math.max(0,...values)/10000)+1)},(_,i)=>({key:`${format(i*10000)}–${format(i*10000+9999)}`,n:values.filter(v=>v>=i*10000&&v<(i+1)*10000).length}))}
function query(records,text,context={},filters={},scenario=null){
 const lower=text.toLowerCase(), teams=[...new Set(records.map(r=>r.team))];
 const matches=teams.filter(t=>lower.includes(t.toLowerCase())||lower.includes(t.split(' ').at(-1).toLowerCase()));
 const years=(text.match(/\b(?:19|20)\d{2}\b/g)||[]).map(Number);
 const follow=/that comparison|that number|where.*come from|how many games|sample|gate.scan|physical attendance|selected period|historical number/.test(lower);
 const historical=matches.length||years.length&&/attendance|reported|historical/.test(lower)||/historical|highest average|dataset|coverage/.test(lower)||follow&&context.active;
 if(!historical)return null;
 if(matches.length>1&&!/difference|compare|versus|between/.test(lower))return {context:{...context,active:true},text:'That team name spans multiple historical locations. Please specify the full city and team name.',source:'TidyTuesday 2020-02-04 historical names'};
 let next={...context,active:true,team:matches.length===1?matches[0]:context.team||filters.team||'',start:years[0]??context.start??filters.start??2000,end:years.at(-1)??context.end??filters.end??2019,metric:/combined|season total|total attendance/.test(lower)?'total':/away/.test(lower)?'away':/weekly|average.*attendance/.test(lower)?'weekly':context.metric||'home'};
 if(years.length===1)next.end=next.start;
 const source='TidyTuesday 2020-02-04 via Pro Football Reference · team-week / team-season records';
 const boundary='Reported attendance is not verified gate scans, unique physical attendees, or ticket utilization.';
 if(/highest.*game|lowest.*game|game.type|playoff|weather/.test(lower))return {context:next,text:'This export has no verified unique-game mapping, game type, or weather records. I cannot rank individual games or calculate those breakdowns.',source};
 const rows=select(records,next), result=stats(rows,next.metric);
 if(/where|source|come from/.test(lower))return {context:next,text:`Source: ${source}. Season totals are deduplicated across weeks. ${boundary}`,source};
 if(/gate.scan|physical attendance|utilization/.test(lower)&&! /scenario|tickets/.test(lower))return {context:next,text:boundary,source};
 if(!rows.length)return {context:next,text:'No validated attendance records are available for this selection.',source};
 const denominator=next.metric==='weekly'?'nonmissing team-week observations, including home and away appearances':'team-season observations';
 if(/how many games|sample|how many.*included/.test(lower))return {context:next,text:`This selection includes ${result.n} ${denominator} across ${rows.length} team-seasons. These are not verified unique games. ${result.missing} weekly values are missing.`,source};
 if(/highest|which team/.test(lower)){const ranked=group(select(records,{start:next.start,end:next.end}),'team',next.metric).sort((a,b)=>b.mean-a.mean);return {context:next,text:`Highest observed ${'mean '+metricLabel(next.metric)}: ${ranked[0].key}, ${format(ranked[0].mean)}, from ${ranked[0].n} ${denominator}, ${next.start}–${next.end}. ${boundary}`,source};}
 if(matches.length>=2){const names=[...new Set(matches)];if(names.length!==2)return {context:next,text:'That name spans historical locations. Please specify the city and team for this comparison.',source};const results=names.map(team=>stats(select(records,{...next,team}),next.metric));if(results.some(r=>!r.n))return {context:next,text:'No validated attendance records are available for one of those teams in this selection.',source};return {context:next,text:`${names[0]}: ${format(results[0].mean)} (n=${results[0].n}); ${names[1]}: ${format(results[1].mean)} (n=${results[1].n}). Difference: ${format(results[0].mean-results[1].mean)} in mean ${metricLabel(next.metric)}. ${boundary}`,source};}
 if(years.length===2&&/change|from|difference/.test(lower)){const a=stats(select(records,{...next,start:years[0],end:years[0]}),next.metric),b=stats(select(records,{...next,start:years[1],end:years[1]}),next.metric);if(!a.n||!b.n)return {context:next,text:'No validated attendance records are available for one endpoint.',source};return {context:next,text:`Observed mean changed from ${format(a.mean)} (n=${a.n}) in ${years[0]} to ${format(b.mean)} (n=${b.n}) in ${years[1]}: ${format(b.mean-a.mean)}. Unit: ${metricLabel(next.metric)}. This is descriptive, not causal.`,source};}
 if(/scenario|tickets/.test(lower)){const arrival=scenario?.arrivals;return {context:next,text:arrival===undefined||arrival===null?'Enter a ticket count and utilization assumption in the simulator first.':`Selected historical mean: ${format(result.mean)} (${result.n} ${denominator}). Illustrative scenario arrivals: ${format(arrival)}. Numeric difference: ${format(result.mean-arrival)}. These measurements have different definitions and periods. No historical no-show rate can be inferred.`,source};}
 if(/home.*average|average.*home/.test(lower))return {context:next,text:'Verified home-game denominators are unavailable. I can report season home totals or mean weekly reported attendance across home and away appearances.',source};
 return {context:next,text:`${next.team||'All historical team labels'}, ${next.start}–${next.end}: ${format(result.mean)} mean ${metricLabel(next.metric)}, using ${result.n} ${denominator}. ${result.missing} missing weekly values excluded from weekly means. ${boundary} Ask “how many games are included?” or “where did that number come from?”`,source};
}
const api={select,stats,group,histogram,query};if(typeof module!=='undefined')module.exports=api;root.CastellaHistory=api;
})(typeof window==='undefined'?globalThis:window);
