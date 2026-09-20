export type Card = { id: number; rank: number; suit: number; pack?:number };
export type Kind = 'single'|'pair'|'triple'|'tripleOne'|'triplePair'|'straight'|'pairs'|'plane'|'planeOne'|'planePair'|'fourTwo'|'fourPairs'|'bomb'|'rocket';
export type Pattern = { kind: Kind; rank: number; size: number };
export type Move = { cards: Card[]; pattern: Pattern };
export const labels: Record<Kind,string> = {single:'单张',pair:'对子',triple:'三张',tripleOne:'三带一',triplePair:'三带二',straight:'顺子',pairs:'连对',plane:'飞机',planeOne:'飞机带单',planePair:'飞机带对',fourTwo:'四带二',fourPairs:'四带两对',bomb:'炸弹',rocket:'王炸'};
export const rankLabel = (r: number) => ({11:'J',12:'Q',13:'K',14:'A',15:'2',16:'小王',17:'大王'}[r] || String(r));
export const sortCards = (cards: Card[]) => [...cards].sort((a,b)=>b.rank-a.rank || a.suit-b.suit);
export function deck(): Card[] { return Array.from({length:54},(_,id)=>({id,rank:id<52?3+Math.floor(id/4):id-36,suit:id<52?id%4:4})); }
function groups(cards: Card[]) { const g = new Map<number,Card[]>(); for(const c of cards) g.set(c.rank,[...(g.get(c.rank)||[]),c]); return new Map([...g].sort((a,b)=>a[0]-b[0])); }
const consecutive = (r: number[]) => r.every((x,i)=>i===0||x===r[i-1]+1) && r.at(-1)!<=14;
export function classify(cards: Card[]): Pattern|null {
 const n=cards.length; if(!n || new Set(cards.map(c=>c.id)).size!==n) return null;
 const g=groups(cards), ranks=[...g.keys()], counts=[...g.values()].map(x=>x.length);
 const make=(kind:Kind,rank:number):Pattern=>({kind,rank,size:n});
 if(n===2 && g.has(16)&&g.has(17)) return make('rocket',17);
 if(g.size===1) return n<=4?make((['single','pair','triple','bomb'] as Kind[])[n-1],ranks[0]):null;
 const triple=ranks.find(r=>g.get(r)!.length===3);
 if(n===4 && triple) return make('tripleOne',triple);
 if(n===5 && triple && counts.includes(2)) return make('triplePair',triple);
 if(n>=5 && counts.every(x=>x===1)&&consecutive(ranks)) return make('straight',ranks.at(-1)!);
 if(n>=6 && n%2===0 && counts.every(x=>x===2)&&consecutive(ranks)) return make('pairs',ranks.at(-1)!);
 if(n>=6 && n%3===0 && counts.every(x=>x===3)&&consecutive(ranks)) return make('plane',ranks.at(-1)!);
 for(const [unit,kind] of [[4,'planeOne'],[5,'planePair']] as const){
  const k=n/unit; if(!Number.isInteger(k)||k<2) continue;
  for(let start=3;start+k-1<=14;start++){
   const body=Array.from({length:k},(_,i)=>start+i);
   if(!body.every(r=>g.get(r)?.length===3)) continue;
   const rest=ranks.filter(r=>!body.includes(r));
   if(kind==='planeOne' && !(rest.includes(16)&&rest.includes(17))) return make(kind,start+k-1);
   if(kind==='planePair' && rest.length===k && rest.every(r=>g.get(r)!.length===2)) return make(kind,start+k-1);
  }
 }
 const four=ranks.find(r=>g.get(r)!.length===4);
 if(four && n===6 && !(g.has(16)&&g.has(17))) return make('fourTwo',four);
 if(four && n===8 && ranks.filter(r=>r!==four).length===2 && ranks.filter(r=>r!==four).every(r=>g.get(r)!.length===2)) return make('fourPairs',four);
 return null;
}
export function beats(a:Pattern,b:Pattern|null):boolean {
 if(!b) return true; if(b.kind==='rocket') return false; if(a.kind==='rocket') return true;
 if(a.kind==='bomb' && b.kind!=='bomb') return true;
 return a.kind===b.kind && a.size===b.size && a.rank>b.rank;
}
// Enumerate rank groups instead of suit permutations. Every result goes through the same validator as user input.
export function legalMoves(hand:Card[],target:Pattern|null=null):Move[]{
 const g=groups(hand), ranks=[...g.keys()], result:Move[]=[], seen=new Set<string>();
 const add=(cards:Card[])=>{const p=classify(cards); if(!p||!beats(p,target))return;const key=cards.map(c=>c.rank).sort((a,b)=>a-b).join(',');if(!seen.has(key)){seen.add(key);result.push({cards:sortCards(cards),pattern:p});}};
 const wings=(body:Card[],excluded:number[],count:number,pairs:boolean)=>{
  const candidates=ranks.filter(r=>!excluded.includes(r) && (!pairs||g.get(r)!.length>=2));
  const visit=(index:number,left:number,picked:Card[])=>{
   if(left===0){add([...body,...picked]);return;} if(index>=candidates.length)return;
   const group=g.get(candidates[index])!;
   const max=pairs?Math.min(1,left):Math.min(group.length,left);
   for(let take=0;take<=max;take++)visit(index+1,left-take,[...picked,...group.slice(0,take*(pairs?2:1))]);
  }; visit(0,count,[]);
 };
 for(const r of ranks){const cs=g.get(r)!;for(let n=1;n<=cs.length;n++)add(cs.slice(0,n));
  if(cs.length>=3){wings(cs.slice(0,3),[r],1,false);wings(cs.slice(0,3),[r],1,true);}
  if(cs.length===4){wings(cs,[r],2,false);wings(cs,[r],2,true);}
 }
 if(g.has(16)&&g.has(17))add([...g.get(16)!,...g.get(17)!]);
 for(const [copies,min] of [[1,5],[2,3],[3,2]])for(let start=3;start<=14;start++){
  const body:Card[]=[],bodyRanks:number[]=[];
  for(let end=start;end<=14;end++){
   if((g.get(end)?.length||0)<copies)break;
   body.push(...g.get(end)!.slice(0,copies));bodyRanks.push(end);
   if(bodyRanks.length<min)continue;add(body);
   if(copies===3){const k=bodyRanks.length;if(body.length+k<=hand.length)wings(body,bodyRanks,k,false);if(body.length+k*2<=hand.length)wings(body,bodyRanks,k,true);}
  }
 }
 return result.sort((a,b)=>a.pattern.rank-b.pattern.rank||b.cards.length-a.cards.length);
}
export type CharacterId='tomori'|'anon'|'rana'|'soyo'|'taki'|'uika'|'mutsumi'|'umiri'|'nyamu'|'sakiko';
export type Difficulty='casual'|'standard'|'expert';
export type GameMode='classic'|'skills';
export type Intel={by:number;target:number;skill:CharacterId;value:number;label:string;query?:Pattern;at:number};
export type PublicEvent={seat:number; text:string; kind:Kind|'bid'|'pass'|'start'|'skill'; cards:Card[]};
export type Game={mutsumiFace?:'quiet'|'mortis';difficulty:Difficulty;history:PublicEvent[];mode:GameMode;characters:CharacterId[];skillUses:number[];intel:Intel[];id:number;revision:number;phase:'bid'|'play'|'done';hands:Card[][];bottom:Card[];turn:number;landlord:number;bid:number;bidder:number;bidCount:number;passes:number;target:Move|null;lastSeat:number;played:number[];discard:Card[];bombs:number;spring:string;winner:number;delta:number[];events:PublicEvent[];notice:string};
let nextId=1;
export function newGame(random= Math.random,options:{mutsumiFace?:'quiet'|'mortis';mode?:GameMode;characters?:CharacterId[];difficulty?:Difficulty}={}):Game{
 const d=deck();for(let i=d.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[d[i],d[j]]=[d[j],d[i]];}
 return {mutsumiFace:options.mutsumiFace||'quiet',difficulty:options.difficulty||'standard',history:[],mode:options.mode||'classic',characters:options.characters||['tomori','anon','rana'],skillUses:[0,0,0],intel:[],id:nextId++,revision:0,phase:'bid',hands:[sortCards(d.slice(0,17)),sortCards(d.slice(17,34)),sortCards(d.slice(34,51))],bottom:d.slice(51),turn:Math.floor(random()*3),landlord:-1,bid:0,bidder:-1,bidCount:0,passes:0,target:null,lastSeat:-1,played:[0,0,0],discard:[],bombs:0,spring:'',winner:-1,delta:[0,0,0],events:[],notice:'新的合奏，准备开始。'};
}
function event(s:Game,e:PublicEvent){s.events=[...s.events.slice(-11),e];if(e.kind!=='bid'&&e.kind!=='skill'&&e.kind!=='start')s.history=[...s.history,e];}
export function bid(s:Game,seat:number,value:number):Game{
 if(s.phase!=='bid'||seat!==s.turn||!Number.isInteger(value)||value<0||value>3||(value!==0&&value<=s.bid))throw Error('现在不能这样叫分');
 const t={...s,revision:s.revision+1,bidCount:s.bidCount+1};
 event(t,{seat,text:value?`${value} 分`:'不叫',kind:'bid',cards:[]});
 if(value>0){t.bid=value;t.bidder=seat;}
 if(value===3||t.bidCount===3){
  if(t.bidder===-1){const fresh=newGame(Math.random,{mode:s.mode,characters:s.characters,difficulty:s.difficulty,mutsumiFace:s.mutsumiFace});fresh.notice='大家都不叫，重新发牌。';return fresh;}
  t.landlord=t.bidder;t.turn=t.bidder;t.phase='play';t.hands=t.hands.map((h,i)=>i===t.landlord?sortCards([...h,...t.bottom]):h);t.notice='地主已确定，开始出牌。';
 } else t.turn=(seat+1)%3;
 return t;
}
export function play(s:Game,seat:number,ids:number[]):Game{
 if(s.phase!=='play'||s.turn!==seat)throw Error('尚未轮到该角色出牌');
 const hand=s.hands[seat];const cards=ids.map(id=>hand.find(c=>c.id===id));
 if(new Set(ids).size!==ids.length||cards.some(c=>!c))throw Error('选牌无效，请重新选择');
 const t={...s,revision:s.revision+1};
 if(!ids.length){
  if(!s.target)throw Error('本轮须领出，不能不出');
  t.passes++;event(t,{seat,text:'不出',kind:'pass',cards:[]});
  if(t.passes===2){t.target=null;t.passes=0;t.turn=s.lastSeat;t.notice='两家不出，重新领出。';}else t.turn=(seat+1)%3;
  return t;
 }
 const actual=cards as Card[],p=classify(actual);if(!p)throw Error('这组牌还不能组成有效牌型');if(!beats(p,s.target?.pattern||null))throw Error('需要相同牌型且更大，或使用炸弹');
 t.intel=s.intel.filter(x=>x.target!==seat);
 t.hands=s.hands.map((h,i)=>i===seat?h.filter(c=>!ids.includes(c.id)):h);t.played=s.played.map((n,i)=>i===seat?n+1:n);t.discard=[...s.discard,...actual];
 t.target={cards:sortCards(actual),pattern:p};t.lastSeat=seat;t.passes=0;t.turn=(seat+1)%3;t.notice='';
 if(p.kind==='bomb'||p.kind==='rocket')t.bombs++;
 event(t,{seat,text:labels[p.kind],kind:p.kind,cards:sortCards(actual)});
 if(!t.hands[seat].length){
  t.phase='done';t.winner=seat;
  if(seat===t.landlord&&t.played.every((n,i)=>i===t.landlord||n===0))t.spring='春天';
  if(seat!==t.landlord&&t.played[t.landlord]===1)t.spring='反春天';
  const unit=t.bid*2**(t.bombs+(t.spring?1:0)),landlordWon=seat===t.landlord;
  t.delta=[0,1,2].map(i=>(i===t.landlord?2:-1)*(landlordWon?1:-1)*unit);
 }
 return t;
}
// This is the complete AI input: no opponent hand values are exposed.
export type AIView={mutsumiFace?:'quiet'|'mortis';gameId:number;revision:number;character:CharacterId;difficulty:Difficulty;history:PublicEvent[];bottom:Card[];bombs:number;intel:Intel[];hand:Card[];seat:number;landlord:number;counts:number[];target:Move|null;lastSeat:number;bid:number};
export function aiView(s:Game,seat:number):AIView{return {mutsumiFace:s.mutsumiFace,gameId:s.id,revision:s.revision,character:s.characters[seat],difficulty:s.difficulty,history:s.history,bottom:s.phase==='bid'?[]:s.bottom,bombs:s.bombs,intel:s.intel,hand:s.hands[seat],seat,landlord:s.landlord,counts:s.hands.map(h=>h.length),target:s.target,lastSeat:s.lastSeat,bid:s.bid};}
export function chooseBid(v:AIView):number{
 const g=groups(v.hand);const strength=v.hand.reduce((n,c)=>n+(c.rank>=16?2.2:c.rank===15?1.2:c.rank===14?.45:0),0)+[...g.values()].reduce((n,c)=>n+(c.length===4?3:c.length===3?.4:0),0);
 const value=strength>=8?3:strength>=5?2:strength>=3?1:0;return value>v.bid?value:0;
}
export function chooseMove(v:AIView):Card[]{
 const options=legalMoves(v.hand,v.target?.pattern||null);if(!options.length)return [];
 const finish=options.find(m=>m.cards.length===v.hand.length);if(finish)return finish.cards;
 if(v.target&&v.seat!==v.landlord&&v.lastSeat!==v.landlord)return [];
 const g=groups(v.hand);
 const threat=v.counts.some((n,i)=>i!==v.seat&&(v.seat===v.landlord||i===v.landlord)&&n<=2);
 const score=(m:Move)=>{
  let n=m.cards.length*4-m.pattern.rank*.17;
  const mg=groups(m.cards);for(const [rank,cs] of mg){const original=g.get(rank)!.length;if(cs.length<original)n-=original===4?14:original===3?3:1.5;}
  if(m.pattern.kind==='bomb'||m.pattern.kind==='rocket')n-=v.hand.length>6?16:4;
  if(v.target){n-=m.pattern.rank*.15;if(threat&&m.pattern.kind==='single')n+=m.pattern.rank*1.1;}
  for(const info of v.intel){if(info.target===v.seat||(v.seat!==v.landlord&&info.target!==v.landlord))continue;
   if(info.skill==='anon'&&info.query&&info.query.kind===m.pattern.kind&&info.query.size===m.pattern.size&&info.query.rank===m.pattern.rank)n+=info.value===0?3:-.6;
   if(info.skill==='rana'&&m.pattern.kind==='straight'&&m.cards.length>info.value)n+=3;
   if(info.skill==='soyo'&&info.value===0&&['pair','triple','tripleOne','triplePair'].includes(m.pattern.kind))n+=3;
   if(info.skill==='tomori'&&m.pattern.kind==='single'&&m.pattern.rank<info.value)n-=1;
   if(info.skill==='taki'&&info.value===0&&!['bomb','rocket'].includes(m.pattern.kind))n+=.4;
  }
  return n;
 };
 return [...options].sort((a,b)=>score(b)-score(a))[0].cards;
}

