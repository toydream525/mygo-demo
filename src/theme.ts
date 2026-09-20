import {createContext} from 'react';
export const ThemeContext=createContext<'mygo'|'mujica'>('mygo');
export const mujicaMotifs:Record<number,string>={3:'仮面',4:'月影',5:'幕間',6:'薔薇',7:'人形',8:'舞台',9:'残響',10:'夜想',11:'運命',12:'祈り',13:'終幕',14:'星月',15:'再演',16:'月蝕',17:'黎明'};
