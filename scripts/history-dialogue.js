(function(root){
'use strict';
const H=typeof module!=='undefined'?require('./history.js'):root.CastellaHistory;
const format=n=>Number(n).toLocaleString('en-US',{maximumFractionDigits:2});
const source='TidyTuesday 2020-02-04 via Pro Football Reference · data/processed/attendance.json';
const url='https://github.com/rfordatascience/tidytuesday/tree/main/data/2020/2020-02-04';
const seasons=v=>v.start===v.end?String(v.start):`${v.start}–${v.end}`;
const missingText=n=>`${n} weekly value${n===1?' is':'s are'} missing`;
const label=metric=>({weekly:'weekly reported attendance (home and away appearances)',home:'season home reported attendance total',away:'season away reported attendance total',total:'season combined reported attendance total'}[metric]);
function createAdapter(records,filters=()=>({}),status=()=> 'ready'){
 return function(text,context={},environment={}){
  const q=text.toLowerCase().replace(/’/g,"'"),names=[...new Set(records.map(r=>r.team))];
  const full=names.filter(t=>q.includes(t.toLowerCase()));const matches=full.length?full:names.filter(t=>q.includes(t.split(' ').at(-1).toLowerCase()));
  const years=(q.match(/\b(?:19|20)\d{2}\b/g)||[]).map(Number),prior=context.current;
  const lastHistorical=environment.lastResult?.type==='history'||environment.topic?.startsWith('historical');
  const selected=/selected chart|selected historical|explain.*chart|chart.*show/.test(q);
  const scenarioComparison=/compar|difference/.test(q)&&/scenario|tickets|arrivals/.test(q)&&Boolean(prior);
  const researchTopic=/research|study|random forest|\bmae\b|\bmodel\b|poster|no.?shows?/.test(q)&&!matches.length&&!years.length;
  const chartRequest=/\b(?:chart|graph|plot|visuali[sz]e|trend line|show (?:me )?(?:the )?trend)\b/.test(q)&&!selected;
  const follow=Boolean(prior||context.team)&&lastHistorical&&!researchTopic&&/what about|next year|last year|previous year|year before|year after|did (?:that|it)|by how much|how much|compare those|how many games|sample|where|source|gate.scan|physical|simplify|why|explain|higher|lower/.test(q);
  const chartFollow=chartRequest&&(lastHistorical||!environment.scenario&&!/ticket|scenario|staff|parking/.test(q));
  const requested=matches.length||selected||scenarioComparison||follow||chartFollow||!researchTopic&&/historical|reported attendance|dataset|coverage|highest.*attendance|lowest.*attendance|explore.*attendance/.test(q)||years.length&&/attend/.test(q)||years.length&&context.team;
  if(/\d+(?:\.\d+)?\s*%/.test(q)&&/no.?shows?|show.?up|won't show|will not show/.test(q)&&!/attendance/.test(q))return null;
  if(!requested||/back to my scenario|what about (?:parking|staffing|concessions|entry)|\b(?:tickets?|show.?up|no.?show|utilization)\b.*\d|\d.*\b(?:tickets?|show.?up|no.?show)/.test(q)&&!matches.length&&!scenarioComparison)return null;
  const next={...context};
  const make=(body,extra={})=>({text:body,source,context:next,actions:[],suggestions:[],...extra});
  if(status()!=='ready'||!records.length)return make(status()==='loading'?'Historical records are still loading. Please try again shortly.':'Historical records could not be loaded. Refresh the page to retry.');
  const comparesTeams=/compare|difference|versus|between/.test(q)&&!scenarioComparison;
  if(context.comparedTeams&&scenarioComparison)return make('Which of the compared teams should I compare with your ticket scenario?');
  if(context.comparedTeams&&!matches.length&&(/next year|what about/.test(q)||years.length))return make('Which of the compared teams should I use for that season?');
  if(matches.length===1)next.comparedTeams=null;
  if(matches.length>1&&(!comparesTeams||matches.length!==2||full.length===0&&new Set(matches.map(t=>t.split(' ').at(-1))).size<2))return make('That name spans historical locations. Please specify the full city and team name.');
  const f=filters()||{};
  const metric= /home.*average|average.*home/.test(q)?'home-average':/combined|season total|total attendance/.test(q)?'total':/away/.test(q)?'away':/weekly|average|mean/.test(q)?'weekly':selected?f.metric||'home':context.metric||'weekly';
  if(metric==='home-average')return make('Verified home-game denominators are unavailable. I can show season home totals or mean weekly reported attendance across home and away appearances.');
  if(/highest.*game|lowest.*game|game.*highest|game.*lowest|game type|playoff|weather/.test(q))return make('This export does not have verified unique-game identity, game type, or game weather. I cannot calculate those breakdowns.');
  const team=selected?f.team||'':matches.length===1?matches[0]:context.team||f.team||'';
  let start=years[0]??(selected?f.start:context.start)??f.start??2000,end=years.at(-1)??(selected?f.end:context.end)??f.end??2019;
  if(years.length===1)end=start;
  if(/next year|year after|following year/.test(q)&&!years.length){if(!context.start)return make('Which starting season should I use?');start=context.start+1;end=start}
  if(/last year|previous year|year before|prior year/.test(q)&&!years.length){if(!context.start)return make('Which starting season should I use?');start=context.start-1;end=start}
  if(!Number.isInteger(start)||!Number.isInteger(end)||start>end)return make('Choose a valid season range with the start before the end.');
  const rows=H.select(records,{team,start,end}),s=H.stats(rows,metric);
  const value={team,start,end,metric,...s,teamSeasons:rows.length};
  const changed=!prior||['team','start','end','metric'].some(k=>prior[k]!==value[k]);
  const isMeta=/how many games|sample|where|source|gate.scan|physical/.test(q)||scenarioComparison||chartRequest&&!matches.length&&!years.length;
  if(!isMeta){next.previousTeam=next.team;Object.assign(next,{team,start,end,metric});if(changed){next.previous=prior?.n?prior:null;next.current=value}}
  const active=isMeta&&prior?prior:value;
  if(chartRequest){const span=active.start===active.end?{start:2000,end:2019}:{start:active.start,end:active.end};const rows2=H.select(records,{team:active.team,...span});const points=H.group(rows2,'season',active.metric).map(g=>({label:String(g.key),value:Math.round(g.mean),n:g.n,highlight:g.key>=active.start&&g.key<=active.end&&active.start===active.end}));if(!points.length)return make('No validated attendance records are available to chart for this selection.');return make(`Here’s mean ${label(active.metric)} by season for ${active.team||'all historical team labels'}, ${span.start}–${span.end}${active.start===active.end?`, with ${active.start} highlighted`:''}. Each bar is a mean of verified records; n varies by season.`,{value:active,chart:{type:'column',title:`${active.team||'All teams'} · ${label(active.metric)}`,unit:'reported attendance',points,source},actions:[{type:'history',team:active.team,start:span.start,end:span.end,metric:active.metric}],suggestions:['Which team had the highest attendance?','Where did you get that?']})}
  if(/where|source|come from|did you get/.test(q))return make(`The figures come from ${source}. Source documentation: ${url}. The export preserves historical names and counts season totals once per team-season.`,{value:active});
  if(/gate.scan|physical/.test(q)&&!scenarioComparison)return make('These are source-reported attendance figures, not verified gate scans or unique physical attendees. They cannot establish a measured ticket no-show rate.',{value:active});
  if(!active.n)return make(active.start<2000||active.end>2019?`No validated attendance records are available for ${seasons(active)}. The export covers 2000–2019 only, and I won’t estimate a figure outside it.`:'No validated attendance records are available for this selection.');
  const denominator=active.metric==='weekly'?'nonmissing team-week observations, including home and away appearances':'team-season observations';
  const action={type:'history',team:active.team,start:active.start,end:active.end,metric:active.metric};
  const card={kind:'history',title:'Historical reported attendance',rows:[['Team / location',active.team||'All historical labels'],['Seasons',seasons(active)],['Metric',label(active.metric)],['Verified mean',format(active.mean)],['Sample',`${active.n} ${denominator}`]],evidence:'Verified observation · source-reported attendance',source};
  if(active.team&&active.start===active.end&&active.teamSeasons===1){const row=H.select(records,{team:active.team,start:active.start,end:active.end})[0];card.rows.push(['Season home total',format(row.home)])}
  const common={value:active,card,actions:[action],suggestions:active.start===active.end?['What about last year?','How much did that change?','Show me a chart']:['Show me a chart','How many games are included?','Where did you get that?']};
  if(context.comparedTeams&&/how many games|sample|how many.*included/.test(q)){const count=context.comparedTeams.values.reduce((a,v)=>a+v.n,0);return make(`That comparison uses ${count} ${context.comparedTeams.metric==='weekly'?'nonmissing team-week':'team-season'} observations across the two teams. These are not verified unique games.`)}
  if(/how many games|sample|how many.*included/.test(q))return make(`The selection includes ${format(active.n)} ${denominator} across ${active.teamSeasons} team-season records, and ${missingText(active.missing)}. This is not a verified unique-game count.`,common);
  if(scenarioComparison){const scenario=environment.scenario;if(!scenario)return make('Which ticket scenario should I compare? Give a ticket count and assumed show-up rate first.');const mentioned=text.replace(/,/g,'').match(/(\d+)\s*[- ]?tickets?/i);if(mentioned&&Number(mentioned[1])!==scenario.tickets)return make(`Your active scenario uses ${format(scenario.tickets)} tickets. Set the new count and show-up rate first so I can compare the intended scenario.`);
   return make(`Historical mean: ${format(active.mean)} (${active.n} ${denominator}). Your ${format(scenario.tickets)}-ticket scenario at ${format(scenario.showUp*100)}% assumes ${format(scenario.arrivals)} physical arrivals. Numeric difference: ${format(active.mean-scenario.arrivals)}. The periods and measurement definitions differ; this is not a historical no-show calculation.`,{...common,card:{title:'Historical versus illustrative',rows:[['Historical reported mean',format(active.mean)],['Illustrative arrivals',format(scenario.arrivals)],['Numeric difference',format(active.mean-scenario.arrivals)]]}})}
  if(/did (?:that|it) (?:increase|decrease|change|go up|go down)|by how much|compare those|how much (?:more|less|higher|lower|did (?:that|it) (?:increase|decrease|change))|^how much higher|^how much lower/.test(q)){
   const previous=next.previous;if(!previous||previous.metric!==active.metric)return make('Retrieve another team or season using the same metric first so I have two comparable results.');
   const difference=active.mean-previous.mean,percent=previous.mean?difference/previous.mean*100:null;
   return make(`The mean ${difference<0?'decreased':difference>0?'increased':'was unchanged'} from ${format(previous.mean)} in ${seasons(previous)} (n=${previous.n}) to ${format(active.mean)} in ${seasons(active)} (n=${active.n}). Difference: ${format(difference)}${percent===null?'':` (${format(percent)}%)`}. Metric: ${label(active.metric)}. This descriptive comparison does not establish a cause.`,{...common,card:{kind:'comparison',title:'Historical comparison',rows:[[seasons(previous)+' mean',format(previous.mean)],[seasons(active)+' mean',format(active.mean)],['Absolute difference',format(difference)],['Relative difference',percent===null?'Unavailable':format(percent)+'%']],evidence:'Derived from verified observations'},comparison:{previous,current:active,difference,percent}})
  }
  if(matches.length===2&&comparesTeams){const values=matches.map(t=>({team:t,...H.stats(H.select(records,{team:t,start,end}),metric)}));if(values.some(v=>!v.n))return make('No validated attendance records are available for one of those teams in this period.');const difference=values[0].mean-values[1].mean;next.comparedTeams={values,metric};return make(`${values[0].team}: ${format(values[0].mean)} (n=${values[0].n}); ${values[1].team}: ${format(values[1].mean)} (n=${values[1].n}). Difference: ${format(difference)} in mean ${label(metric)}.`,{...common,card:{title:'Historical team comparison',rows:values.map(v=>[v.team,`${format(v.mean)} (n=${v.n})`]).concat([['Difference',format(difference)]])},actions:matches.map(team=>({type:'history',team,start,end,metric})),teamComparison:{values,difference}})}
  if(/highest|which team/.test(q)){const ranking=H.group(H.select(records,{start,end}),'team',metric).sort((a,b)=>b.mean-a.mean);if(!ranking.length)return make('No validated attendance records are available for this selection.');return make(`Highest observed team mean: ${ranking[0].key}, ${format(ranking[0].mean)} (${ranking[0].n} ${metric==='weekly'?'nonmissing team-week observations':'team-seasons'}), ${start}–${end}. Metric: ${label(metric)}.`,{...common,ranking})}
  if(/why|cause/.test(q))return make('These records show attendance differences, but they do not establish why a change occurred. A causal explanation would need additional evidence.',common);
  const overview=!active.team&&/explore|overview|historical nfl attendance/.test(q);if(overview){const points=H.group(H.select(records,{start:active.start,end:active.end}),'season',active.metric).map(g=>({label:String(g.key),value:Math.round(g.mean),n:g.n}));common.chart={type:'column',title:'All teams · '+label(active.metric),unit:'reported attendance',points,source};common.suggestions=['How many people attended Colts games in 2015?','Which team had the highest attendance?','Where did you get that?']}
  return make(`${active.team||'All historical team labels'}, ${seasons(active)}: ${format(active.mean)} mean ${label(active.metric)}, using ${format(active.n)} ${denominator}; ${missingText(active.missing)}. ${active.metric==='weekly'?'Weekly rows include away games, so one game can appear twice. ':''}These are reported figures, not verified physical entry counts.${overview?' Ask about a team and season, or open the explorer for filters.':''}`,common);
 };
}
const api={createAdapter};if(typeof module!=='undefined')module.exports=api;root.CastellaHistoryDialogue=api;
})(typeof window==='undefined'?globalThis:window);
