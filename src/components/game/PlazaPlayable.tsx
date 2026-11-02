'use client';
import {useEffect,useRef,useState} from 'react';
import {solids,movePlayer,BUS_PLACEMENT,BUS_BOARDING,atBusBoarding} from '@/game/plazaPhysics';
import s from './PlazaPlayable.module.css';
import {keepForegroundPixel,insideForegroundShape,fillForegroundPinholes} from '@/game/plazaOcclusion';
import {CHASKI_ACCELERATION,CHASKI_SPEED,drawChaski,loadChaskiSheets,type ChaskiFacing} from '@/game/chaskiAvatar';
import {rpgNpcs,nearestRpgNpc,npcCrop,allPlazaNpcsCompleted,type RpgNpcId} from '@/game/plazaRpgNpcs';
import {createNpcRenderer} from './PlazaNpcRenderer';

export default function PlazaPlayable({paused=false,reducedMotion=false,onTalk,onBoard,activeNpc=null,completedNpcs=[]}:{paused?:boolean;reducedMotion?:boolean;onTalk?:(id:RpgNpcId)=>void;onBoard?:()=>void;activeNpc?:RpgNpcId|null;completedNpcs?:readonly RpgNpcId[]}){
 const canvas=useRef<HTMLCanvasElement>(null),keys=useRef(new Set<string>());
 const [near,setNear]=useState<RpgNpcId|null>(null),nearRef=useRef<RpgNpcId|null>(null);
 const [atStop,setAtStop]=useState(false),stopRef=useRef(false);
 const settings=useRef({paused,reducedMotion,activeNpc,completedNpcs});
 useEffect(()=>{settings.current={paused,reducedMotion,activeNpc,completedNpcs};if(paused)keys.current.clear();},[paused,reducedMotion,activeNpc,completedNpcs]);
 useEffect(()=>{
  const c=canvas.current;if(!c)return;const screen=c.getContext('2d');if(!screen)return;
  c.parentElement?.focus({preventScroll:true});
  const scene=document.createElement('canvas');scene.width=1671;scene.height=941;const ctx=scene.getContext('2d');if(!ctx)return;
  const npcs=createNpcRenderer();
  const cutouts=new Map<string,HTMLCanvasElement>();
  const art=new window.Image();art.onload=()=>{for(const o of solids){if(!o.canopy)continue;const [x,y,w,h]=o.canopy;const layer=document.createElement('canvas');layer.width=w;layer.height=h;const lc=layer.getContext('2d');if(!lc)continue;lc.drawImage(art,x,y,w,h,0,0,w,h);const pixels=lc.getImageData(0,0,w,h);for(let i=0;i<pixels.data.length;i+=4){if(!insideForegroundShape(o.id,(i/4)%w,Math.floor(i/4/w),w,h)||!keepForegroundPixel(o.id,pixels.data[i],pixels.data[i+1],pixels.data[i+2]))pixels.data[i+3]=0;}fillForegroundPinholes(pixels.data,w,h);lc.putImageData(pixels,0,0);cutouts.set(o.id,layer);}};art.src='/game/plaza-lima/base/plaza-sin-bus.png';
  const bus=new window.Image();bus.src='/game/plaza-lima/base/bus-pista.png';
  const sheets=loadChaskiSheets();
  let frame=0,last=0,phase=0,vx=0,vy=0;const p={x:850,y:749};let face:ChaskiFacing=0;
  const clear=()=>keys.current.clear();window.addEventListener('blur',clear);
  const draw=(now:number)=>{
   const dt=Math.min((now-(last||now))/1000,.035);last=now;
   const k=keys.current;let x=Number(k.has('d')||k.has('arrowright'))-Number(k.has('a')||k.has('arrowleft')),y=Number(k.has('s')||k.has('arrowdown'))-Number(k.has('w')||k.has('arrowup'));
   if(settings.current.paused){x=0;y=0;vx=0;vy=0;}
   const len=Math.hypot(x,y);if(len){x/=len;y/=len;face=Math.abs(x)>Math.abs(y)?x<0?1:2:y<0?3:0;}
   const blend=1-Math.exp(-CHASKI_ACCELERATION*dt);vx+=(x*CHASKI_SPEED-vx)*blend;vy+=(y*CHASKI_SPEED-vy)*blend;
   const oldX=p.x,oldY=p.y;movePlayer(p,vx*dt,vy*dt);const moving=Math.hypot(p.x-oldX,p.y-oldY)>.1;if(moving)phase+=dt*11;
   const nearest=settings.current.activeNpc??(settings.current.paused?null:nearestRpgNpc(p.x,p.y));
   if(nearest!==nearRef.current){nearRef.current=nearest;setNear(nearest);}
   const stop=!settings.current.paused&&atBusBoarding(p.x,p.y);
   if(stop!==stopRef.current){stopRef.current=stop;setAtStop(stop);}
   const w=c.clientWidth,h=c.clientHeight,dpr=Math.min(window.devicePixelRatio||1,2);if(c.width!==Math.round(w*dpr)||c.height!==Math.round(h*dpr)){c.width=Math.round(w*dpr);c.height=Math.round(h*dpr);}
   screen.setTransform(dpr,0,0,dpr,0,0);screen.fillStyle='#182430';screen.fillRect(0,0,w,h);
   ctx.clearRect(0,0,1671,941);
   const scale=Math.min(w/1671,h/941),ox=(w-1671*scale)/2,oy=(h-941*scale)/2;ctx.imageSmoothingEnabled=false;
   if(art.complete&&art.naturalWidth)ctx.drawImage(art,0,0,1671,941);
   const drawBus=()=>{if(bus.complete&&bus.naturalWidth)ctx.drawImage(bus,28,137,2116,482,BUS_PLACEMENT.x,BUS_PLACEMENT.y,BUS_PLACEMENT.width,BUS_PLACEMENT.height);};
   // The base art already contains every static object. Restore foreground pixels
   // only where a character actually overlaps an object behind which they walk.
   const occludeCharacter=(cx:number,feet:number,width:number,height:number)=>{
    const left=cx-width/2,top=feet-height;
    for(const o of solids){if(!o.canopy||o.depth===undefined||o.depth<=feet)continue;
     const [x,y,w,h]=o.canopy;
     if(left>=x+w||left+width<=x||top>=y+h||feet<=y)continue;
     const cutout=cutouts.get(o.id);if(!cutout)continue;
     ctx.save();ctx.beginPath();ctx.rect(left,top,width,height);ctx.clip();ctx.beginPath();
     if(o.id.startsWith('arbol')||o.id==='jacaranda'||o.id==='palmera'){ctx.ellipse(x+w/2,y+h*.32,w*.48,h*.32,0,0,Math.PI*2);ctx.rect(o.x-o.rx,y+h*.45,o.rx*2,y+h-(y+h*.45));}
     else if(o.id==='fuente'){
      const outline=[[843,363],[866,363],[879,400],[899,413],[906,444],[887,454],[892,469],[933,481],[942,499],[921,514],[963,474],[1047,500],[1095,545],[1085,595],[1020,627],[704,627],[623,596],[613,553],[633,519],[664,492],[745,474],[785,506],[770,490],[778,477],[819,465],[821,452],[799,442],[804,419],[833,405]];
      ctx.moveTo(outline[0][0],outline[0][1]);for(const v of outline.slice(1))ctx.lineTo(v[0],v[1]);ctx.closePath();
     }
     else if(o.id.startsWith('banca'))ctx.rect(x+4,y+12,w-8,h-15);
     else if(o.id==='cuadros')ctx.rect(x+8,y+4,w-16,h-6);
     else if(o.id==='puesto')ctx.rect(x+8,y+2,w-16,h-4);
     else if(o.id==='busto')ctx.rect(x+15,y+9,w-30,h-12);
     else ctx.rect(x,y,w,h);
     ctx.clip();ctx.drawImage(cutout,x,y,w,h);ctx.restore();
    }
   };
   const layers:{depth:number;draw:()=>void}[]=[{depth:BUS_PLACEMENT.foot,draw:drawBus}];
   layers.push({depth:p.y,draw:()=>{
   const width=drawChaski(ctx,sheets,p.x,p.y,face,moving,phase,now);
   occludeCharacter(p.x,p.y,width,102);
   }});
   for(const npc of rpgNpcs)layers.push({depth:npc.y,draw:()=>{npcs.draw(ctx,0,true,nearest,now,settings.current.reducedMotion,npc.id);const [, ,sw,sh]=npcCrop(npc.id);occludeCharacter(npc.x,npc.y,npc.height*sw/sh,npc.height+2);}});
   for(const layer of layers.sort((a,b)=>a.depth-b.depth))layer.draw();
   // A small pavement marker identifies the visible approach beside the bus.
   ctx.save();ctx.strokeStyle=allPlazaNpcsCompleted(settings.current.completedNpcs)?'#ffdb82':'#d6c5a0';ctx.lineWidth=3;
   ctx.beginPath();ctx.ellipse(BUS_BOARDING.x,BUS_BOARDING.y,18,7,0,0,Math.PI*2);ctx.stroke();ctx.restore();
   if(!settings.current.reducedMotion){
    // A few moving water highlights stay inside the fountain basin.
    ctx.save();ctx.beginPath();ctx.ellipse(854,552,113,33,0,0,Math.PI*2);ctx.clip();
    ctx.strokeStyle='#d9faffb8';ctx.lineWidth=2;
    for(let i=0;i<3;i++){const radius=10+((now*.016+i*31)%86);ctx.beginPath();ctx.ellipse(854,552,radius,radius*.27,0,0,Math.PI*2);ctx.stroke();}
    ctx.restore();
   }
   if(!settings.current.activeNpc)npcs.indicators(ctx,nearest,now,settings.current.reducedMotion,settings.current.completedNpcs);
   screen.imageSmoothingEnabled=false;screen.drawImage(scene,ox,oy,1671*scale,941*scale);
   frame=requestAnimationFrame(draw);
  };frame=requestAnimationFrame(draw);return()=>{cancelAnimationFrame(frame);window.removeEventListener('blur',clear);};
 },[]);
 return <div className={s.world} tabIndex={0} aria-label="Plaza jugable. WASD o flechas para caminar. Acércate a un personaje y pulsa E para hablar." onPointerDown={e=>{if(!(e.target as Element).closest('button'))e.currentTarget.focus();}} onKeyDown={e=>{const key=e.key.toLowerCase();if(key==='e'&&!e.repeat&&!paused){if(near){e.preventDefault();e.stopPropagation();keys.current.clear();onTalk?.(near);return;}if(atStop){e.preventDefault();e.stopPropagation();keys.current.clear();if(allPlazaNpcsCompleted(completedNpcs))onBoard?.();return;}}if(paused)return;if(['w','a','s','d','arrowup','arrowdown','arrowleft','arrowright'].includes(key)){e.preventDefault();keys.current.add(key);}}} onKeyUp={e=>keys.current.delete(e.key.toLowerCase())} onBlur={()=>keys.current.clear()}>
  <canvas ref={canvas} className={s.canvas}/>
  <span className={s.srOnly} role="status">{near?'NPC cercano: '+near+'. E Hablar.':''}</span>
  {atStop&&!near&&!paused&&<div className={s.metroPrompt}>{allPlazaNpcsCompleted(completedNpcs)?<button onClick={()=>{if(allPlazaNpcsCompleted(completedNpcs))onBoard?.();}}>E · Subir al Metropolitano</button>:<span>Aún me falta hablar con todos los personajes ({rpgNpcs.filter(npc=>completedNpcs.includes(npc.id)).length}/5).</span>}</div>}
  <div className={s.tools}><span>WASD / Flechas · Mover</span></div>
  <div className={s.pad}>{[['↑','arrowup'],['←','arrowleft'],['↓','arrowdown'],['→','arrowright']].map(([label,key])=><button key={key} aria-label={`Mover ${label}`} onPointerDown={e=>{e.currentTarget.setPointerCapture(e.pointerId);keys.current.add(key);}} onPointerUp={()=>keys.current.delete(key)} onPointerCancel={()=>keys.current.delete(key)}>{label}</button>)}</div>
 </div>;
}
