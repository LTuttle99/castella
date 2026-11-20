(function(root){
'use strict';
function number(value,min=0,max=1e7){if(typeof value!=='number'||!Number.isFinite(value)||value<min||value>max)throw Error('Use finite values within the supported planning range.');return value}
function scenario(tickets,showUp,definition='sold'){
 number(tickets);if(!Number.isSafeInteger(tickets))throw Error('Ticket counts must be whole numbers.');number(showUp,0,1);
 if(!['sold','distributed','eligible'].includes(definition))throw Error('Unknown ticket definition.');
 const arrivals=Math.round(tickets*showUp);return {tickets,definition,showUp,noShow:1-showUp,arrivals,unused:tickets-arrivals};
}
function compare(previous,current){if(!previous||!current)throw Error('Two scenarios are needed.');const difference=current.arrivals-previous.arrivals;return {previous,current,difference,percent:previous.arrivals?difference/previous.arrivals*100:null}}
const defaults={staffRatio:250,staffBuffer:10,purchase:.7,units:1.4,buffer:15,carShare:65,peopleCar:2.5,window:3,throughput:1200};
function operations(arrivals,assumptions={}){
 number(arrivals);const a={...defaults,...assumptions};for(const key of Object.keys(defaults))number(a[key]);for(const key of ['staffRatio','peopleCar','window','throughput'])if(a[key]===0)throw Error('Operating ratios must be greater than zero.');for(const key of ['staffBuffer','buffer','carShare','purchase'])number(a[key],0,100);
 return {staffing:Math.ceil(arrivals/a.staffRatio*(1+a.staffBuffer/100)),concessions:Math.ceil(arrivals*a.purchase*a.units*(1+a.buffer/100)),parking:Math.ceil(arrivals*a.carShare/100/a.peopleCar),entry:Math.ceil(arrivals/(a.window*a.throughput)),assumptions:a,arrivals};
}
const research=Object.freeze({linear:4401,ridge:4344,forest:3045,improvement:1356,reduction:1356/4401*100,games:5104,start:2000,end:2019,holdout:2019});
function validateAction(action){if(!action||typeof action!=='object')return null;
 if(action.type==='open'&&['simulator','operations','analytics','research','costs','settings','achievements','chat'].includes(action.page))return {type:'open',page:action.page};
 if(action.type==='operations'){const arrivals=action.arrivals;if(Number.isSafeInteger(arrivals)&&arrivals>=0&&arrivals<=1e7&&(action.focus===undefined||['staffing','parking','concessions','entry'].includes(action.focus)))return action.focus?{type:'operations',arrivals,focus:action.focus}:{type:'operations',arrivals};return null}
 if(action.type==='scenario'){try{return {type:'scenario',scenario:scenario(action.scenario.tickets,action.scenario.showUp,action.scenario.definition)}}catch{return null}}
 if(action.type==='history'){
  const start=action.start??action.season,end=action.end??action.season,metric=action.metric||'weekly';
  if(typeof action.team==='string'&&action.team.length<100&&Number.isInteger(start)&&Number.isInteger(end)&&start>=2000&&end<=2019&&start<=end&&['weekly','home','away','total'].includes(metric))return {type:'history',team:action.team,start,end,metric};
 }

 return null;
}
const api={number,scenario,compare,operations,defaults,research,validateAction};if(typeof module!=='undefined')module.exports=api;root.CastellaTools=api;
})(typeof window==='undefined'?globalThis:window);
