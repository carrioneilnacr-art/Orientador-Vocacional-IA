import {describe,it,expect} from 'vitest';
import {keepForegroundPixel,fillForegroundPinholes} from './plazaOcclusion';
describe('Transparencia de objetos del atlas',()=>{
 it('el pavimento no cubre al jugador detrás del árbol del sur',()=>{for(const rgb of [[205,174,151],[178,151,133],[150,140,130]])expect(keepForegroundPixel('arbol-sur',...rgb as [number,number,number])).toBe(false);});
 it('conserva follaje y troncos, sin tratar la fachada amarilla como copa',()=>{expect(keepForegroundPixel('arbol-sur',80,150,35)).toBe(true);expect(keepForegroundPixel('arbol-sur',125,75,35)).toBe(true);expect(keepForegroundPixel('arbol-grande',245,170,55)).toBe(false);});
 it('el suelo dentro del recorte de una banca es transparente',()=>{expect(keepForegroundPixel('banca-oeste',205,174,151)).toBe(false);expect(keepForegroundPixel('banca-oeste',230,125,20)).toBe(true);});
 it('la estación sigue siendo opaca',()=>{expect(keepForegroundPixel('estacion',205,174,151)).toBe(true);});
 it('los tonos crema del vidrio y las luces ya no perforan los faroles',()=>{
  for(let i=0;i<7;i++)for(const rgb of [[255,249,215],[205,174,151],[120,110,95]])expect(keepForegroundPixel(`farol-poste-${i}`,...rgb as [number,number,number])).toBe(true);
 });
 it('repara agujeros internos pequeños sin rellenar el exterior ni huecos grandes',()=>{
  const w=30,pixels=new Uint8ClampedArray(w*w*4);
  for(let y=2;y<28;y++)for(let x=2;x<28;x++)pixels[(y*w+x)*4+3]=255;
  pixels[(5*w+5)*4+3]=0;
  for(let y=10;y<20;y++)for(let x=10;x<20;x++)pixels[(y*w+x)*4+3]=0;
  fillForegroundPinholes(pixels,w,w);
  expect(pixels[(5*w+5)*4+3]).toBe(255);
  expect(pixels[(15*w+15)*4+3]).toBe(0);expect(pixels[3]).toBe(0);
 });
});

import {insideForegroundShape} from './plazaOcclusion';
describe('Siluetas sin rectángulos de pavimento',()=>{
 it('los bolardos no ocultan con el margen lateral del atlas',()=>{
  expect(insideForegroundShape('farol-poste-7',1,25,24,58)).toBe(false);
  expect(insideForegroundShape('farol-poste-7',12,25,24,58)).toBe(true);
 });
 it('los faroles conservan lámparas y banderín pero no suelo junto al mástil',()=>{
  expect(insideForegroundShape('farol-poste-3',3,170,70,215)).toBe(false);
  expect(insideForegroundShape('farol-poste-3',35,170,70,215)).toBe(true);
  expect(insideForegroundShape('farol-poste-3',25,90,70,215)).toBe(true);
 });
 it('la esquina superior izquierda del paradero deja visible el pavimento',()=>{
  expect(insideForegroundShape('estacion',10,10,500,213)).toBe(false);
  expect(insideForegroundShape('estacion',300,100,500,213)).toBe(true);
 });
});
