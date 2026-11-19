(function(root){
'use strict';
const T=typeof module!=='undefined'?require('./tools.js'):root.CastellaTools;
const C=typeof module!=='undefined'?require('./conversation.js'):root.CastellaConversation;
const S=typeof module!=='undefined'?require('./scenario.js'):root.CastellaScenario;
const f=n=>Number(n).toLocaleString('en-US',{maximumFractionDigits:2});
const obj=(properties={},required=[])=>({type:'object',properties,required,additionalProperties:false});
const num=(min,max,integer=false)=>({type:integer?'integer':'number',minimum:min,maximum:max});
const choice=values=>({type:'string',enum:values});
const definitions=[
 ['ticket_scenario','Set explicitly requested ticket count and arrival fraction.',obj({tickets:num(0,1e7,true),show_up:num(0,1),no_show:num(0,1),definition:choice(['sold','distributed','eligible'])})],
 ['change_utilization','Calculate a percentage-point or proportional rate change.',obj({amount:num(0,1),method:choice(['points','relative']),direction:choice(['increase','decrease']),rate:choice(['show_up','no_show'])},['amount','method','direction','rate'])],
 ['compare_scenarios','Compare previous and current ticket scenarios.',obj()],
 ['operations','Use current arrivals and actual editable operating assumptions.',obj({kind:choice(['staffing','parking','concessions','entry'])},['kind'])],
 ['historical_attendance','Answer the actual user question from validated historical records.',obj()],
 ['research_findings','Read original research or general model definitions.',obj({topic:choice(['performance','scope','features','availability','definition'])},['topic'])],
 ['metric_definitions','Explain reported attendance versus tickets, scans and arrivals.',obj()],
 ['open_section','Offer an allowlisted navigation button; never execute code.',obj({page:choice(['simulator','operations','analytics','research'])},['page'])],
 ['selected_scenario','Read the explicitly selected simulator scenario.',obj()],
 ['verified_answer','Use the existing trusted conversation engine for this question.',obj()]
].map(([name,description,parameters])=>({type:'function',function:{name,description,parameters}}));
function validate(schema,value){
 if(schema.type==='object'){
  if(!value||typeof value!=='object'||Array.isArray(value)||![Object.prototype,null].includes(Object.getPrototypeOf(value)))throw Error('Tool arguments must be a plain object.');
  if(Object.keys(value).some(k=>!Object.hasOwn(schema.properties,k)))throw Error('Unsupported tool argument.');
  if(schema.required.some(k=>!Object.hasOwn(value,k)))throw Error('Missing required tool argument.');
  for(const [k,v]of Object.entries(value))validate(schema.properties[k],v);return;
 }
 if(schema.type==='number'||schema.type==='integer'){if(typeof value!=='number'||!Number.isFinite(value)||value<schema.minimum||value>schema.maximum||schema.type==='integer'&&!Number.isInteger(value))throw Error('Invalid numeric tool argument.');return}
 if(schema.type==='string'&&(typeof value!=='string'||!schema.enum.includes(value)))throw Error('Invalid tool choice.');
}
function canonical(value){return JSON.stringify(value,Object.keys(value).sort())}
function textForContext(text,state){let q=C.normalize(text);if(state.scenario.tickets!==null){q=q.replace(/^around (\d+(?:\.\d+)?)%[.?! ]*$/,'$1% show up');const follow=q.match(/^what about (\d+(?:\.\d+)?)(?:%?)[.?! ]*$/);if(follow&&Number(follow[1])<=100&&!state.topic?.startsWith('historical'))q=`what if ${follow[1]}% attend`;}return q}
function registry(initial,text,options={},ledger=new Map()){
 let state=JSON.parse(JSON.stringify(initial));const applied=new Set();const question=textForContext(text,state);const baseline=C.respond(state,question,options);
 const numberTokens=(question.match(/\d[\d,]*(?:\.\d+)?\s*(?:k|thousand)?/gi)||[]).map(v=>{const n=parseFloat(v.replaceAll(',',''));return /k|thousand/i.test(v)?n*1000:n});
 const rate=S.parseRate(question);
 function grounded(value,kind){const current=state.scenario.current;if(kind==='tickets'&&(value===state.scenario.tickets||value===options.selectedScenario?.tickets&&/selected|simulator/.test(question)))return;
  if(kind==='rate'&&(value===state.scenario.showUp||value===state.scenario.noShow))return;
  if(kind==='tickets'&&numberTokens.includes(value))return;
  if(kind==='rate'&&(rate!==null&&(Math.abs(value-rate)<1e-8||Math.abs(value-(1-rate))<1e-8)||numberTokens.some(n=>Math.abs(value-n/100)<1e-8)))return;
  throw Error('The proposed value was not supplied by the user or verified context.');
 }
 function scenarioResponse(v){return {intent:'scenario',text:`${f(v.tickets)} ${v.definition} tickets × ${f(v.showUp*100)}% assumed show-up = ${f(v.arrivals)} illustrative arrivals; ${f(v.unused)} unused tickets.`,source:'Verified ticket utilization tool · user assumptions',card:{title:'Ticket scenario',rows:[['Tickets '+v.definition,f(v.tickets)],['Assumed show-up',f(v.showUp*100)+'%'],['Illustrative arrivals',f(v.arrivals)],['Unused tickets',f(v.unused)]]},actions:[{type:'scenario',scenario:v}],suggestions:['And parking?','Compare those two.'],facts:v}}
 function setScenario(v){const old=state.scenario.current;state.scenario={...state.scenario,...v,current:v,previous:old&&JSON.stringify(old)!==JSON.stringify(v)?old:state.scenario.previous};state.lastResult={type:'scenario',value:v};state.topic='scenario';return scenarioResponse(v)}
 function execute(name,args){const def=definitions.find(d=>d.function.name===name);if(!def)throw Error('Unsupported tool.');validate(def.function.parameters,args);
  const key=name+canonical(args);if(ledger.has(key)){const cached=ledger.get(key);if(!applied.has(key))state=JSON.parse(JSON.stringify(cached.state));applied.add(key);return cached.result}
  if(ledger.size>=4)throw Error('Tool-call limit reached.');
  let result;
  if(baseline.intent==='integrity')result=baseline;
  else if(name==='ticket_scenario'){
   if(args.show_up!==undefined&&args.no_show!==undefined)throw Error('Specify show-up or no-show, not both.');
   if(args.tickets!==undefined)grounded(args.tickets,'tickets');if(args.show_up!==undefined)grounded(args.show_up,'rate');if(args.no_show!==undefined)grounded(args.no_show,'rate');
   if(baseline.intent==='clarify'&&state.scenario.current&&/another|additional/.test(question))result=baseline;
   else {
    const tickets=args.tickets??state.scenario.tickets,showUp=args.show_up??(args.no_show===undefined?state.scenario.showUp:1-args.no_show),definition=args.definition??state.scenario.definition;
    if(args.definition&&args.definition!==state.scenario.definition&&!question.includes(args.definition))throw Error('Ticket definition was not requested.');
    if(tickets===null||showUp===null){state.scenario={...state.scenario,tickets,showUp,noShow:showUp===null?null:1-showUp,definition};result={intent:'clarify',text:tickets===null?(showUp===null?'How many tickets and what assumed show-up rate should I use?':`I have ${f(showUp*100)}% assumed show-up. How many tickets should I use?`):`I have ${f(tickets)} ${definition} tickets. What show-up rate should I use?`,facts:{tickets,showUp},source:'Scenario needs an explicit assumption',actions:[],suggestions:['Around 90%.']}}
    else {const v=T.scenario(tickets,showUp,definition);if(baseline.intent==='scenario'&&(baseline.state.scenario.current.tickets!==v.tickets||Math.abs(baseline.state.scenario.current.showUp-v.showUp)>1e-8))throw Error('Model interpretation conflicts with an explicit scenario.');result=setScenario(v)}
   }
  }else if(name==='change_utilization'){
   grounded(args.amount,'rate');const current=state.scenario.current;if(!current)throw Error('Set a starting ticket scenario first.');
   if(/another|additional/.test(question)&&!/points|proportional|relative/.test(question))result={intent:'clarify',text:'Do you mean percentage points or a proportional change?',source:'Ambiguous rate change',actions:[],suggestions:[]};
   else {const base=args.rate==='show_up'?current.showUp:current.noShow,delta=args.method==='points'?args.amount:base*args.amount,newRate=base+(args.direction==='increase'?delta:-delta);T.number(newRate,0,1);const v=T.scenario(current.tickets,args.rate==='show_up'?newRate:1-newRate,current.definition);if(baseline.intent==='scenario'&&Math.abs(baseline.state.scenario.current.showUp-v.showUp)>1e-8)throw Error('Rate change conflicts with the explicit request.');result=setScenario(v)}
  }else if(name==='compare_scenarios'){
   const v=T.compare(state.scenario.previous,state.scenario.current);result={intent:'comparison',text:`Previous ${f(v.previous.arrivals)}, current ${f(v.current.arrivals)} illustrative arrivals. Difference ${f(v.difference)}${v.percent===null?'':` (${f(v.percent)}%)`}.`,source:'Verified scenario comparison',actions:[],suggestions:[],facts:v,card:{title:'Scenario comparison',rows:[['Previous',f(v.previous.arrivals)],['Current',f(v.current.arrivals)],['Change',f(v.difference)]]}};state.lastResult={type:'comparison',value:v};state.topic='comparison';
  }else if(name==='operations'){
   if(!state.scenario.current)throw Error('A ticket scenario is needed before estimating operations.');const v=T.operations(state.scenario.current.arrivals,options.assumptions||state.assumptions),unit={staffing:'staff',parking:'vehicles',concessions:'concession units',entry:'entry lanes'}[args.kind];state.assumptions=v.assumptions;state.topic='operations';state.lastResult={type:'operations',value:v,operation:args.kind};result={intent:'operations',text:`${f(v.arrivals)} illustrative arrivals imply ${f(v[args.kind])} ${unit} using the current editable assumptions and rounding up. Confirm operational and safety requirements with qualified staff.`,source:'Verified operations tool · current editable assumptions',actions:[{type:'open',page:'operations'}],suggestions:[],facts:{kind:args.kind,value:v[args.kind],...v},card:{title:args.kind,rows:[['Illustrative arrivals',f(v.arrivals)],[unit,f(v[args.kind])]]}};
  }else if(name==='historical_attendance'){
   if(!options.historyAdapter)throw Error('Validated historical records are unavailable.');const env={scenario:state.scenario.current||(options.selectedScenario?T.scenario(options.selectedScenario.tickets,options.selectedScenario.showUp,options.selectedScenario.definition):null),lastResult:state.lastResult,topic:state.topic};let r=options.historyAdapter(text,state.historical,env);if(!r&&/interesting|data|historical/.test(question))r=options.historyAdapter('Which team had the highest average reported attendance in the selected period?',state.historical,env);if(!r)throw Error('Specify a historical team, season, or supported follow-up.');state.historical=r.context;state.lastResult={type:'history',value:r.value||null};state.topic='historical';result={intent:'historical',...r,facts:{current:r.value||null,previous:r.context.previous||null,recordIds:(options.historyRecords||[]).filter(row=>(!r.context.team||row.team===r.context.team)&&row.season>=r.context.start&&row.season<=r.context.end).slice(0,8).map(row=>row.id)}};
  }else if(name==='research_findings'){
   const questions={performance:'Which model performed best?',scope:'What was the study scope?',features:'Which features mattered?',availability:'Can this predict an upcoming game?',definition:'What does MAE mean?'};const r=C.respond(state,questions[args.topic],options);result={...r,facts:T.research};state.lastResult={type:'research',value:T.research};state.topic='research';if(args.topic==='definition')result.text+=' General background: a random forest combines decision-tree predictions; this explanation is separate from the study metrics.';
  }else if(name==='metric_definitions')result={intent:'definitions',text:'Tickets sold and tickets distributed describe eligible inventory. Reported attendance uses the source definition. Scans record entry events, which can differ from unique physical people. Illustrative arrivals are tickets multiplied by the user-assumed show-up fraction. Reported attendance is not proof of scans or a measured no-show rate.',source:'Castella data dictionary',actions:[{type:'open',page:'research'}],suggestions:[]};
  else if(name==='open_section')result={intent:'navigation',text:'Open the requested view using the button below.',source:'Allowlisted application navigation',actions:[{type:'open',page:args.page}],suggestions:[]};
  else if(name==='selected_scenario'){const v=options.selectedScenario;if(!v)throw Error('No simulator scenario is selected.');result=setScenario(T.scenario(v.tickets,v.showUp,v.definition))}
  else {result=baseline;state=JSON.parse(JSON.stringify(baseline.state))}
  const {state:discard,context:discardContext,...publicResult}=result;result={actions:[],suggestions:[],...publicResult};result.actions=result.actions.map(T.validateAction).filter(Boolean);
  applied.add(key);ledger.set(key,{result,state:JSON.parse(JSON.stringify(state))});return result;
 }
 return {execute,definitions,get state(){return state},baseline,ledger};
}
const api={definitions,validate,registry,textForContext};if(typeof module!=='undefined')module.exports=api;root.CastellaLocalTools=api;
})(typeof window==='undefined'?globalThis:window);
