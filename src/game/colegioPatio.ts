import {moveWithCollisions} from '../modules/adventure/domain/movement';

export const COLEGIO_WIDTH=1672;
export const COLEGIO_HEIGHT=941;
export type PatioSolid={id:string;x:number;y:number;rx:number;ry:number;ellipse?:boolean};
export const sofiaFeet={x:400,y:333} as const;
export const upperSolids:readonly PatioSolid[]=[{id:'npc-sofia',...sofiaFeet,rx:23,ry:10,ellipse:true}];

// The upper gallery has a narrow strip of real floor behind the balustrade.
export function upperBlocked(x:number,y:number,r=10):boolean {
 if(x<350+r||x>1360-r||y<301+r||y>343-r)return true;
 return upperSolids.some(o=>((x-o.x)/(o.rx+r))**2+((y-o.y)/(o.ry+r))**2<1);
}
export function moveUpperPlayer(p:{x:number;y:number},dx:number,dy:number):void {
 const steps=Math.max(1,Math.ceil(Math.hypot(dx,dy)/4));
 for(let i=0;i<steps;i++){
  const x=Math.max(360,Math.min(1350,p.x+dx/steps)),y=Math.max(311,Math.min(333,p.y+dy/steps));
  if(!upperBlocked(x,p.y))p.x=x;
  if(!upperBlocked(p.x,y))p.y=y;
 }
}

// x/y is the ground contact; the artwork above each base remains non-solid.
export const patioSolids:readonly PatioSolid[]=[
 {id:'fachada',x:836,y:550,rx:494,ry:16},
 {id:'escalera',x:1425,y:593,rx:143,ry:39},
 {id:'jardin-arbol',x:125,y:788,rx:125,ry:37},
 {id:'jardin-fondo-izq',x:490,y:580,rx:164,ry:21},
 {id:'jardin-fondo-der',x:1140,y:580,rx:139,ry:21},
 {id:'jardin-derecho',x:1441,y:779,rx:201,ry:49},
 {id:'jardin-derecho-fondo',x:1414,y:715,rx:118,ry:25},
 {id:'arbol-izquierdo',x:53,y:745,rx:28,ry:19,ellipse:true},
 {id:'arbol-derecho',x:1580,y:490,rx:28,ry:17,ellipse:true},
 {id:'banca-fondo-izq',x:466,y:609,rx:91,ry:23},
 {id:'banca-fondo-der',x:1169,y:610,rx:89,ry:23},
 {id:'banca-frente-izq',x:468,y:811,rx:108,ry:34},
 {id:'banca-frente-der',x:1224,y:812,rx:111,ry:34},
 {id:'busto',x:326,y:843,rx:80,ry:38},
 {id:'tablero',x:232,y:654,rx:82,ry:28},
 {id:'farol',x:595,y:745,rx:17,ry:12,ellipse:true},
 {id:'pedestal-farol',x:607,y:775,rx:36,ry:25},
 {id:'reciclaje',x:1454,y:817,rx:99,ry:27},
 // The flagpole is mounted on the balcony, not in the entrance below.
 {id:'maceta-izquierda',x:104,y:625,rx:20,ry:12,ellipse:true},
 {id:'maceta-tablon',x:343,y:614,rx:18,ry:11,ellipse:true},
 {id:'npc-entrada',x:850,y:611,rx:18,ry:10,ellipse:true},
 {id:'maceta-entrada-derecha',x:1283,y:601,rx:25,ry:14,ellipse:true},
 {id:'jardin-frente-izq-remate',x:596,y:797,rx:34,ry:26},
 {id:'jardin-frente-der-remate',x:1084,y:799,rx:35,ry:26},
];

// Continuous route through both stair flights and their landing, in image coordinates.
export const schoolStairPath= [{x:1375,y:652},{x:1460,y:501},{x:1360,y:346},{x:1320,y:333}] as const;
export const stairLength=schoolStairPath.slice(1).reduce((length,p,i)=>length+Math.hypot(p.x-schoolStairPath[i].x,p.y-schoolStairPath[i].y),0);
export function stairPosition(distance:number){
 let remaining=Math.max(0,Math.min(stairLength,distance));
 for(let i=1;i<schoolStairPath.length;i++){
  const a=schoolStairPath[i-1],b=schoolStairPath[i],length=Math.hypot(b.x-a.x,b.y-a.y);
  if(remaining<=length)return {x:a.x+(b.x-a.x)*remaining/length,y:a.y+(b.y-a.y)*remaining/length};
  remaining-=length;
 }
 return {...schoolStairPath[schoolStairPath.length-1]};
}

export function patioBlocked(x:number,y:number,r=10,objects:readonly PatioSolid[]=patioSolids):boolean {
 if(x<r||x>COLEGIO_WIDTH-r||y<560+r||y>COLEGIO_HEIGHT-r)return true;
 return objects.some(o=>o.ellipse?((x-o.x)/(o.rx+r))**2+((y-o.y)/(o.ry+r))**2<1:Math.abs(x-o.x)<o.rx+r&&Math.abs(y-o.y)<o.ry+r);
}

export function movePatioPlayer(p:{x:number;y:number},dx:number,dy:number,objects:readonly PatioSolid[]=patioSolids):void {
 moveWithCollisions(p,dx,dy,(x,y)=>patioBlocked(x,y,10,objects));
}
