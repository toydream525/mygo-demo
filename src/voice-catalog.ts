import lines from './mujica-voice-lines.json';
import type {MutsumiFace} from './mutsumi';
type VoiceLine={jp:string;zh:string;source:string;kind:string};
const catalog:Record<string,VoiceLine[]>=lines;
export function mujicaVoice(id:string,index:number,face:MutsumiFace,cycle:number){
 const key=id==='mutsumi'?`${id}-${face}`:id;
 const entries=catalog[key];if(!entries)return null;
 const chosen=(index===2||index===3)&&cycle%2===1?index+20:index;
 const resolved=entries[chosen]?chosen:0;
 return {line:entries[resolved],path:resolved>=16&&resolved<=18?`./audio/${key}-lobby-${resolved-15}-perspective.mp3`:`./audio/${key}-${resolved}${key==='sakiko'||key==='mutsumi-mortis'?'-v2':''}.mp3`};
}
