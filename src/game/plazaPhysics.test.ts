import {describe,it,expect} from 'vitest';
import {blocked,movePlayer,solids,BUS_PLACEMENT,BUS_BOARDING,atBusBoarding,onPlazaFloor} from './plazaPhysics';
describe('Plaza física',()=>{
 it('el borde lateral de la fuente es sólido y deja libre el paso exterior',()=>{expect(blocked(632,565)).toBe(true);expect(blocked(590,565)).toBe(false);expect(blocked(855,624)).toBe(true);});
 it('el autobús ampliado bloquea su nuevo extremo izquierdo y mantiene el paso exterior',()=>{expect(blocked(1400,899)).toBe(true);expect(blocked(1100,900)).toBe(true);expect(blocked(980,900)).toBe(false);});
 it('el autobús más alto conserva sus ruedas y su huella en la pista',()=>{
  expect(BUS_PLACEMENT.height).toBe(190);
  expect(BUS_PLACEMENT.y+BUS_PLACEMENT.height).toBe(BUS_PLACEMENT.foot);
  expect(blocked(1100,900)).toBe(true);expect(blocked(980,900)).toBe(false);
 });
 it('cada objeto sólido bloquea por su base',()=>{for(const o of solids)expect(blocked(o.x,o.y),o.id).toBe(true);});
 it('impide atravesar la fuente incluso con un desplazamiento grande',()=>{const p={x:855,y:690};movePlayer(p,0,-400);expect(p.y).toBeGreaterThan(630);expect(blocked(p.x,p.y)).toBe(false);});
 it('permite rodear la fuente por la plaza inferior',()=>{const p={x:850,y:690};movePlayer(p,-250,0);expect(p.x).toBeLessThan(610);expect(blocked(p.x,p.y)).toBe(false);});
 it('bloquea el límite del nivel',()=>{const p={x:850,y:920};movePlayer(p,0,100);expect(p.y).toBeLessThanOrEqual(932);});
 it('cierra el corredor que permitía caminar al cielo sin bloquear el pavimento',()=>{
  const p={x:850,y:749};movePlayer(p,325,0);movePlayer(p,0,-735);
  expect(p.y).toBeGreaterThanOrEqual(414);expect(onPlazaFloor(p.x,p.y)).toBe(true);
  for(const [x,y] of [[1163,14],[1150,300],[10,10],[1600,100]])expect(blocked(x,y)).toBe(true);
  expect(blocked(850,690)).toBe(false);
 });
 it('el acceso al bus es visible a su izquierda y el cuerpo bloquea la aproximación interior',()=>{
  expect(blocked(BUS_BOARDING.x,BUS_BOARDING.y)).toBe(false);
  expect(atBusBoarding(BUS_BOARDING.x,BUS_BOARDING.y)).toBe(true);
  expect(atBusBoarding(1195,835)).toBe(false);
  expect(blocked(1100,850)).toBe(true);
  expect(BUS_BOARDING.maxX+30).toBeLessThanOrEqual(BUS_PLACEMENT.x);
 });
});
