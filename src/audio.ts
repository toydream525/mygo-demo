export type AudioPrefs={music:number;voice:number;sfx:number;muted:boolean};
export const defaultAudio:AudioPrefs={music:.22,voice:.8,sfx:.45,muted:false};
export class SoundSystem {
 private ctx:AudioContext|null=null;
 private music:HTMLAudioElement|null=null;
 private voices=new Map<HTMLAudioElement,(ok:boolean)=>void>();
 get activeVoiceCount(){return this.voices.size;}
 private syncVolumes(){for(const a of this.fading)a.volume=this.prefs.muted?0:this.prefs.music*(this.voices.size?.38:1);if(this.music)this.music.volume=this.prefs.muted?0:this.prefs.music*(this.voices.size?.38:1);for(const audio of this.voices.keys())audio.volume=this.prefs.muted?0:this.prefs.voice;}
 private scenePath='./audio/mygo-lobby.mp3';
 private fading=new Set<HTMLAudioElement>();
 private fadeTimer:ReturnType<typeof setInterval>|null=null;
 private started=false;
 private imported:string|null=null;
 prefs=defaultAudio;
 configure(p:AudioPrefs){this.prefs=p;this.syncVolumes();}
 setScene(theme:'mygo'|'mujica',scene:'lobby'|'table'){const path=`./audio/${theme}-${scene}.mp3`;if(path===this.scenePath)return;this.scenePath=path;if(this.imported||!this.music)return;if(this.fadeTimer)clearInterval(this.fadeTimer);for(const a of this.fading)a.pause();this.fading.clear();const old=this.music;this.fading.add(old);const next=new Audio(path);next.loop=true;next.volume=0;this.music=next;if(this.started)void next.play().catch(()=>{});let step=0;this.fadeTimer=setInterval(()=>{step++;const v=this.prefs.muted?0:this.prefs.music*(this.voices.size?.38:1);next.volume=v*Math.min(1,step/12);old.volume=v*Math.max(0,1-step/12);if(step>=12){old.pause();this.fading.delete(old);clearInterval(this.fadeTimer!);this.fadeTimer=null;}},50);}
 start(){if(!this.ctx)this.ctx=new AudioContext();void this.ctx.resume();if(!this.music){this.music=new Audio(this.scenePath);this.music.loop=true;}this.syncVolumes();void this.music.play().catch(()=>{});this.started=true;}
 setTrack(file:File){if(this.imported)URL.revokeObjectURL(this.imported);this.imported=URL.createObjectURL(file);if(!this.music)this.music=new Audio();this.music.src=this.imported;this.music.loop=true;this.start();}
 resetTrack(){if(this.imported)URL.revokeObjectURL(this.imported);this.imported=null;if(this.music)this.music.src=this.scenePath;this.start();}
 speak(path:string,start:()=>void=()=>{}):Promise<boolean>{
  start();if(this.prefs.muted||!this.prefs.voice)return Promise.resolve(false);if(!this.started)this.start();
  return new Promise(resolve=>{const audio=new Audio(path);let finished=false;const finish=(ok:boolean)=>{if(finished)return;finished=true;audio.onended=null;audio.onerror=null;this.voices.delete(audio);this.syncVolumes();resolve(ok);};this.voices.set(audio,finish);this.syncVolumes();audio.onended=()=>finish(true);audio.onerror=()=>finish(false);void audio.play().catch(()=>finish(false));});
 }
 stopVoice(){for(const [audio,finish] of [...this.voices]){audio.pause();finish(false);}}
 effect(type:'tap'|'play'|'pass'|'bomb'|'win'|'deal'){
  if(this.prefs.muted||!this.prefs.sfx||!this.ctx)return;const ctx=this.ctx;
  const notes=type==='win'?[523,659,784,1047]:type==='bomb'?[90,65,45]:type==='play'?[420,630]:type==='deal'?[350,440,530]:type==='pass'?[260]:[720];
  notes.forEach((hz,i)=>{const osc=ctx.createOscillator(),gain=ctx.createGain(),t=ctx.currentTime+i*.08;osc.type=type==='bomb'?'triangle':'sine';osc.frequency.setValueAtTime(hz,t);gain.gain.setValueAtTime(0,t);gain.gain.linearRampToValueAtTime(this.prefs.sfx*.15,t+.008);gain.gain.exponentialRampToValueAtTime(.001,t+.2);osc.connect(gain);gain.connect(ctx.destination);osc.start(t);osc.stop(t+.22);});
 }
}
export const sound=new SoundSystem();
