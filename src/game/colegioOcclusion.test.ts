import {describe,it,expect} from 'vitest';
import {createCanvas} from '@napi-rs/canvas';
import {patioForeground,tracePatioForeground} from './colegioOcclusion';
import {patioBlocked,movePatioPlayer} from './colegioPatio';

describe('Patio: profundidad y contornos por objeto',()=>{
 const ctx=createCanvas(1672,941).getContext('2d');
 function covers(id:string,x:number,y:number){
  const object=patioForeground.find(item=>item.id===id)!;
  tracePatioForeground(ctx as unknown as CanvasRenderingContext2D,object);
  return ctx.isPointInPath(x,y);
 }
 it('la banca marcada conserva el respaldo pero deja libre el suelo entre sus patas',()=>{
  expect(covers('banca-fondo-izq',460,560)).toBe(true);
  expect(covers('banca-fondo-izq',466,625)).toBe(false);
  expect(patioBlocked(466,653)).toBe(false);
  expect(patioForeground.find(o=>o.id==='banca-fondo-izq')!.foot).toBeLessThan(653);
 });
 it('el farol y el tablero no levantan pavimento junto a sus postes',()=>{
  expect(covers('farol',594,600)).toBe(true);
  expect(covers('farol',620,600)).toBe(false);
  expect(covers('tablero',232,560)).toBe(true);
  expect(covers('tablero',232,662)).toBe(false);
 });
 it('frena antes de atravesar asientos, reciclaje y jardinera desde el patio',()=>{
  for(const [x,y] of [[466,675],[1224,890],[1454,890],[1550,890]]){
   const p={x,y};expect(patioBlocked(x,y)).toBe(false);
   movePatioPlayer(p,0,-180);
   expect(patioBlocked(p.x,p.y)).toBe(false);expect(p.y).toBeGreaterThan(y-180);
  }
 });
});
