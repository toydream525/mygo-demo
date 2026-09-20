import catalog from './voice-expansion.json';
export type VoiceEvent='lobby'|'table'|'play'|'pass'|'chat'|'reply'|'win'|'lose'|'skill';
export function expandedVoice(id:string,event:VoiceEvent,face:'quiet'|'mortis',cycle:number){
 const key=id==='mutsumi'?`${id}-${face}`:id;
 const entries=(catalog as Record<string,Record<VoiceEvent,{jp:string;zh:string;source:string;file:string}[]>>)[key]?.[event];
 const line=entries?.[cycle%entries.length];
 return line?{line,path:`./audio/${line.file}`}:undefined;
}
