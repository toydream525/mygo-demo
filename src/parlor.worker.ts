import {parlorDecision,type ParlorRequest} from './parlor-ai';
self.onmessage=(e:MessageEvent<ParlorRequest>)=>{try{self.postMessage(parlorDecision(e.data));}catch{self.postMessage({id:e.data.id,revision:e.data.revision,error:true});}};
