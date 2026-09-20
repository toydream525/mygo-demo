import test from 'node:test';
import assert from 'node:assert/strict';
import {SoundSystem,defaultAudio} from './audio';
import {mujicaVoice} from './voice-catalog';
class FakeAudio {
 static all:FakeAudio[]=[];volume=1;loop=false;paused=true;onended:(()=>void)|null=null;onerror:(()=>void)|null=null;
 constructor(public src=''){FakeAudio.all.push(this)}
 play(){this.paused=false;return Promise.resolve()}
 pause(){this.paused=true}
}
test('voices overlap immediately, duck until last end, mute and clear all',async()=>{
 Object.assign(globalThis,{Audio:FakeAudio,AudioContext:class{resume(){return Promise.resolve()}}});
 const s=new SoundSystem();s.start();let subtitles=0;
 const p1=s.speak('first',()=>subtitles++),p2=s.speak('second',()=>subtitles++),p3=s.speak('third',()=>subtitles++);
 assert.equal(subtitles,3);assert.equal(s.activeVoiceCount,3);
 const [music,a,b,c]=FakeAudio.all.slice(-4);assert.ok([a,b,c].every(v=>!v.paused));assert.equal(music.volume,defaultAudio.music*.38);
 a.onended!();await p1;assert.equal(s.activeVoiceCount,2);assert.equal(music.volume,defaultAudio.music*.38);
 s.configure({...defaultAudio,muted:true});assert.ok([music,b,c].every(v=>v.volume===0));
 s.configure(defaultAudio);s.stopVoice();assert.equal(await p2,false);assert.equal(await p3,false);assert.equal(s.activeVoiceCount,0);assert.ok(b.paused&&c.paused);assert.equal(music.volume,defaultAudio.music);
});
test('character/persona voices resolve their own files and action variants',()=>{
 for(const id of ['uika','mutsumi','umiri','nyamu','sakiko'])for(let index=0;index<22;index++){
  const a=mujicaVoice(id,index,'quiet',0)!;assert.ok(a.path.includes(id));assert.ok(a.line.jp);
 }
 assert.notEqual(mujicaVoice('mutsumi',16,'quiet',0)!.path,mujicaVoice('mutsumi',16,'mortis',0)!.path);
 assert.notEqual(mujicaVoice('nyamu',2,'quiet',0)!.path,mujicaVoice('nyamu',2,'quiet',1)!.path);
 assert.equal(mujicaVoice('tomori',0,'quiet',0),null);
});
