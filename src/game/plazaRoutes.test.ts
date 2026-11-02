import {describe,it,expect} from 'vitest';
import {blocked,atBusBoarding} from './plazaPhysics';
import {rpgNpcs} from './plazaRpgNpcs';

describe('Rutas caminables de la plaza',()=>{
 it('Chaski puede alcanzar las cinco zonas de charla y la puerta del Metropolitano',()=>{
  const step=20, start:[number,number]=[850,750];
  const key=(x:number,y:number)=>`${x},${y}`;
  const queue:[[number,number],number][]=[[[Math.round(start[0]/step),Math.round(start[1]/step)],0]];
  const seen=new Set([key(...queue[0][0])]);
  for(let i=0;i<queue.length;i++){
   const [[gx,gy]]=queue[i];
   for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){
    const nx=gx+dx,ny=gy+dy,k=key(nx,ny);
    if(!seen.has(k)&&!blocked(nx*step,ny*step)){seen.add(k);queue.push([[nx,ny],0]);}
   }
  }
  for(const npc of rpgNpcs){
   const reachable=[...seen].some(k=>{const [x,y]=k.split(',').map(Number);return Math.hypot(x*step-npc.x,y*step-npc.y)<95;});
   expect(reachable,npc.name).toBe(true);
  }
  expect([...seen].some(k=>{const [x,y]=k.split(',').map(Number);return atBusBoarding(x*step,y*step);})).toBe(true);
 });
});
