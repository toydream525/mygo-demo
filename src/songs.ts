import type {Kind} from './engine';
// Official track titles; the game/visual associations below are fan interpretations.
export const deckSongs:Record<number,string>={3:'迷星叫',4:'壱雫空',5:'碧天伴走',6:'影色舞',7:'音一会',8:'詩超絆',9:'迷路日々',10:'歩拾道',11:'明弦音',12:'夜隠染',13:'焚音打',14:'往欄印',15:'残痕字',16:'迷星叫',17:'詩超絆'};
export const comboSongs:Partial<Record<Kind|string,{title:string;motif:string;theme:string}>>={
 straight:{title:'歩拾道',motif:'一步一步，把散落的光连成路',theme:'path'},
 pairs:{title:'碧天伴走',motif:'两道光轨，并肩前行',theme:'sky'},
 plane:{title:'壱雫空',motif:'雨滴升起，穿过夜空',theme:'rain'},
 planeOne:{title:'壱雫空',motif:'雨滴升起，穿过夜空',theme:'rain'},
 planePair:{title:'壱雫空',motif:'雨滴升起，穿过夜空',theme:'rain'},
 tripleOne:{title:'音一会',motif:'不同的声音，在此相遇',theme:'chord'},
 triplePair:{title:'音一会',motif:'不同的声音，在此相遇',theme:'chord'},
 fourTwo:{title:'影色舞',motif:'交错的光影，随节拍舞动',theme:'shadow'},
 fourPairs:{title:'影色舞',motif:'交错的光影，随节拍舞动',theme:'shadow'},
 bomb:{title:'焚音打',motif:'火种跃动，让舞台亮起来',theme:'fire'},
 rocket:{title:'詩超絆',motif:'五束星光，汇成同一个声音',theme:'stars'},
 spring:{title:'春日影',motif:'舞台落下暖色的光',theme:'sun'},
};
