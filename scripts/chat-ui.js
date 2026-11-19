'use strict';
(function(){
 const $=s=>document.querySelector(s),C=CastellaConversation,T=CastellaTools;
 let state=C.createState();
 function assumptions(){return Object.fromEntries(Object.keys(T.defaults).map(key=>[key,Number($('#'+key).value)]))}
 function act(raw){const a=T.validateAction(raw);if(!a){status('That action is unavailable.');return}
  if(a.type==='open'){go(a.page);return}
  if(a.type==='scenario'){const old=state.scenario.current;state.scenario={...state.scenario,...a.scenario,current:a.scenario,previous:old&&old.arrivals!==a.scenario.arrivals?old:state.scenario.previous};$('#tickets').value=a.scenario.tickets;$('#util').value=a.scenario.showUp*100;$('#definition').value=a.scenario.definition==='distributed'?'Tickets distributed':a.scenario.definition==='eligible'?'Other eligible inventory':'Tickets sold';calc();go('simulator');return}
  if(a.type==='history'){const h=window.castellaHistory;if(!h?.applySelection?.(a)){status('No validated attendance records are available for this selection.');return}go('analytics')}

 }
 function status(text){$('#chatStatus').textContent=text}
 function message(text,who,response=null){const node=document.createElement('div');node.className='bubble '+who;const p=document.createElement('p');p.textContent=text;node.append(p);
  if(response?.card){const card=document.createElement('section');card.className='response-card';card.setAttribute('aria-label',response.card.title);const title=document.createElement('strong');title.textContent=response.card.title;card.append(title);const list=document.createElement('dl');for(const [label,value]of response.card.rows){const dt=document.createElement('dt'),dd=document.createElement('dd');dt.textContent=label;dd.textContent=value;list.append(dt,dd)}card.append(list);node.append(card)}
  if(response?.source){const source=document.createElement('div');source.className='source';source.textContent=response.source;node.append(source)}
  if(response?.actions.length){const actions=document.createElement('div');actions.className='chat-actions';for(const raw of response.actions){const valid=T.validateAction(raw);if(!valid)continue;const button=document.createElement('button');button.className='btn secondary';button.textContent=valid.type==='scenario'?'Open this scenario in the simulator':valid.type==='history'?`Explore ${valid.team||'historical selection'} ${valid.start}–${valid.end}`:'Open '+valid.page;button.onclick=()=>act(valid);actions.append(button)}node.append(actions)}
  $('#messages').append(node);$('#messages').scrollTop=$('#messages').scrollHeight;
 }
 function suggestions(items){const container=$('.suggestions');container.replaceChildren();for(const item of items){const button=document.createElement('button');button.type='button';button.textContent=item;button.onclick=()=>send(item);container.append(button)}}
 function send(raw){const text=raw.trim();if(!text)return;if(text.length>4000){status('Please keep each message under 4,000 characters.');return}message(text,'user');$('#chatInput').value='';
  try{const response=C.respond(state,text,{tone:$('#tone').value,historyAdapter:CastellaHistoryDialogue.createAdapter(window.castellaHistory.records,window.castellaHistory.filters,()=>window.castellaHistory.status),assumptions:assumptions(),selectedScenario:{tickets:Number($('#tickets').value),showUp:Number($('#util').value)/100,definition:$('#definition').value==='Tickets distributed'?'distributed':$('#definition').value==='Other eligible inventory'?'eligible':'sold'}});state=response.state;message(response.text,'',response);suggestions(response.suggestions);status('Local conversation mode · no external API · chat stays in page memory')}
  catch{status('That message could not be processed. Your context is unchanged.');const retry=document.createElement('button');retry.className='btn secondary';retry.textContent='Retry message';retry.onclick=()=>{retry.remove();send(text)};$('#messages').append(retry)}
 }
 $('#chatForm').onsubmit=e=>{e.preventDefault();send($('#chatInput').value)};
 $('#chatInput').addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();$('#chatForm').requestSubmit()}});
 function reset(){state=C.createState();$('#messages').replaceChildren();message($('#tone').value==='professional'?'Hello. I can work through a ticket scenario, operations estimate, or research question.':'Hey, I’m Castella. What’s the game plan today?','');suggestions(['We sold 35,000 tickets',"What was the Colts average reported attendance in 2015?",'Which model performed best?','Tell me a football joke']);status('New local conversation · page memory only · saved scenarios are unchanged')}
 $('#resetChat').onclick=reset;$('#newChat').onclick=reset;
 $('#resetScenarioContext').onclick=()=>{state.scenario=CastellaScenario.createState();state.pending=null;state.lastResult=null;status('Scenario context cleared. Conversation and saved scenarios retained.')};
 reset();
})();