export const skillNames:Record<CharacterId,string>={tomori:'拾星',anon:'试音',rana:'即兴',soyo:'察言',taki:'节拍',uika:'和声·接续',mutsumi:'双面',umiri:'定拍',nyamu:'聚光',sakiko:'幕序'};
export const skillDescriptions:Record<CharacterId,string>={
 uika:'先选至少三张的普通牌，探知对手能压过它的最低同型主牌点数；不计炸弹。目标至少剩八张。',mutsumi:'睦·静弦：探知对手有无顺子。Mortis·戏弦：探知对手有无飞机主体。双面共享次数。',umiri:'公开一名对手持有的2与王的总张数。',nyamu:'公开一名对手手牌中不同点数的数量。',sakiko:'公开一名对手是否持有炸弹或王炸。',
 tomori:'捕捉微小线索：公开一名对手当前最小的点数。',
 anon:'先试探再登场：选好一组普通牌，探知对手能否用同型牌压过（不计炸弹）。',
 rana:'跟着直觉找旋律：公开一名对手能组成的最长顺子长度。',
 soyo:'留意细节：公开一名对手手中可组成对子的点数组数。',
 taki:'确认重拍：公开一名对手是否握有炸弹或王炸，不透露点数。'
};
export const skillBudget=(s:Game,seat:number)=>s.mode==='skills'?(seat===s.landlord?2:1):0;
export function skillReason(s:Game,seat:number,target:number,ids:number[]=[]):string{
 if(s.mode!=='skills')return '经典模式不使用角色技能';
 if(s.phase!=='play'||s.turn!==seat)return '只能在自己的出牌回合发动';
 if(s.skillUses[seat]>=skillBudget(s,seat))return '本局技能次数已用完';
 if(target<0||target>2||target===seat||(seat!==s.landlord&&target!==s.landlord))return '请选择敌方角色';
 if(s.hands[target].length<6)return '目标不足 6 张，进入收官保护阶段';
 const id=s.characters[seat];
 if(s.intel.some(i=>i.by===seat&&i.target===target&&i.skill===id))return '这份情报仍然有效，不必重复发动';
 if(id==='uika'){const cs=s.hands[seat].filter(c=>ids.includes(c.id)),p=classify(cs);if(cs.length!==ids.length||!p||cs.length<3||p.kind==='bomb'||p.kind==='rocket')return '先选择至少三张的有效普通牌';if(s.hands[target].length<8)return '接续需要对手至少剩 8 张';}
 if(id==='anon'){
  const cs=s.hands[seat].filter(c=>ids.includes(c.id)),p=classify(cs);
  if(cs.length!==ids.length||!p||p.kind==='bomb'||p.kind==='rocket')return '先在手牌中选择一组有效的普通牌';
 }
 return '';
}
export function useSkill(s:Game,seat:number,target:number,ids:number[]=[]):Game{
 const reason=skillReason(s,seat,target,ids);if(reason)throw Error(reason);
 const skill=s.characters[seat],hand=s.hands[target],g=groups(hand);let value=0,label='',query:Pattern|undefined;
 if(skill==='tomori'){value=Math.min(...hand.map(c=>c.rank));label=`最小点数是 ${rankLabel(value)}`;}
 if(skill==='anon'){query=classify(s.hands[seat].filter(c=>ids.includes(c.id)))!;value=Number(legalMoves(hand,query).some(m=>m.pattern.kind===query!.kind));label=`${value?'能':'不能'}用同型牌压过 ${rankLabel(query.rank)} 的${labels[query.kind]}（不计炸弹）`;}
 if(skill==='rana'){let run=0;for(let r=3;r<=14;r++){run=g.has(r)?run+1:0;value=Math.max(value,run);}if(value<5)value=0;label=value?`最长顺子可连 ${value} 张`:'目前不能组成顺子';}
 if(skill==='soyo'){value=[...g.values()].filter(cs=>cs.length>=2).length;label=`有 ${value} 组点数可组成对子`;}
 if(skill==='taki'){value=Number([...g.values()].some(cs=>cs.length===4))+Number(g.has(16)&&g.has(17))*2;label=['没有炸弹或王炸','有炸弹，没有王炸','有王炸，没有普通炸弹','有炸弹，也有王炸'][value];}
 if(skill==='uika'){query=classify(s.hands[seat].filter(c=>ids.includes(c.id)))!;const responses=legalMoves(hand,query).filter(m=>m.pattern.kind===query!.kind&&m.pattern.size===query!.size);value=responses.length?Math.min(...responses.map(m=>m.pattern.rank)):0;label=value?`接续 ${rankLabel(query.rank)} 的${labels[query.kind]}：最低以 ${rankLabel(value)} 为主牌可压过（不计炸弹）`:`不能用同型牌接续 ${rankLabel(query.rank)} 的${labels[query.kind]}（不计炸弹）`;}
 if(skill==='mutsumi'){const mortis=s.mutsumiFace==='mortis';value=Number(legalMoves(hand).some(m=>m.pattern.kind===(mortis?'plane':'straight')));if(mortis)query={kind:'plane',size:6,rank:0};label=`${mortis?'Mortis · 戏弦':'睦 · 静弦'}：${value?'能':'不能'}组成${mortis?'飞机主体':'顺子'}`;}
 if(skill==='umiri'){value=hand.filter(c=>c.rank>=15).length;label=`2 和大小王共 ${value} 张`;}
 if(skill==='nyamu'){value=g.size;label=`共有 ${value} 种点数`;}
 if(skill==='sakiko'){value=Number([...g.values()].some(cs=>cs.length===4)||(g.has(16)&&g.has(17)));label=value?'有炸弹或王炸':'没有炸弹或王炸';}
 const info:Intel={by:seat,target,skill,value,label,query,at:s.revision+1};
 const t={...s,revision:s.revision+1,skillUses:s.skillUses.map((n,i)=>i===seat?n+1:n),intel:[...s.intel,info]};
 event(t,{seat,text:skill==='mutsumi'?(s.mutsumiFace==='mortis'?'戏弦':'静弦'):skillNames[skill],kind:'skill',cards:[]});return t;
}
// Decide when to request information using only own cards and public counts. useSkill is the only reveal boundary.
export function autoSkill(s:Game,proposal?:number[]):Game|null{
 if(s.mode!=='skills'||s.phase!=='play')return null;const seat=s.turn;
 if(s.events.at(-1)?.kind==='skill'&&s.events.at(-1)?.seat===seat)return null;
 if(s.skillUses[seat]>0&&s.played[seat]<3)return null;
 const ids=proposal??chooseMove(aiView(s,seat)).map(c=>c.id);
 const character=s.characters[seat],enemyCounts=s.hands.map((h,i)=>i!==seat&&(seat===s.landlord||i===s.landlord)?h.length:99);
 if(character==='tomori'&&s.played[seat]<1)return null;
 if(character==='rana'&&s.played[seat]<2&&!['straight','pairs','plane','planeOne','planePair'].includes(classify(s.hands[seat].filter(c=>ids.includes(c.id)))?.kind||''))return null;
 if(character==='soyo'&&s.history.length<3)return null;
 if(character==='taki'&&Math.min(...enemyCounts)>10&&s.hands[seat].length>10)return null;
 const targets=[0,1,2].filter(i=>i!==seat&&(seat===s.landlord||i===s.landlord)).sort((a,b)=>s.hands[a].length-s.hands[b].length);
 const target=targets.find(i=>!skillReason(s,seat,i,ids));return target===undefined?null:useSkill(s,seat,target,ids);
}
