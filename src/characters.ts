export const characters = [
 {id:'tomori',name:'高松 灯',jp:'高松 燈',en:'TOMORI TAKAMATSU',role:'VOCAL',color:'#8db8cf',tag:'把心里的话，慢慢说出来。',description:'内向而认真，珍惜每一次与同伴相遇。'},
 {id:'anon',name:'千早 爱音',jp:'千早 愛音',en:'ANON CHIHAYA',role:'GUITAR',color:'#e2a5ba',tag:'这一次，也要闪闪发光。',description:'喜欢新鲜事物，总会试着向前迈出一步。'},
 {id:'rana',name:'要 乐奈',jp:'要 楽奈',en:'RĀNA KANAME',role:'GUITAR',color:'#a9c3a6',tag:'跟着有趣的声音走。',description:'自由而随性，凭直觉寻找有趣的事。'},
 {id:'soyo',name:'长崎 素世',jp:'長崎 そよ',en:'SOYO NAGASAKI',role:'BASS',color:'#d8c798',tag:'那些共同走过的时光。',description:'温柔的表情之下，藏着细腻又复杂的心意。'},
 {id:'taki',name:'椎名 立希',jp:'椎名 立希',en:'TAKI SHIINA',role:'DRUMS',color:'#b5a1cf',tag:'认真对待，每一个节拍。',description:'直率、专注，用行动表达对伙伴的在意。'},
 {id:"uika",name:"三角 初华",jp:"三角 初華",en:"UIKA MISUMI",role:"GUITAR / VOCAL",color:"#c590ad",tag:"稳健而温和，重视与同伴的衔接。",description:"稳健而温和，重视与同伴的衔接。"},
 {id:"mutsumi",name:"若叶 睦",jp:"若葉 睦",en:"MUTSUMI WAKABA",role:"GUITAR",color:"#91b993",tag:"安静寡言，以连贯的旋律回应。",description:"睦把心事藏进沉默与吉他；Mortis则主动走到聚光灯下，渴望被看见，也害怕舞台散场。两种声音，牵系着同一个舞台。"},
 {id:"umiri",name:"八幡 海铃",jp:"八幡 海鈴",en:"UMIRI YAHATA",role:"BASS",color:"#7ba9b9",tag:"沉着务实，注重效率和配合。",description:"沉着务实，注重效率和配合。"},
 {id:"nyamu",name:"祐天寺 喵梦",jp:"祐天寺 にゃむ",en:"NYAMU YUTENJI",role:"DRUMS",color:"#d49aaa",tag:"善于表现，敏锐寻找新的机会。",description:"善于表现，敏锐寻找新的机会。"},
 {id:"sakiko",name:"丰川 祥子",jp:"豊川 祥子",en:"SAKIKO TOGAWA",role:"KEYBOARD",color:"#aa98cc",tag:"讲究秩序，以规划掌握节奏。",description:"讲究秩序，以规划掌握节奏。"}
] as const;
export type Character = typeof characters[number];
export const art = (id:string)=>`./art/${id}.png`;

export type Band = 'mygo'|'mujica';
export const bandFor=(id:string):Band=>['uika','mutsumi','umiri','nyamu','sakiko'].includes(id)?'mujica':'mygo';
export const bandNames:Record<Band,string>={mygo:'MyGO!!!!!',mujica:'Ave Mujica'};

export function pickOpponents(playerId:string,count:number,random=Math.random):Character[]{
 const pool=characters.filter(c=>c.id!==playerId);
 for(let i=pool.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[pool[i],pool[j]]=[pool[j],pool[i]];}
 return pool.slice(0,count);
}
