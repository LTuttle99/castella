(function(root){
'use strict';
// Lightweight local profiles. These are a personalized entry point, not authenticated accounts:
// anyone using this browser can pick any profile, and nothing here is secret.
const PROFILES=Object.freeze([
 Object.freeze({id:'lori',name:'Lori Reams',first:'Lori',initials:'LR'}),
 Object.freeze({id:'anika',name:'Anika Rao',first:'Anika',initials:'AR'}),
 Object.freeze({id:'johnny',name:'Johnny Patrick',first:'Johnny',initials:'JP'})
]);
const CURRENT='castella_profile';
const CLAIMED='castella_legacy_claimed_by';
// Unassigned data written before profiles existed (and older cc_* keys from the first release).
const LEGACY={scenarios:['castella_scenarios','cc_scenarios'],earned:['castella_earned','cc_earned'],celebrated:['castella_celebrated','cc_celebrated'],tone:['castella_tone','cc_tone'],local_ai:['castella_local_ai',null]};
const byId=id=>PROFILES.find(p=>p.id===id)||null;
const key=(profileId,name)=>{if(!byId(profileId))throw Error('Unknown profile.');if(!Object.hasOwn(LEGACY,name))throw Error('Unknown profile setting.');return `castella:${profileId}:${name}`};
function safe(storage){
 // Any storage failure (private mode, quota, blocked) degrades to in-memory behavior.
 const memory=new Map();let available=true;
 const call=(fn,fallback)=>{if(!available)return fallback();try{return fn()}catch{available=false;return fallback()}};
 return {get:k=>call(()=>storage.getItem(k),()=>memory.has(k)?memory.get(k):null),set:(k,v)=>call(()=>{storage.setItem(k,v)},()=>{memory.set(k,String(v))}),remove:k=>call(()=>{storage.removeItem(k)},()=>{memory.delete(k)}),get available(){return available&&Boolean(storage)}};
}
function parse(raw,fallback){if(raw===null||raw===undefined)return fallback;try{return JSON.parse(raw)}catch{return typeof fallback==='string'?raw:fallback}}
function createStore(storage){
 const s=safe(storage||{getItem(){throw Error('none')},setItem(){throw Error('none')},removeItem(){throw Error('none')}});
 function current(){const id=s.get(CURRENT);return byId(id)}
 function select(id){const p=byId(id);if(!p)throw Error('Unknown profile.');s.set(CURRENT,id);return p}
 function clear(){s.remove(CURRENT)}
 function read(profileId,name,fallback){return parse(s.get(key(profileId,name)),fallback)}
 function write(profileId,name,value){s.set(key(profileId,name),JSON.stringify(value))}
 function legacyRaw(name){const [next,previous]=LEGACY[name];const v=s.get(next);if(v!==null)return v;return previous?s.get(previous):null}
 // Summarize unassigned data without moving it. Returned counts drive the optional import prompt.
 function legacySummary(){const scenarios=parse(legacyRaw('scenarios'),[]),earned=parse(legacyRaw('earned'),[]);return {claimedBy:s.get(CLAIMED),scenarios:Array.isArray(scenarios)?scenarios.length:0,achievements:Array.isArray(earned)?earned.length:0,tone:legacyRaw('tone')!==null,assistant:legacyRaw('local_ai')!==null,get any(){return this.scenarios>0||this.achievements>0||this.tone||this.assistant}}}
 // Copy (never move or delete) unassigned data into one profile, once, and only when asked.
 function importLegacy(profileId){if(!byId(profileId))throw Error('Unknown profile.');const claimed=s.get(CLAIMED);if(claimed&&claimed!==profileId)throw Error('Earlier data on this browser was already imported into another profile.');const copied=[];
  for(const name of Object.keys(LEGACY)){const raw=legacyRaw(name);if(raw===null)continue;let value=parse(raw,raw);
   if(name==='tone'&&!['balanced','professional','fun'].includes(value))continue;
   if(name==='scenarios'){if(!Array.isArray(value))continue;const existing=read(profileId,'scenarios',[]);const ids=new Set((Array.isArray(existing)?existing:[]).map(r=>r&&r.id));value=[...(Array.isArray(existing)?existing:[]),...value.filter(r=>r&&typeof r==='object').map((r,i)=>({...r,id:r.id||`legacy-${i}`})).filter(r=>!ids.has(r.id))]}
   if(name==='earned'||name==='celebrated'){if(!Array.isArray(value))continue;value=[...new Set([...read(profileId,name,[]),...value.filter(v=>typeof v==='string')])]}
   if(name==='local_ai'&&(!value||typeof value!=='object'))continue;
   write(profileId,name,value);copied.push(name)}
  s.set(CLAIMED,profileId);return copied}
 return {current,select,clear,read,write,legacySummary,importLegacy,get available(){return s.available}};
}
const api={PROFILES,CURRENT,CLAIMED,LEGACY,byId,key,createStore};
if(typeof module!=='undefined'&&module.exports)module.exports=api;
root.CastellaProfiles=api;
})(typeof window==='undefined'?globalThis:window);
