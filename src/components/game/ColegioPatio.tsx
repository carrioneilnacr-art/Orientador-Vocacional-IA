'use client';
import {useCallback,useEffect,useRef,useState} from 'react';
import {CHASKI_ACCELERATION,CHASKI_SPEED,drawChaski,loadChaskiSheets,type ChaskiFacing} from '@/game/chaskiAvatar';
import {COLEGIO_WIDTH,COLEGIO_HEIGHT,movePatioPlayer,moveUpperPlayer,sofiaFeet,upperSolids,schoolStairPath,stairLength,stairPosition,patioSolids,type PatioSolid} from '@/game/colegioPatio';
import {schoolDoors,schoolCharacters,type SchoolRoomId} from '@/game/colegioRooms';
import ColegioRoom from './ColegioRoom';
import CollisionInspector,{drawCollisionOverlay} from './CollisionInspector';
import type {SchoolEvidence} from '@/game/schoolActivities';
import PlazaRpgDialogue from './PlazaRpgDialogue';
import s from './PlazaPlayable.module.css';
import {CURRENT_NARRATIVE_VERSION,getSchoolDialogue} from '@/modules/adventure/domain/narrativeContent';
import type {SchoolContentVersions} from '@/game/adventureJourney';
import {patioForeground,tracePatioForeground,patioForegroundBounds} from '@/game/colegioOcclusion';


