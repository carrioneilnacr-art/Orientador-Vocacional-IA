import {describe,expect,it} from 'vitest';
import {movePatioPlayer,patioBlocked,patioSolids,schoolStairPath,stairPosition,stairLength,moveUpperPlayer,upperBlocked,sofiaFeet} from './colegioPatio';

describe('patio del colegio — fase 1',()=>{
 it('bloquea los pies de Sofía pero permite rodearla por el fondo de la galería',()=>{
  expect(upperBlocked(sofiaFeet.x,sofiaFeet.y)).toBe(true);
  const p={x:1320,y:333};
  moveUpperPlayer(p,-1000,0);
  expect(p.x).toBeGreaterThanOrEqual(sofiaFeet.x+33);
  expect(upperBlocked(p.x,p.y)).toBe(false);
  moveUpperPlayer(p,0,-22);
  moveUpperPlayer(p,-100,0);
  expect(p.x).toBeLessThan(sofiaFeet.x);
  expect(upperBlocked(p.x,p.y)).toBe(false);
 });
 it('conserva llegada de escalera y puertas dentro del suelo superior',()=>{
  expect(upperBlocked(1320,333)).toBe(false);
  for(const x of [1340,1045,590])expect(upperBlocked(x,333)).toBe(false);
  const p={x:1320,y:333};moveUpperPlayer(p,500,500);
  expect(upperBlocked(p.x,p.y)).toBe(false);
  expect(p.x).toBeLessThanOrEqual(1350);expect(p.y).toBeLessThanOrEqual(333);
 });
 it('conecta el punto de llegada con Elena, la escalera y todo el suelo libre muestreado',()=>{
  const step=5,stride=2000;
  const start=747*stride+835,queue=[start],seen=new Set(queue);
  expect(patioBlocked(835,747)).toBe(false);
  for(let i=0;i<queue.length;i++){
   const x=queue[i]%stride,y=Math.floor(queue[i]/stride);
   for(const [dx,dy] of [[step,0],[-step,0],[0,step],[0,-step]]){
    const key=(y+dy)*stride+x+dx;
    if(seen.has(key))continue;
    const p={x,y};movePatioPlayer(p,dx,dy);
    if(p.x===x+dx&&p.y===y+dy){seen.add(key);queue.push(key);}
   }
  }
  const elena=patioSolids.find(object=>object.id==='npc-entrada')!;
  expect(seen.has((elena.y+41)*stride+elena.x)).toBe(true);
  const stairs=schoolStairPath[0];
  expect(seen.has(stairs.y*stride+stairs.x)).toBe(true);
  let free=0;
  for(let y=572;y<=931;y+=step)for(let x=10;x<=1662;x+=step){
   if(!patioBlocked(x,y))free++;
  }
  expect(seen.size).toBe(free);
 });
 it('conecta ambos pisos por una ruta continua y reversible',()=>{
  expect(stairPosition(0)).toEqual(schoolStairPath[0]);
  expect(stairPosition(stairLength)).toEqual(schoolStairPath[3]);
  for(let distance=1;distance<stairLength;distance++){
   const a=stairPosition(distance-1),b=stairPosition(distance);
   expect(Math.hypot(a.x-b.x,a.y-b.y)).toBeLessThanOrEqual(1.001);
  }
  expect(patioBlocked(schoolStairPath[0].x,schoolStairPath[0].y)).toBe(false);
 });
 it('mantiene separados el arte y las bases físicas de los obstáculos',()=>{
  expect(new Set(patioSolids.map(o=>o.id)).size).toBe(patioSolids.length);
  expect(patioBlocked(835,400)).toBe(true);
  expect(patioBlocked(466,618)).toBe(true);
  expect(patioBlocked(595,745)).toBe(true);
  expect(patioBlocked(835,740)).toBe(false);
 });
 it('permite recorrer el patio y frena ante las bancas',()=>{
  const p={x:835,y:747};
  movePatioPlayer(p,0,140);
  expect(p.y).toBeGreaterThan(875);
  movePatioPlayer(p,650,0);
  expect(p.x).toBeGreaterThan(1450);
  const nearBench={x:700,y:618};
  movePatioPlayer(nearBench,-200,0);
  expect(nearBench.x).toBeGreaterThan(560);
 });
 it('bloquea edificio y límites sin atravesarlos con desplazamientos largos',()=>{
  const p={x:835,y:747};
  movePatioPlayer(p,0,-400);
  expect(patioBlocked(p.x,p.y)).toBe(false);
  expect(p.y).toBeGreaterThanOrEqual(570);
  movePatioPlayer(p,0,700);
  expect(p.y).toBeLessThanOrEqual(931);
 });
});
