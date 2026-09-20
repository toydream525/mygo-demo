import {useContext} from 'react';
import {ThemeContext} from './theme';
import Portrait from './Portrait';
import {comboSongs} from './songs';
import {Music2,Plane,Zap,AudioLines,Star} from 'lucide-react';
import {type Character} from './characters';
import {labels,type Kind} from './engine';
export type EffectCue={kind:Kind|'skill'|'flush'|'spring';seat:number;nonce:number;name?:string};
export const comboKinds=new Set(['tripleOne','triplePair','straight','pairs','plane','planeOne','planePair','fourTwo','fourPairs','bomb','rocket']);
export const voiceForKind:Partial<Record<Kind,number>>={single:15,pair:15,triple:15,tripleOne:14,triplePair:14,straight:3,pairs:4,plane:5,planeOne:5,planePair:5,fourTwo:14,fourPairs:14,bomb:6,rocket:7};
export default function ComboEffect({cue,character}:{cue:EffectCue;character:Character}){
 const theme=useContext(ThemeContext);const song=theme==='mygo'?comboSongs[cue.kind]:undefined;
 const type=cue.kind.startsWith('plane')?'plane':cue.kind==='bomb'||cue.kind==='rocket'?'burst':cue.kind==='straight'?'trail':cue.kind==='pairs'?'rhythm':'chord';
 const title=cue.name||(cue.kind==='skill'?'技能发动':cue.kind==='flush'?'同色星光':cue.kind==='spring'?'春天':labels[cue.kind]);
 return <div className={`combo-effect combo-${type} effect-${cue.kind} song-${song?.theme||'chord'}`} style={{'--effect-color':character.color} as React.CSSProperties} aria-live="polite">
  <div className="combo-streak"/><div className="combo-face"><Portrait id={character.id}/></div>
  <div className="combo-particles">{Array.from({length:9},(_,i)=><i key={i} style={{'--particle':i} as React.CSSProperties}>{theme==='mujica'?'☾':'✦'}</i>)}</div>
  <div className="combo-title">{song&&<span className="combo-song">{song.title}</span>}{type==='plane'?<Plane/>:type==='burst'?<Zap/>:type==='rhythm'?<AudioLines/>:cue.kind==='skill'?<Star/>:<Music2/>}<strong>{title}</strong><small>{character.name} · {cue.kind==='bomb'||cue.kind==='rocket'?'倍数 ×2':cue.kind==='flush'?'花色彩蛋 · 不改变牌力':cue.kind==='skill'?'这一刻，捕捉牌桌的节奏':song?.motif||'我们的节拍，连在一起'}</small></div>
 </div>;
}