export default function ColegioPatio({paused=false,reducedMotion=false,onActivity,answers={},contentVersions={},onAnswer,onRoomChange}:{paused?:boolean;reducedMotion?:boolean;onActivity:(entry:SchoolEvidence)=>void;answers?:Partial<Record<'elena'|'sofia',number>>;contentVersions?:SchoolContentVersions;onAnswer?:(id:'elena'|'sofia',choice:number)=>void;onRoomChange?:(room:SchoolRoomId|null)=>void}){
 const [talking,setTalking]=useState(false),[level,setLevel]=useState('Patio');
 const [room,setRoom]=useState<SchoolRoomId|null>(null),[speaker,setSpeaker]=useState<'elena'|'sofia'>('elena');
 useEffect(()=>{onRoomChange?.(room);},[room,onRoomChange]);
 const roomOpen=useRef(false);
 const door=useRef<SchoolRoomId|null>(null),upstairs=useRef(false);
 const collisionState=useRef<{objects:readonly PatioSolid[];visible:boolean;selected:string}>({objects:patioSolids,visible:false,selected:''});
 const inspect=useCallback((objects:PatioSolid[],visible:boolean,selected:string)=>{collisionState.current={objects,visible,selected};},[]);
 const nearNpc=useRef(false);
 const canvas=useRef<HTMLCanvasElement>(null),keys=useRef(new Set<string>()),settings=useRef({paused:paused||talking,reducedMotion});
 useEffect(()=>{roomOpen.current=!!room;settings.current={paused:paused||talking||!!room,reducedMotion};if(paused||talking||room)keys.current.clear();},[paused,reducedMotion,talking,room]);
 useEffect(()=>{
  const c=canvas.current,screen=c?.getContext('2d');if(!c||!screen)return;
  c.parentElement?.focus({preventScroll:true});
  const scene=document.createElement('canvas');scene.width=COLEGIO_WIDTH;scene.height=COLEGIO_HEIGHT;const ctx=scene.getContext('2d');if(!ctx)return;
  const art=new Image(),cutouts=new Map<string,HTMLCanvasElement>();
  art.onload=()=>{for(const object of patioForeground){const [x,y,w,h]=patioForegroundBounds(object);const layer=document.createElement('canvas');layer.width=w;layer.height=h;const lc=layer.getContext('2d');if(!lc)continue;
   lc.translate(-x,-y);tracePatioForeground(lc,object);lc.clip();lc.drawImage(art,0,0);cutouts.set(object.id,layer);
  }};
  art.src='/game/colegio/patio-referencia.webp';
  const sheets=loadChaskiSheets();const p={x:835,y:747};let face:ChaskiFacing=0,phase=0,vx=0,vy=0,last=0,lastPaint=0,frame=0;
  const npcImage=new Image();npcImage.src=schoolCharacters.elena.src;
  const sofiaImage=new Image();sofiaImage.src=schoolCharacters.sofia.src;
  let floor:'patio'|'stairs'|'upper'='patio',stairDistance=0,approachingStairs=false;
  const clear=()=>keys.current.clear();window.addEventListener('blur',clear);
  const render=(time:number)=>{
   if(document.hidden||roomOpen.current||(settings.current.paused&&time-lastPaint<100)){last=time;frame=requestAnimationFrame(render);return;}
   lastPaint=time;
   const dt=Math.min((time-(last||time))/1000,.035);last=time;
   let dx=Number(keys.current.has('d')||keys.current.has('arrowright'))-Number(keys.current.has('a')||keys.current.has('arrowleft'));
   let dy=Number(keys.current.has('s')||keys.current.has('arrowdown'))-Number(keys.current.has('w')||keys.current.has('arrowup'));
   if(settings.current.paused){dx=0;dy=0;vx=0;vy=0;}
   const length=Math.hypot(dx,dy);if(length){dx/=length;dy/=length;face=Math.abs(dx)>Math.abs(dy)?dx<0?1:2:dy<0?3:0;}
   const blend=1-Math.exp(-CHASKI_ACCELERATION*dt);vx+=(dx*CHASKI_SPEED-vx)*blend;vy+=(dy*CHASKI_SPEED-vy)*blend;
   const oldX=p.x,oldY=p.y;
   if(floor==='patio'){
    movePatioPlayer(p,vx*dt,vy*dt,collisionState.current.objects);
    if(dy<0&&Math.hypot(p.x-schoolStairPath[0].x,p.y-schoolStairPath[0].y)<42){floor='stairs';stairDistance=0;approachingStairs=true;setLevel('Escalera · ↑ subir / ↓ bajar');vx=0;vy=0;}
   }else if(floor==='stairs'){
    if(approachingStairs){
     const target=schoolStairPath[0],distance=Math.hypot(target.x-p.x,target.y-p.y),fraction=distance?Math.min(1,155*dt/distance):1;
     if(!settings.current.paused){p.x+=(target.x-p.x)*fraction;p.y+=(target.y-p.y)*fraction;if(fraction===1)approachingStairs=false;}
    }else if(!settings.current.paused){
    stairDistance=Math.max(0,Math.min(stairLength,stairDistance-dy*155*dt));
    Object.assign(p,stairPosition(stairDistance));if(dy)face=dy<0?3:0;
    if(stairDistance===stairLength&&dy<0){floor='upper';setLevel('Segundo piso');}
    if(stairDistance===0&&dy>0){floor='patio';p.y+=6;setLevel('Patio');}
    }
   }else{
    moveUpperPlayer(p,vx*dt,vy*dt);
    if(p.x>1300&&dy>0){floor='stairs';stairDistance=stairLength;setLevel('Escalera · ↑ subir / ↓ bajar');vx=0;vy=0;}
   }
   const moving=Math.hypot(p.x-oldX,p.y-oldY)>.1;if(moving)phase+=dt*11;
   upstairs.current=floor==='upper';
   const elena=collisionState.current.objects.find(object=>object.id==='npc-entrada')!;
   nearNpc.current=floor==='patio'?Math.hypot(p.x-elena.x,p.y-elena.y)<108:floor==='upper'&&Math.hypot(p.x-sofiaFeet.x,p.y-sofiaFeet.y)<85;
   door.current=floor==='upper'?schoolDoors.find(entry=>Math.abs(entry.x-p.x)<65)?.room??null:null;
   ctx.clearRect(0,0,COLEGIO_WIDTH,COLEGIO_HEIGHT);ctx.imageSmoothingEnabled=false;
   if(art.complete&&art.naturalWidth)ctx.drawImage(art,0,0);
   const drawNpc=()=>{if(!npcImage.complete||!npcImage.naturalWidth)return;const [sx,sy,sw,sh]=schoolCharacters.elena.crop;const height=120,width=height*sw/sh;
    ctx.save();if(nearNpc.current&&floor==='patio'){ctx.shadowColor='#ffe7a1';ctx.shadowBlur=8;}ctx.drawImage(npcImage,sx,sy,sw,sh,elena.x-width/2,elena.y-height,width,height);ctx.restore();
   };
   const drawSofia=()=>{if(!sofiaImage.complete||!sofiaImage.naturalWidth)return;const [sx,sy,sw,sh]=schoolCharacters.sofia.crop;const height=120,width=height*sw/sh;ctx.drawImage(sofiaImage,sx,sy,sw,sh,sofiaFeet.x-width/2,sofiaFeet.y-height,width,height);};
   if(floor!=='upper'||p.y>=sofiaFeet.y)drawSofia();
   if(p.y>=elena.y||floor!=='patio')drawNpc();
   const stepLift=floor==='stairs'&&moving&&!settings.current.reducedMotion?Math.abs(Math.sin(phase*Math.PI/4))*2:0;
   const playerWidth=drawChaski(ctx,sheets,p.x,p.y-stepLift,face,moving,phase,time);
   if(p.y<elena.y&&floor==='patio')drawNpc();
   if(floor==='upper'&&p.y<sofiaFeet.y)drawSofia();
   // Restore only real foreground pixels intersecting Chaski. The full reference
   // image is never repainted over broad atlas regions during movement.
   for(const object of floor==='patio'?patioForeground:[]){if(p.y>=object.foot)continue;
    const layer=cutouts.get(object.id);if(!layer)continue;
    // Copy the same integer atlas pixels, without a fractional character-sized
    // clip edge. Alpha belongs only to the object's silhouette.
    const [x,y]=patioForegroundBounds(object);ctx.drawImage(layer,x,y);
   }
   if(floor==='upper'&&art.complete){
    ctx.save();ctx.beginPath();ctx.rect(p.x-playerWidth/2,p.y-102,playerWidth,102);ctx.rect(sofiaFeet.x-40,sofiaFeet.y-120,80,120);ctx.clip();ctx.beginPath();
    ctx.rect(340,285,980,10);ctx.rect(340,328,980,9);
    for(let x=345;x<1320;x+=26)ctx.rect(x,295,7,33);
    ctx.clip();ctx.drawImage(art,0,0);ctx.restore();
   }
   ctx.textAlign='center';
   if(nearNpc.current&&!settings.current.paused){
    const x=floor==='upper'?sofiaFeet.x:elena.x,y=floor==='upper'?sofiaFeet.y-148:elena.y-148;
    ctx.fillStyle='#132c40ef';ctx.beginPath();ctx.roundRect(x-58,y-15,116,30,8);ctx.fill();
    ctx.fillStyle='#ffe7ad';ctx.font='bold 17px system-ui';ctx.fillText('E · Hablar',x,y+6);
   }
   for(const entry of schoolDoors){ctx.fillStyle='#132c40ed';ctx.fillRect(entry.x-85,190,170,26);ctx.fillStyle='#ffdfa0';ctx.font='16px system-ui';ctx.fillText(entry.label,entry.x,209);}
   if(door.current){ctx.fillStyle='#173448';ctx.fillRect(p.x-100,350,200,35);ctx.fillStyle='#ffe6a8';ctx.font='bold 19px system-ui';ctx.fillText('E · Entrar',p.x,375);}
   if(collisionState.current.visible){
    drawCollisionOverlay(ctx,collisionState.current.objects,collisionState.current.selected);
    if(floor==='upper')drawCollisionOverlay(ctx,upperSolids,collisionState.current.selected);
    ctx.strokeStyle='#e595ef';ctx.lineWidth=2;for(const object of patioForeground){tracePatioForeground(ctx,object);ctx.stroke();}
   }
   const width=c.clientWidth,height=c.clientHeight,dpr=Math.min(window.devicePixelRatio||1,2);
   if(c.width!==Math.round(width*dpr)||c.height!==Math.round(height*dpr)){c.width=Math.round(width*dpr);c.height=Math.round(height*dpr);}
   screen.setTransform(dpr,0,0,dpr,0,0);screen.fillStyle='#182430';screen.fillRect(0,0,width,height);screen.imageSmoothingEnabled=false;
   const scale=Math.min(width/COLEGIO_WIDTH,height/COLEGIO_HEIGHT);screen.drawImage(scene,(width-COLEGIO_WIDTH*scale)/2,(height-COLEGIO_HEIGHT*scale)/2,COLEGIO_WIDTH*scale,COLEGIO_HEIGHT*scale);
   frame=requestAnimationFrame(render);
  };
  frame=requestAnimationFrame(render);return()=>{cancelAnimationFrame(frame);window.removeEventListener('blur',clear);};
 },[]);
 return <><div style={room?{visibility:'hidden',pointerEvents:'none'}:undefined} className={s.world} tabIndex={room?-1:0} aria-label="Colegio. WASD o flechas para caminar. Sube por la escalera derecha y pulsa E en las puertas." onPointerDown={event=>{if(!talking&&event.target===canvas.current)event.currentTarget.focus();}} onKeyDown={event=>{if(paused||talking||room)return;const key=event.key.toLowerCase();if(key==='e'&&!event.repeat){if(nearNpc.current){event.preventDefault();keys.current.clear();setSpeaker(upstairs.current?'sofia':'elena');setTalking(true);return;}if(door.current){event.preventDefault();keys.current.clear();setRoom(door.current);return;}}if(['w','a','s','d','arrowup','arrowdown','arrowleft','arrowright'].includes(key)){event.preventDefault();keys.current.add(key);}}} onKeyUp={event=>keys.current.delete(event.key.toLowerCase())} onBlur={()=>keys.current.clear()}>
  <canvas ref={canvas} className={s.canvas}/><div className={s.tools}><span>{level} · WASD / Flechas</span></div>
  <CollisionInspector zone="patio" revision="contornos-v2" initial={patioSolids} onChange={inspect}/>
  {talking&&<PlazaRpgDialogue key={speaker} npcId="valeria" character={schoolCharacters[speaker]} savedChoice={answers[speaker]} reducedMotion={reducedMotion} onAnswer={choice=>onAnswer?.(speaker,choice)} onClose={()=>{setTalking(false);requestAnimationFrame(()=>canvas.current?.parentElement?.focus({preventScroll:true}));}} savedMessage="Gracias por conversar. Sigue explorando el colegio." content={getSchoolDialogue(speaker,answers[speaker]===undefined?CURRENT_NARRATIVE_VERSION:contentVersions[speaker]??'legacy-v1')}/>}
  <div className={s.pad}>{[['↑','arrowup'],['←','arrowleft'],['↓','arrowdown'],['→','arrowright']].map(([label,key])=><button key={key} aria-label={`Mover ${label}`} onPointerDown={event=>{event.currentTarget.setPointerCapture(event.pointerId);keys.current.add(key);}} onPointerUp={()=>keys.current.delete(key)} onPointerCancel={()=>keys.current.delete(key)}>{label}</button>)}</div>
 </div>{room&&<ColegioRoom key={room} room={room} paused={paused} reducedMotion={reducedMotion} onActivity={onActivity} onExit={()=>{setRoom(null);requestAnimationFrame(()=>canvas.current?.parentElement?.focus());}}/>}</>;
}
