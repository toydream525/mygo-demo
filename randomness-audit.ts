import {newGame} from './src/engine';
import {newParlor} from './src/parlor-engine';
import {newBlackjack,bjPlay,bjBasic,bjView} from './src/blackjack';
import {characters,pickOpponents} from './src/characters';
import {writeFileSync} from 'node:fs';
const rng=(seed:number)=>()=>{seed|=0;seed=seed+0x6D2B79F5|0;let t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return ((t^t>>>14)>>>0)/4294967296};
const N=10000,r=rng(20260920);const counts={ddzJoker:[0,0,0,0],ddzTwos:[0,0,0,0],runTwo:[0,0,0],runThreeSpades:[0,0,0],bjAces:[0,0],bjTens:[0,0]};let ddzDup=0,runDup=0;const ddzSets=new Set<string>(),runSets=new Set<string>();let optionsIndependent=true;
for(let i=0;i<N;i++){
 const d=newGame(r),p=newParlor('runfast',r),b=newBlackjack(r);[...d.hands,d.bottom].forEach((h,s)=>{counts.ddzJoker[s]+=h.filter(c=>c.rank===17).length;counts.ddzTwos[s]+=h.filter(c=>c.rank===15).length});
 p.hands.forEach((h,s)=>{counts.runTwo[s]+=h.filter(c=>c.rank===15).length;counts.runThreeSpades[s]+=h.filter(c=>c.rank===3&&c.suit===0).length});
 [b.hands[0].cards,b.dealer.slice(0,2)].forEach((h,s)=>{counts.bjAces[s]+=h.filter(c=>c.rank===14).length;counts.bjTens[s]+=h.filter(c=>c.rank>=10&&c.rank<=13).length});
 const key=(h:{id:number}[])=>h.map(c=>c.id).sort((a,b)=>a-b).join(',');const dk=key(d.hands[0]),pk=key(p.hands[0]);if(ddzSets.has(dk))ddzDup++;if(runSets.has(pk))runDup++;ddzSets.add(dk);runSets.add(pk);
 if(i<300){const a=newGame(rng(i),{difficulty:'casual',characters:['tomori','anon','rana']}),z=newGame(rng(i),{difficulty:'expert',characters:['sakiko','mutsumi','nyamu'],mode:'skills'});if(JSON.stringify(a.hands)!==JSON.stringify(z.hands))optionsIndependent=false;}
}
const opponentN=36000,oldCounts=Array.from({length:2},()=>Object.fromEntries(characters.slice(1).map(c=>[c.id,0]))),newCounts=structuredClone(oldCounts);const randomOld=rng(1234),randomNew=rng(1234);const combos=new Set<string>();
for(let i=0;i<opponentN;i++){
 const a=characters.slice(1).sort(()=>randomOld()-.5);const b=pickOpponents('tomori',2,randomNew);
 for(let s=0;s<2;s++){oldCounts[s][a[s].id]++;newCounts[s][b[s].id]++;}combos.add([b[0].id,b[1].id].sort().join(','));
}
let shoe=newBlackjack(rng(222));let continued=0,reshuffled=0,shoeConservation=true;for(let i=0;i<500;i++){
 while(shoe.phase==='play')shoe=bjPlay(shoe,bjBasic(bjView(shoe)));
 const all=[...shoe.shoe,...shoe.exposed,...shoe.dealer,...shoe.hands.flatMap(h=>h.cards)];if(all.length!==312||new Set(all.map(c=>c.id)).size!==312)shoeConservation=false;
 const before=shoe,next=newBlackjack(r,before);if(before.shoe.length>=78){continued++;if(next.hands[0].cards[0].id!==before.shoe.at(-1)!.id)shoeConservation=false;}else reshuffled++;shoe=next;
}
const output={seed:20260920,dealsPerGame:N,counts,duplicatePlayerHands:{doudizhu:ddzDup,runfast:runDup},ddzOptionsIndependent:optionsIndependent,blackjack:{rounds:500,continued,reshuffled,shoeConservation},opponents:{samples:opponentN,player:'tomori',expectedPerCharacterPerSeat:4000,oldRandomSort:oldCounts,fisherYates:newCounts,unorderedPairsSeen:combos.size,expectedPairs:36},behavior:{doudizhuAgain:'reselects opponents and reshuffles',parlorAgain:'retains opponents; runfast reshuffles; blackjack reuses shoe while at least 78 remain',lobbyReentry:'reselects opponents and starts a fresh deck/shoe'}};
writeFileSync(new URL('RANDOMNESS_AUDIT.json',import.meta.url),JSON.stringify(output,null,2));console.log(JSON.stringify(output,null,2));
