import {legalMoves,deck,beats,classify,type AIView,type Card,type Difficulty,type CharacterId,type Pattern} from './engine';
export const difficultyNames:Record<Difficulty,string>={casual:'休闲',standard:'标准',expert:'高手'};
export const personalities:Record<CharacterId,string>={tomori:'谨慎叫分 · 保留组合 · 照顾队友',anon:'主动叫分 · 争取先手 · 灵活调整',rana:'连贯组合 · 即兴冒险 · 顺势出牌',soyo:'观察试探 · 保留控制 · 选择时机',taki:'高效出牌 · 压制威胁 · 果断收官',uika:'稳健衔接 · 重视搭档',mutsumi:'睦 · 保留组合 / Mortis · 主动登场',umiri:'计算效率 · 残局接力',nyamu:'积极争先 · 多变应对',sakiko:'保存控制 · 规划接管'};
export type RankedAction={ids:number[];score:number};
export type Decision={gameId:number;revision:number;actions:RankedAction[];difficulty:Difficulty;fallback?:string};
export function candidates(v:AIView){const ms=legalMoves(v.hand,v.target?.pattern||null).map(m=>({cards:m.cards,pattern:m.pattern as Pattern|null}));if(v.target)ms.push({cards:[],pattern:null});return ms;}
const counts=(h:Card[])=>{const a=Array(18).fill(0);for(const c of h)a[c.rank]++;return a as number[];};
export function unseen(v:AIView){const used=new Set([...v.hand,...v.history.flatMap(e=>e.cards)].map(c=>c.id));return deck().filter(c=>!used.has(c.id));}
// Greedy multi-pass decomposition with memoization: no hidden cards are consulted.
const costCache=new Map<string,number>();
export function handCost(h:Card[]):number{
 if(!h.length)return 0;const c=counts(h),key=c.join('');const cached=costCache.get(key);if(cached!==undefined)return cached;
 let best=Infinity;
 for(const order of [[3,2,1],[1,2,3],[2,3,1]]){const n=[...c];let turns=0;
  if(n[16]&&n[17]){n[16]--;n[17]--;turns++;}
  for(const size of order){const min=size===1?5:size===2?3:2;let start=3;while(start<=14){if(n[start]<size){start++;continue;}let end=start;while(end<14&&n[end+1]>=size)end++;if(end-start+1>=min){for(let r=start;r<=end;r++)n[r]-=size;turns++;}else start=end+1;}}
  for(let r=3;r<=17;r++)if(n[r]===4){n[r]=0;turns++;}
  for(let r=3;r<=17;r++)if(n[r]===3){n[r]=0;turns++;let wing=n.findIndex((x,i)=>i>=3&&x===1);if(wing<0)wing=n.findIndex((x,i)=>i>=3&&x===2);if(wing>=0)n[wing]=0;}
  turns+=n.filter(n=>n>0).length;best=Math.min(best,turns);
 }
 const singles=c.reduce((sum,n,r)=>sum+(n===1&&r<12?.13:0),0);const value=best+singles;if(costCache.size>30000)costCache.clear();costCache.set(key,value);return value;
}
export function styleScore(v:AIView,cs:Card[],p:Pattern|null):number{
 const mate=v.seat!==v.landlord&&v.lastSeat!==v.landlord&&!!v.target;const chain=p&&['straight','pairs','plane','planeOne','planePair'].includes(p.kind);const bomb=p&&(p.kind==='bomb'||p.kind==='rocket');
 switch(v.character){
 case 'uika':case 'tomori':return (mate&&!cs.length?1.5:0)+(chain?.5:0)-(bomb?.8:0)-(p&&p.rank>=15?.35:0);
 case 'nyamu':case 'anon':return (cs.length?.55:-.4)+(p&&p.rank>=13?.35:0)+(bomb&&v.hand.length<9?.7:0);
 case 'mutsumi':if(v.mutsumiFace==='mortis')return (cs.length?.7:-.3)+(chain?.8:0);
 case 'rana':return (chain?1.8:0)+(cs.length>=5?.5:0)-(cs.length===1?.4:0);
 case 'sakiko':case 'soyo':return (!cs.length&&v.target?.pattern.rank!<12?.5:0)-(bomb?1:0)-(p&&p.rank>=15?.65:0)+(v.history.length>15&&cs.length>2?.5:0);
 case 'umiri':case 'taki':return cs.length*.08+(p&&v.counts.some((n,i)=>i!==v.seat&&(v.seat===v.landlord||i===v.landlord)&&n<=2)?p.rank*.06:0);
 }
}
export function intelScore(v:AIView,p:Pattern|null):number{if(!p)return 0;let n=0;for(const i of v.intel){if(i.target===v.seat||(v.seat!==v.landlord&&i.target!==v.landlord))continue;
 if(i.skill==='anon'&&i.query&&i.query.kind===p.kind&&i.query.rank===p.rank&&i.query.size===p.size)n+=i.value?-1:2;
 if(i.skill==='rana'&&p.kind==='straight'&&p.size>i.value)n+=1.2;
 if(i.skill==='soyo'&&i.value===0&&p.kind==='pair')n+=1.2;
 if(i.skill==='tomori'&&p.kind==='single'&&p.rank<i.value)n-=1;
 if(i.skill==='taki'&&i.value===0&&p.kind==='bomb')n+=.5;
 if(i.skill==='uika'&&i.query&&p.kind===i.query.kind&&p.size===i.query.size){if(!i.value&&p.rank>=i.query.rank)n+=1.5;else if(i.value&&p.rank>=i.value)n+=.7;}
 if(i.skill==='mutsumi'&&!i.value&&(i.query?.kind==='plane'?['plane','planeOne','planePair'].includes(p.kind):p.kind==='straight'))n+=1.5;
 if(i.skill==='umiri'&&!i.value&&p.kind==='single'&&p.rank===14)n+=1;
 if(i.skill==='nyamu'&&i.value>=v.counts[i.target]-1&&p.kind==='pair')n+=1;
 if(i.skill==='sakiko'&&!i.value&&p.kind==='bomb')n+=.7;
 }return n;}
