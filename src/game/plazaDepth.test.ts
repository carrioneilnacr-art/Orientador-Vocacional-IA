import {describe,it,expect} from 'vitest';
import {blocked,solids} from './plazaPhysics';
import {insideForegroundShape} from './plazaOcclusion';

describe('Profundidad y huellas físicas de la plaza',()=>{
 it('ordena los objetos por el contacto inferior y mantiene libre el espacio sobre un poste',()=>{
  const farol=solids.find(s=>s.id==='farol-poste-0')!;
  expect(farol.depth).toBe(farol.y+10);
  expect(blocked(farol.x,farol.y)).toBe(true);
  expect(blocked(farol.x+28,farol.y)).toBe(false);
  expect(blocked(farol.x,farol.y-35)).toBe(false);
 });
 it('usa bases pequeñas para árbol, banca, puesto y NPC',()=>{
  for(const id of ['arbol-sur','banca-oeste','puesto','npc-mateo']){
   const s=solids.find(o=>o.id===id)!;
   expect(blocked(s.x,s.y),id).toBe(true);
   expect(blocked(s.x,s.y-65),id).toBe(false);
  }
 });
 it('un recorte de árbol no levanta píxeles del edificio vecino',()=>{
  expect(insideForegroundShape('arbol-grande',420,240,590,520)).toBe(false);
  expect(insideForegroundShape('arbol-grande',130,370,590,520)).toBe(true);
 });
 it('caballete y jardín del busto participan del primer plano sin tapar con suelo sus huecos',()=>{
  for(const id of ['caballete','jardin-busto']){const object=solids.find(o=>o.id===id)!;expect(object.canopy,id).toBeDefined();expect(object.depth,id).toBeGreaterThan(object.y);}
  expect(insideForegroundShape('caballete',5,10,64,86)).toBe(false);
  expect(insideForegroundShape('caballete',34,5,64,86)).toBe(true);
  expect(insideForegroundShape('caballete',20,70,64,86)).toBe(false);
 });
});
