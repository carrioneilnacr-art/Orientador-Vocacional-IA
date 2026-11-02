import {describe,it,expect,vi,afterEach} from 'vitest';
import {createCanvas,loadImage} from '@napi-rs/canvas';
import {cleanChaskiPixels} from './chaskiSpritePixels';
import {drawChaski} from './chaskiAvatar';

afterEach(()=>vi.unstubAllGlobals());
describe('Chaski: contornos y reposo',()=>{
 it('elimina residuos desconectados y alpha tenue conservando el cuerpo opaco',()=>{
  const pixels=new Uint8ClampedArray(20*20*4);
  for(let y=4;y<16;y++)for(let x=5;x<15;x++)pixels[(y*20+x)*4+3]=255;
  pixels[3]=255;pixels[7]=255;pixels[(10*20+4)*4+3]=64;
  cleanChaskiPixels(pixels,20,20);
  expect(pixels[3]).toBe(0);expect(pixels[7]).toBe(0);
  expect(pixels[(10*20+4)*4+3]).toBe(0);
  expect(pixels[(10*20+10)*4+3]).toBe(255);
 });
 it('dibuja poses reales en cuatro direcciones con los pies anclados',async()=>{
  vi.stubGlobal('document',{createElement:()=>createCanvas(1,1)});
  const base='public/game/plaza-lima/base/';
  const [front,back,side,idle]=await Promise.all(['chaski-frente.png','chaski-espalda.png','chaski-camina.png','chaski-reposo-v2.png'].map(name=>loadImage(base+name)));
  const sheets={front,back,side,idle} as unknown as Parameters<typeof drawChaski>[1];
  for(const face of [0,1,2,3] as const){
   const canvas=createCanvas(200,160),ctx=canvas.getContext('2d');
   const width=drawChaski(ctx as unknown as CanvasRenderingContext2D,sheets,100,130,face,false,3,0);
   expect(width).toBeGreaterThan(40);expect(width).toBeLessThan(100);
   const pixels=ctx.getImageData(0,0,200,160).data;
   let above=0;for(let y=20;y<125;y++)for(let x=40;x<160;x++)if(pixels[(y*200+x)*4+3]===255)above++;
   expect(above).toBeGreaterThan(2000);
   // The breathing pose does not move any shoe pixels below the support point.
   for(let y=131;y<160;y++)for(let x=40;x<160;x++)expect(pixels[(y*200+x)*4+3]).toBeLessThan(200);
  }
 });
});
