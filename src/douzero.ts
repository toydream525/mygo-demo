import {type AIView,type Card} from './engine';
import {unseen,candidates} from './strategy';
export type ModelRole='landlord'|'landlord_up'|'landlord_down';
export function roleFor(v:AIView):ModelRole{return v.seat===v.landlord?'landlord':v.seat===(v.landlord+1)%3?'landlord_down':'landlord_up';}
export function cardVector(cards:Card[]):number[]{const a=Array(54).fill(0),n=Array(18).fill(0);for(const c of cards)n[c.rank]++;for(let r=3;r<=15;r++)for(let j=0;j<n[r];j++)a[(r-3)*4+j]=1;a[52]=n[16]?1:0;a[53]=n[17]?1:0;return a;}
const hot=(n:number,len:number,offset=1)=>Array.from({length:len},(_,i)=>Number(i===n-offset));
export function encode(v:AIView){
 const role=roleFor(v),up=(v.landlord+2)%3,down=(v.landlord+1)%3,mate=v.seat===up?down:up;
 const played=(seat:number)=>cardVector(v.history.filter(e=>e.seat===seat).flatMap(e=>e.cards));
 const last=(seat:number)=>cardVector(v.history.filter(e=>e.seat===seat).at(-1)?.cards||[]);
 const shared=[...cardVector(v.hand),...cardVector(unseen(v))];
 const x=role==='landlord'?[...shared,...cardVector(v.target?.cards||[]),...played(up),...played(down),...hot(v.counts[up],17),...hot(v.counts[down],17),...hot(v.bombs,15,0)]:[...shared,...played(v.landlord),...played(mate),...cardVector(v.target?.cards||[]),...last(v.landlord),...last(mate),...hot(v.counts[v.landlord],20),...hot(v.counts[mate],17),...hot(v.bombs,15,0)];
 const history=v.history.slice(-15);const z=new Float32Array(810);history.forEach((e,i)=>z.set(cardVector(e.cards),(15-history.length+i)*54));
 const moves=candidates(v);const width=x.length+54,batch=new Float32Array(moves.length*width);moves.forEach((m,i)=>{batch.set(x,i*width);batch.set(cardVector(m.cards),i*width+x.length);});
 return {role,z,x:batch,width,moves};
}
