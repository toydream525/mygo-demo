import {test} from 'node:test';
import assert from 'node:assert/strict';
import {existsSync} from 'node:fs';
import catalog from './voice-expansion.json';
import {expandedVoice,type VoiceEvent} from './voice-expansion';
test('all ten characters and Mortis have two distinct recorded variants for every expanded scene',()=>{
 assert.equal(Object.keys(catalog).length,11);
 for(const [profile,events] of Object.entries(catalog)){
  assert.equal(Object.keys(events).length,9);
  for(const [event,lines] of Object.entries(events)){
   assert.equal(lines.length,2);assert.notEqual(lines[0].jp,lines[1].jp);
   for(const line of lines){assert.ok(existsSync(`public/audio/${line.file}`),line.file);assert.equal(line.kind,'fan');}
   const id=profile.startsWith('mutsumi-')?'mutsumi':profile;
   const face=profile==='mutsumi-mortis'?'mortis':'quiet';
   assert.equal(expandedVoice(id,event as VoiceEvent,face,0)?.line.jp,lines[0].jp);
   assert.equal(expandedVoice(id,event as VoiceEvent,face,1)?.line.jp,lines[1].jp);
   assert.equal(expandedVoice(id,event as VoiceEvent,face,2)?.line.jp,lines[0].jp);
  }
 }
});

test('lobby lines are character monologues, not greetings to an extra player',()=>{
 for(const events of Object.values(catalog))for(const line of events.lobby){
  assert.ok(!/你|陪我|等你|来てくれ|あなた|隣、取って/.test(line.jp+line.zh),line.jp);
  assert.ok(line.file.endsWith('-perspective.mp3'));
 }
});
