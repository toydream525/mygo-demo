import {createContext,useContext,useId} from 'react';
export const outfits=[{id:'official',name:'官方卡面',note:'ガルパ · 特训后'},{id:'ark',name:'方舟 · 演出服',note:'官方联动'},{id:'arkSkin',name:'方舟 · 联动时装',note:'官方联动'},{id:'anime',name:'官方立绘',note:'公式'}] as const;
export type Outfit=typeof outfits[number]['id'];
export const WardrobeContext=createContext<Record<string,Outfit>>({});
export const officialCards:Record<string,{id:number;title:string;resource:string;crop:string}>={tomori:{id:1823,title:'心の叫び',resource:'res036004',crop:'160 150 720 874'},anon:{id:1824,title:'迷いながら',resource:'res037004',crop:'150 80 724 944'},rana:{id:1853,title:'コインパーキングの猫',resource:'res038005',crop:'190 120 744 904'},soyo:{id:1825,title:'終わらせてあげる',resource:'res039004',crop:'200 140 754 884'},taki:{id:1852,title:'私と、取引しよう',resource:'res040005',crop:'160 150 740 874'}};
export default function Portrait({id,outfit,alt='',full=false}:{id:string;outfit?:Outfit;alt?:string;full?:boolean}){
 const clip=useId().replace(/:/g,''),wardrobe=useContext(WardrobeContext),selected=outfit??wardrobe[id]??'official';
 if(['uika','mutsumi','umiri','nyamu','sakiko'].includes(id))return <img className={`portrait official-mujica ${full?'portrait-full':'portrait-close'}`} src={`./art/official/${id}-${selected==='arkSkin'?'skin':'stage'}-${full?'portrait':'face'}.png`} alt={alt}/>;
 const box=officialCards[id].crop;
 const [x,y,w,h]=box.split(' ').map(Number);
 return <svg className="portrait portrait-official" viewBox={box} preserveAspectRatio="xMidYMin meet" role={alt?'img':undefined} aria-label={alt||undefined} aria-hidden={!alt} focusable="false"><defs><clipPath id={clip}><rect x={x} y={y} width={w} height={h}/></clipPath></defs><image clipPath={`url(#${clip})`} href={`./art/official/${id}-trim.png`} width={1024} height={1024}/></svg>;
}
