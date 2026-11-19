// Runs on the visitor's GPU in an isolated worker. No inference server.
import {MLCEngine,prebuiltAppConfig} from './vendor/webllm-0.2.89.js';
const MODEL='Qwen2.5-0.5B-Instruct-q4f16_1-MLC';
const REVISION='32ff081fe7e4dfe4ffb167b94c66fdf11e02b8ad';
let engine=null,busy=false;
self.onmessage=async({data})=>{const {id,type}=data;if(busy){postMessage({id,type:'error',error:'The browser model is busy.'});return}busy=true;try{
 if(type==='load'){const record=prebuiltAppConfig.model_list.find(m=>m.model_id===MODEL);if(!record)throw Error('Browser model configuration is unavailable.');engine=new MLCEngine({appConfig:{...prebuiltAppConfig,cacheBackend:'cache',model_list:[{...record,model:record.model+'/resolve/'+REVISION+'/'}]},initProgressCallback:p=>postMessage({id,type:'progress',text:p.text})});await engine.reload(MODEL,{context_window_size:2048});postMessage({id,type:'ready'});}
 else if(type==='generate'){if(!engine)throw Error('Load the browser model first.');await engine.resetChat();let text='',metrics=null;const stream=await engine.chat.completions.create({messages:data.messages,stream:true,stream_options:{include_usage:true},temperature:.35,max_tokens:160});for await(const chunk of stream){text+=chunk.choices[0]?.delta?.content||'';if(text.length>12000)throw Error('Response length limit exceeded.');postMessage({id,type:'delta',text});if(chunk.usage)metrics=chunk.usage}postMessage({id,type:'result',text,metrics});}
 else throw Error('Unsupported browser-model operation.');
}catch(e){postMessage({id,type:'error',error:String(e.message||e).slice(0,300)})}finally{busy=false}};
