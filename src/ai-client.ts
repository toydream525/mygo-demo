import type {AIView,Difficulty} from './engine';
import type {Decision} from './strategy';
export class AIClient{
 private worker:Worker|null=null;private id=0;private tasks=new Map<number,{resolve:(v:any)=>void;reject:(e:Error)=>void;timer:ReturnType<typeof setTimeout>}>();private loaded=false;private warming:Promise<void>|null=null;
 onProgress:(message:string)=>void=()=>{};
 private ensure(){if(this.worker)return;this.worker=new Worker(new URL('./ai.worker.ts',import.meta.url),{type:'module'});this.worker.onmessage=({data})=>{if(data.type==='progress'){this.onProgress(data.message);return;}const task=this.tasks.get(data.id);if(!task)return;clearTimeout(task.timer);this.tasks.delete(data.id);if(data.type==='error')task.reject(Error(data.message));else task.resolve(data.decision);};this.worker.onerror=()=>this.reset('AI 计算异常');}
 private reset(message:string){this.worker?.terminate();this.worker=null;this.loaded=false;for(const task of this.tasks.values()){clearTimeout(task.timer);task.reject(Error(message));}this.tasks.clear();}
 private request(data:object,timeout:number):Promise<any>{this.ensure();const id=++this.id;return new Promise((resolve,reject)=>{const timer=setTimeout(()=>this.reset('AI 响应超时'),timeout);this.tasks.set(id,{resolve,reject,timer});this.worker!.postMessage({...data,id});});}
 async prepare(){if(this.loaded)return;if(this.warming)return this.warming;this.warming=this.request({type:'init',base:new URL('./',location.href).href},120000).then(()=>{this.loaded=true;}).catch(error=>{this.reset('模型加载失败');throw error;}).finally(()=>{this.warming=null;});return this.warming;}
 async decide(view:AIView,difficulty:Difficulty):Promise<Decision>{return this.request({type:'rank',view,difficulty},3000);}
 dispose(){this.reset('对局已结束');}
}
export const ai=new AIClient();
