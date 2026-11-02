import {rpgNpcs} from './plazaRpgNpcs';
import {moveWithCollisions} from '../modules/adventure/domain/movement';

export type Solid = { id: string; x: number; y: number; rx: number; ry: number; ellipse?: boolean; polygon?: [number,number][]; depth?: number; canopy?: [number, number, number, number] };
// All coordinates refer to the approved 1671 × 941 clean art atlas; feet are the origin.
export const BUS_PLACEMENT = { x: 1010, y: 736, width: 650, height: 190, foot: 926 } as const;
// Approach beside the front of the vehicle, where its body cannot cover Chaski.
export const BUS_BOARDING = {x:960,y:875,radius:45,maxX:980} as const;
export function atBusBoarding(x:number,y:number){return x<=BUS_BOARDING.maxX&&Math.hypot(x-BUS_BOARDING.x,y-BUS_BOARDING.y)<=BUS_BOARDING.radius;}
// Pavement follows the base of the palace, cathedral and right terrace. The sky
// and the gaps between architecture are not part of the playable surface.
export const plazaFloor:readonly (readonly [number,number])[]=[
 [0,398],[618,398],[618,358],[1115,358],[1115,405],[1671,405],[1671,941],[0,941],
];
export function onPlazaFloor(x:number,y:number,r=9){
 let inside=false;
 for(let i=0,j=plazaFloor.length-1;i<plazaFloor.length;j=i++){
  const [ax,ay]=plazaFloor[j],[bx,by]=plazaFloor[i];
  if((ay>y)!==(by>y)&&x<(bx-ax)*(y-ay)/(by-ay)+ax)inside=!inside;
  const dx=bx-ax,dy=by-ay,t=Math.max(0,Math.min(1,((x-ax)*dx+(y-ay)*dy)/(dx*dx+dy*dy)));
  if(Math.hypot(x-ax-t*dx,y-ay-t*dy)<r)return false;
 }
 return inside;
}
export const solids: Solid[] = [
  ...rpgNpcs.map(npc=>({id:`npc-${npc.id}`,x:npc.x,y:npc.y-3,rx:npc.radius,ry:11})),
  {id:'palacio',x:305,y:245,rx:305,ry:153},
  {id:'catedral',x:862,y:183,rx:244,ry:175},
  {id:'escalinata',x:1502,y:300,rx:169,ry:105},
  {id:'fuente',x:855,y:555,rx:240,ry:78,polygon:[[613,533],[664,492],[745,474],[963,474],[1047,500],[1095,545],[1085,595],[1020,627],[704,627],[623,596]],depth:632,canopy:[610,357,490,274]},
  {id:'arbol-grande',x:145,y:505,rx:19,ry:12,ellipse:true,depth:520,canopy:[0,0,590,520]},
  {id:'jacaranda',x:48,y:552,rx:17,ry:11,ellipse:true,depth:558,canopy:[0,252,197,309]},
  {id:'palmera',x:1313,y:344,rx:15,ry:10,ellipse:true,depth:355,canopy:[1200,50,225,309]},
  {id:'arbol-este',x:1125,y:433,rx:17,ry:10,ellipse:true,depth:444,canopy:[1020,274,211,174]},
  {id:'arbol-sur',x:543,y:795,rx:17,ry:9,ellipse:true,depth:804,canopy:[382,648,275,160]},
  {id:'arbol-paradero',x:1085,y:824,rx:15,ry:9,ellipse:true,depth:834,canopy:[1015,655,125,181]},
  {id:'jardin-izq',x:296,y:450,rx:84,ry:25,depth:479,canopy:[209,394,175,85]},
  {id:'jardin-busto',x:119,y:715,rx:119,ry:45,depth:765,canopy:[0,642,244,124]},
  {id:'busto',x:115,y:638,rx:42,ry:43,depth:680,canopy:[68,518,94,165]},
  {id:'jardin-sur-atras',x:520,y:766,rx:133,ry:22,depth:793,canopy:[384,701,272,92]},
  {id:'jardin-sur-frente',x:531,y:826,rx:136,ry:23,depth:853,canopy:[390,785,280,68]},
  {id:'jardin-escalera-izq',x:1327,y:364,rx:80,ry:29,depth:397,canopy:[1242,292,170,105]},
  {id:'jardin-escalera-der',x:1607,y:367,rx:64,ry:31,depth:401,canopy:[1536,298,135,103]},
  {id:'jardin-puesto-der',x:1600,y:520,rx:71,ry:15,depth:535,canopy:[1528,483,143,106]},
  {id:'jardin-puesto-izq',x:1300,y:566,rx:54,ry:29,depth:597,canopy:[1244,516,114,81]},
  {id:'banca-oeste',x:487,y:485,rx:63,ry:8,depth:494,canopy:[412,426,153,70]},
  {id:'banca-centro',x:709,y:435,rx:49,ry:8,depth:443,canopy:[653,384,112,61]},
  {id:'banca-este',x:1052,y:435,rx:51,ry:8,depth:443,canopy:[993,384,122,62]},
  {id:'cuadros',x:316,y:633,rx:51,ry:25,depth:659,canopy:[267,525,107,136]},
  {id:'caballete',x:443,y:646,rx:26,ry:17,depth:661,canopy:[410,577,64,86]},
  {id:'puesto',x:1450,y:543,rx:67,ry:12,depth:556,canopy:[1375,416,159,143]},
  {id:'estacion',x:1423,y:777,rx:247,ry:30,depth:807,canopy:[1171,595,500,213]},
  {id:'bus',x:BUS_PLACEMENT.x+BUS_PLACEMENT.width/2,y:880,rx:BUS_PLACEMENT.width/2-12,ry:45,depth:BUS_PLACEMENT.foot},
  ...[[239,587],[637,462],[1340,590],[691,880],[1519,298],[1200,344],[1041,385],[161,831],[294,831],[1007,831]].map(([x,y],i)=>({id:`farol-poste-${i}`,x,y,rx:8,ry:7,ellipse:true,depth:y+10,canopy:(i<7?[
   [201,357,77,245],[599,275,76,201],[1298,383,84,223],[647,648,88,249],
   [1474,123,90,184],[1170,207,60,146],[1009,286,64,109],
  ][i]:[x-12,y-48,24,58]) as [number,number,number,number]})),
];
export function blocked(x:number,y:number,r=9){
  if(!onPlazaFloor(x,y,r))return true;
  return solids.some(o=>{
    if(o.polygon){let inside=false;const v=o.polygon;for(let i=0,j=v.length-1;i<v.length;j=i++){
      const [ax,ay]=v[j],[bx,by]=v[i];if((ay>y)!==(by>y)&&x<(bx-ax)*(y-ay)/(by-ay)+ax)inside=!inside;
      const dx=bx-ax,dy=by-ay,t=Math.max(0,Math.min(1,((x-ax)*dx+(y-ay)*dy)/(dx*dx+dy*dy)));
      if(Math.hypot(x-ax-t*dx,y-ay-t*dy)<r)return true;
    }return inside;}
    return o.ellipse ? ((x-o.x)/(o.rx+r))**2+((y-o.y)/(o.ry+r))**2<1 : Math.abs(x-o.x)<o.rx+r&&Math.abs(y-o.y)<o.ry+r;
  });
}
export function movePlayer(p:{x:number;y:number},dx:number,dy:number){
  moveWithCollisions(p,dx,dy,blocked);
}