export function structurePenalty(hand:Card[],cs:Card[],p:Pattern|null):number{if(!p||cs.length===hand.length)return 0;const own=counts(hand),used=counts(cs),rest=own.map((n,i)=>n-used[i]);let penalty=0;for(let r=3;r<=17;r++)if(used[r]&&used[r]<own[r])penalty+=own[r]===4?16:own[r]===3?4:2;
 for(const unit of [1,2]){const minimum=unit===1?5:3;let start=3;while(start<=14){if(own[start]<unit){start++;continue;}let end=start;while(end<14&&own[end+1]>=unit)end++;if(end-start+1>=minimum){let run=0,retained=0;for(let r=start;r<=end+1;r++){if(r<=end&&rest[r]>=unit)run++;else{if(run>=minimum)retained+=run;run=0;}}const spent=Array.from({length:end-start+1},(_,i)=>used[start+i]>=unit?1:0).reduce<number>((a,b)=>a+b,0);const lost=end-start+1-retained-spent;if(lost>0)penalty+=lost*(unit===1?.7:1.2);}start=end+1;}}
 return penalty;}
export function rankHeuristic(v:AIView,difficulty:Difficulty,random= Math.random):RankedAction[]{
 const opts=candidates(v),own=counts(v.hand),other=counts(unseen(v));const mate=v.seat!==v.landlord&&v.lastSeat!==v.landlord&&!!v.target;
 const danger=Math.min(...v.counts.filter((_,i)=>i!==v.seat&&(v.seat===v.landlord||i===v.landlord)));
 const baseCost=handCost(v.hand);
 return opts.map(({cards:cs,pattern:p})=>{if(cs.length===v.hand.length)return {ids:cs.map(c=>c.id),score:100000};
 let n=0;if(!p)n=mate?2:-5;else{
 const ids=new Set(cs.map(c=>c.id)),rest=v.hand.filter(c=>!ids.has(c.id));const used=counts(cs);const bomb=p.kind==='bomb'||p.kind==='rocket';
 if(difficulty==='casual'){n=cs.length*1.5-p.rank*.1-(bomb?4:0);if(mate)n-=7;n+=random()*8;}
 else{n=(baseCost-handCost(rest))*7+cs.length*.3-p.rank*.09-(bomb&&rest.length>4?2.5:0);
  if(mate){n-=5;if(v.counts[v.lastSeat]<=2)n-=12; if(handCost(rest)<=1)n+=4;}
  if(danger<=2){if(p.kind==='single'&&danger===1)n+=p.rank*.8;if(p.kind!=='single'&&danger===1)n+=3;if(p.kind==='pair'&&danger===2)n+=p.rank*.35;}
  if(p.kind==='single'&&other.slice(p.rank+1).every(x=>!x)&&rest.length)n+=2;
  if(p.kind==='pair'&&other.slice(p.rank+1).every(x=>x<2)&&rest.length)n+=2;
  n-=structurePenalty(v.hand,cs,p)*(danger<=2?.55:1);
  n+=intelScore(v,p);
 }
 }n+=styleScore(v,cs,p);return {ids:cs.map(c=>c.id),score:n};}).sort((a,b)=>b.score-a.score);
}
export function bidFor(v:AIView,difficulty:Difficulty){const c=counts(v.hand);let power=v.hand.reduce((n,x)=>n+(x.rank>=16?2.2:x.rank===15?1.25:x.rank===14?.5:0),0)+c.filter(n=>n===4).length*2.8;
 power+=({tomori:-.9,anon:1.1,rana:.4,soyo:-.4,taki:.2,uika:-.5,mutsumi:-.6,umiri:.1,nyamu:.8,sakiko:.5})[v.character];if(difficulty!=='casual')power+=(7-handCost(v.hand))*.7;
 const score=power>=8?3:power>=5.5?2:power>=3.5?1:0;return score>v.bid?score:0;}
export function decorateModel(v:AIView,actions:RankedAction[]):RankedAction[]{const best=Math.max(...actions.map(a=>a.score));return actions.map(a=>{const cs=v.hand.filter(c=>a.ids.includes(c.id));if(cs.length===v.hand.length)return {...a,score:100000};const p=classify(cs);return {...a,score:a.score+(a.score>=best-.16?styleScore(v,cs,p)*.025+intelScore(v,p)*.025-Math.min(4,structurePenalty(v.hand,cs,p))*.006:0)};}).sort((a,b)=>b.score-a.score);}
