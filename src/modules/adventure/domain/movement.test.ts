import {describe,expect,it} from 'vitest';
import {moveWithCollisions} from './movement';

describe('shared movement',()=>{
 it('prevents tunneling through a thin wall even with a large displacement',()=>{
  const position={x:0,y:0};
  moveWithCollisions(position,100,0,x=>x>=20&&x<=24);
  expect(position.x).toBeLessThan(20);expect(position.y).toBe(0);
 });
 it('slides along a blocked axis while preserving the unblocked displacement',()=>{
  const position={x:0,y:0};
  moveWithCollisions(position,100,60,x=>x>=20);
  expect(position.x).toBeLessThan(20);expect(position.y).toBeCloseTo(60);
 });
 it('keeps a stationary position and allows movement backwards through free space',()=>{
  const position={x:100,y:100};
  moveWithCollisions(position,0,0,()=>false);expect(position).toEqual({x:100,y:100});
  moveWithCollisions(position,-20,-30,()=>false);expect(position.x).toBeCloseTo(80);expect(position.y).toBeCloseTo(70);
 });
});
