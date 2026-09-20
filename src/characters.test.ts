import test from 'node:test';
import assert from 'node:assert/strict';
import {characters,pickOpponents} from './characters';
test('opponent selection excludes the player and samples distinct seats without mutating roster',()=>{
 const original=characters.map(c=>c.id);
 for(const player of characters)for(const random of [()=>0,()=>.5,()=>.999999]){
  const picked=pickOpponents(player.id,9,random);assert.equal(picked.length,9);assert.equal(new Set(picked.map(c=>c.id)).size,9);assert.ok(!picked.some(c=>c.id===player.id));
 }
 assert.deepEqual(characters.map(c=>c.id),original);
});
