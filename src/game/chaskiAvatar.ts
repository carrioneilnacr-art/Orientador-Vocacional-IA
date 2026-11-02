import frontFrames from './chaskiFrontFrames.json';
import backFrames from './chaskiBackFrames.json';
import walkFrames from './chaskiWalkFrames.json';
import {cleanChaskiPixels} from './chaskiSpritePixels';

export type ChaskiFacing = 0 | 1 | 2 | 3;
export const CHASKI_SPEED = 210;
export const CHASKI_ACCELERATION = 20;
export const CHASKI_HEIGHT = 100;

export function loadChaskiSheets(): Record<'front'|'back'|'side'|'idle',HTMLImageElement> {
 const image=(src:string)=>{const result=new Image();result.src=src;return result;};
 return {
  front:image('/game/plaza-lima/base/chaski-frente.png'),
  back:image('/game/plaza-lima/base/chaski-espalda.png'),
  side:image('/game/plaza-lima/base/chaski-camina.png'),
  idle:image('/game/plaza-lima/base/chaski-reposo-v2.png'),
 };
}

const prepared=new WeakMap<HTMLImageElement,Map<string,HTMLCanvasElement>>();
function cleanFrame(sheet:HTMLImageElement,frame:readonly number[]):HTMLCanvasElement {
 let cache=prepared.get(sheet);if(!cache){cache=new Map();prepared.set(sheet,cache);}
 const key=frame.join(',');const existing=cache.get(key);if(existing)return existing;
 const canvas=document.createElement('canvas');canvas.width=frame[2];canvas.height=frame[3];
 const ctx=canvas.getContext('2d');if(ctx){
  ctx.drawImage(sheet,frame[0],frame[1],frame[2],frame[3],0,0,frame[2],frame[3]);
  const pixels=ctx.getImageData(0,0,canvas.width,canvas.height);cleanChaskiPixels(pixels.data,canvas.width,canvas.height);ctx.putImageData(pixels,0,0);
 }
 cache.set(key,canvas);return canvas;
}

const idleFrames=new WeakMap<HTMLImageElement,number[][]>();
function getIdleFrames(sheet:HTMLImageElement):number[][] {
 const cached=idleFrames.get(sheet);if(cached)return cached;
 // Detect the actual transparent gutters; generated poses need not be cell-centered.
 const probe=document.createElement('canvas');probe.width=sheet.naturalWidth;probe.height=sheet.naturalHeight;
 const pc=probe.getContext('2d');const ranges:number[][]=[];
 if(pc){pc.drawImage(sheet,0,0);const data=pc.getImageData(0,0,probe.width,probe.height).data;let start=-1;
  for(let x=0;x<=probe.width;x++){let occupied=0;
   if(x<probe.width)for(let y=0;y<probe.height;y++)if(data[(y*probe.width+x)*4+3]>=128)occupied++;
   if(occupied>4&&start<0)start=x;
   if(occupied<=4&&start>=0){if(x-start>80)ranges.push([start,x]);start=-1;}
  }
 }
 const frames:number[][]=[];
 for(let cell=0;cell<3;cell++){
  const [left,right]=ranges.length===3?ranges[cell]:[Math.round(cell*sheet.naturalWidth/3),Math.round((cell+1)*sheet.naturalWidth/3)];
  const full=cleanFrame(sheet,[left,0,right-left,sheet.naturalHeight]);const ctx=full.getContext('2d');
  let minX=full.width,minY=full.height,maxX=0,maxY=0;
  if(ctx){const pixels=ctx.getImageData(0,0,full.width,full.height).data;
   for(let y=0;y<full.height;y++)for(let x=0;x<full.width;x++)if(pixels[(y*full.width+x)*4+3]){minX=Math.min(minX,x);maxX=Math.max(maxX,x);minY=Math.min(minY,y);maxY=Math.max(maxY,y);}
  }
  frames.push([left+minX,minY,Math.max(1,maxX-minX+1),Math.max(1,maxY-minY+1)]);
 }
 idleFrames.set(sheet,frames);return frames;
}

export function drawChaski(ctx:CanvasRenderingContext2D,sheets:ReturnType<typeof loadChaskiSheets>,x:number,y:number,face:ChaskiFacing,moving:boolean,phase:number,time:number):number {
 const frames=face===0?frontFrames:face===3?backFrames:walkFrames;
 const idle=!moving&&sheets.idle.complete&&sheets.idle.naturalWidth>0;
 const sheet=idle?sheets.idle:face===0?sheets.front:face===3?sheets.back:sheets.side;
 const f=idle?getIdleFrames(sheet)[face===0?0:face===3?2:1]:frames[Math.floor(phase)%8];
 const scale=CHASKI_HEIGHT/(idle?f[3]:Math.max(...frames.map(frame=>frame[3])));
 const width=f[2]*scale,height=f[3]*scale;
 ctx.save();ctx.translate(Math.round(x),Math.round(y));
 ctx.fillStyle='#17283e66';ctx.beginPath();ctx.ellipse(0,-1,17,5,0,0,Math.PI*2);ctx.fill();
 if(face===1)ctx.scale(-1,1);
 // Breathing changes the upper silhouette by less than a pixel; soles stay on the floor.
 const breath=idle?Math.sin(time/800)*.45:0;
 ctx.imageSmoothingEnabled=false;
 if(sheet.complete&&sheet.naturalWidth)ctx.drawImage(cleanFrame(sheet,f),-width/2,-height-breath,width,height+breath);
 ctx.restore();return width;
}
