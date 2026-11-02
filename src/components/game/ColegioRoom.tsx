'use client';
import {useCallback,useEffect,useRef,useState} from 'react';
import {drawChaski,loadChaskiSheets,CHASKI_SPEED,CHASKI_ACCELERATION,type ChaskiFacing} from '@/game/chaskiAvatar';
import {schoolRooms,schoolRoomBlocked,roomForeground,roomFloors,roomNpcHeight,roomTalkRadius,type SchoolRoomId} from '@/game/colegioRooms';
import type {PatioSolid} from '@/game/colegioPatio';
import CollisionInspector,{drawCollisionOverlay} from './CollisionInspector';
import SchoolActivity from './SchoolActivity';
import type {SchoolEvidence} from '@/game/schoolActivities';
import s from './PlazaPlayable.module.css';

export default function ColegioRoom({room,onExit,paused,reducedMotion,onActivity}:{room:SchoolRoomId;onExit:()=>void;paused:boolean;reducedMotion:boolean;onActivity:(entry:SchoolEvidence)=>void}){
 const data=schoolRooms[room];
 const [talking,setTalking]=useState(false);
 const canvas=useRef<HTMLCanvasElement>(null),keys=useRef(new Set<string>()),near=useRef(false),atExit=useRef(true);
 const settings=useRef({paused,reducedMotion,talking});
 useEffect(()=>{settings.current={paused,reducedMotion,talking};},[paused,reducedMotion,talking]);
 const colliders=useRef<{objects:readonly PatioSolid[];visible:boolean;selected:string}>({objects:data.objects,visible:false,selected:''});
 const inspect=useCallback((objects:PatioSolid[],visible:boolean,selected:string)=>{colliders.current={objects,visible,selected};},[]);
 useEffect(()=>{
  const element=canvas.current,screen=element?.getContext('2d');if(!element||!screen)return;
  const scene=document.createElement('canvas');scene.width=1672;scene.height=941;const ctx=scene.getContext('2d');if(!ctx)return;
  const art=new Image();art.src=`/game/colegio/${room}-compacto.png`;
  const npc=new Image();npc.src=data.npc.src;const sheets=loadChaskiSheets();
  const p={x:835,y:880};let last=0,phase=0,frame=0,vx=0,vy=0,face:ChaskiFacing=3;
  const pressedKeys=keys.current;
  const clear=()=>pressedKeys.clear();window.addEventListener('blur',clear);
  const blocked=(x:number,y:number)=>schoolRoomBlocked(room,x,y,colliders.current.objects);
  const world=element.parentElement;
  world?.focus({preventScroll:true});
  const render=(time:number)=>{
   const dt=Math.min((time-(last||time))/1000,.035);last=time;
   let dx=Number(keys.current.has('d')||keys.current.has('arrowright'))-Number(keys.current.has('a')||keys.current.has('arrowleft'));
   let dy=Number(keys.current.has('s')||keys.current.has('arrowdown'))-Number(keys.current.has('w')||keys.current.has('arrowup'));
   if(settings.current.paused||settings.current.talking){dx=0;dy=0;vx=0;vy=0;}
   const length=Math.hypot(dx,dy);if(length){dx/=length;dy/=length;face=Math.abs(dx)>Math.abs(dy)?dx<0?1:2:dy<0?3:0;}
   const blend=1-Math.exp(-CHASKI_ACCELERATION*dt);vx+=(dx*CHASKI_SPEED-vx)*blend;vy+=(dy*CHASKI_SPEED-vy)*blend;
   const oldX=p.x,oldY=p.y,steps=Math.max(1,Math.ceil(Math.hypot(vx*dt,vy*dt)/4));
   for(let i=0;i<steps;i++){if(!blocked(p.x+vx*dt/steps,p.y))p.x+=vx*dt/steps;if(!blocked(p.x,p.y+vy*dt/steps))p.y+=vy*dt/steps;}
   const moving=Math.hypot(p.x-oldX,p.y-oldY)>.1;if(moving)phase+=dt*11;
   const feet=colliders.current.objects.find(object=>object.id===data.objects[0].id)??data.objects[0];
   near.current=Math.hypot(p.x-feet.x,p.y-feet.y)<roomTalkRadius;
   atExit.current=Math.abs(p.x-835)<125&&p.y>830;
   ctx.clearRect(0,0,1672,941);ctx.imageSmoothingEnabled=false;
   // Coordinates use the unwarped image plane, fitted uniformly to the logical room.
   if(art.complete&&art.naturalWidth)ctx.drawImage(art,0,0,1672,941);
   const naturalRatio=art.naturalWidth?art.naturalWidth/art.naturalHeight:2.3;
   const spriteAspect=941/(1672/naturalRatio);
   const npcHeight=roomNpcHeight*spriteAspect;
   const drawNpc=()=>{
    if(!npc.complete||!npc.naturalWidth)return;
    const [x,y,w,h]=data.npc.crop,width=roomNpcHeight*w/h;
    ctx.save();
    ctx.fillStyle='#1d273d42';ctx.beginPath();ctx.ellipse(feet.x,feet.y-1,width*.31,5,0,0,2*Math.PI);ctx.fill();
    // Breathe by stretching up from the soles, keeping both feet grounded.
    const height=npcHeight+(settings.current.reducedMotion?0:Math.sin(time/850));
    ctx.drawImage(npc,x,y,w,h,Math.round(feet.x-width/2),Math.round(feet.y-height),Math.round(width),Math.round(height));ctx.restore();
   };
   if(p.y>=feet.y)drawNpc();
   ctx.save();ctx.translate(p.x,p.y);ctx.scale(1,spriteAspect);const playerWidth=drawChaski(ctx,sheets,0,0,face,moving,phase,time);ctx.restore();
   if(art.complete&&art.naturalWidth)for(const foreground of roomForeground[room]){
    if(p.y>=foreground.depth)continue;
    ctx.save();ctx.beginPath();ctx.rect(p.x-playerWidth/2,p.y-102*spriteAspect,playerWidth,102*spriteAspect);ctx.clip();
    ctx.beginPath();const [first,...points]=foreground.outline;ctx.moveTo(first[0],first[1]);for(const point of points)ctx.lineTo(point[0],point[1]);ctx.closePath();ctx.clip();
    ctx.drawImage(art,0,0,1672,941);ctx.restore();
   }
   if(p.y<feet.y)drawNpc();
   if((near.current||atExit.current)&&!settings.current.talking){
    const label=near.current?'E · Descubrir':'E · Volver al pasillo';
    const cx=near.current?feet.x:835,cy=near.current?feet.y-npcHeight-25:908;
    ctx.save();ctx.font='600 19px system-ui';ctx.textAlign='center';ctx.textBaseline='middle';
    const width=ctx.measureText(label).width+28;
    ctx.fillStyle='#112b40ef';ctx.beginPath();ctx.roundRect(cx-width/2,cy-16,width,32,9);ctx.fill();
    ctx.fillStyle='#ffe7ad';ctx.fillText(label,cx,cy);ctx.restore();
   }
   if(colliders.current.visible){
    ctx.save();ctx.beginPath();
    roomFloors[room].forEach(([x,y],i)=>i===0?ctx.moveTo(x,y):ctx.lineTo(x,y));
    ctx.closePath();ctx.strokeStyle='#8bc7ff';ctx.lineWidth=3;ctx.stroke();
    ctx.beginPath();ctx.arc(feet.x,feet.y,roomTalkRadius,0,Math.PI*2);ctx.setLineDash([7,6]);ctx.strokeStyle='#ffcc77';ctx.stroke();ctx.restore();
    drawCollisionOverlay(ctx,colliders.current.objects,colliders.current.selected);
   }
   const width=element.clientWidth,height=element.clientHeight,dpr=Math.min(devicePixelRatio||1,2);
   if(element.width!==Math.round(width*dpr)||element.height!==Math.round(height*dpr)){element.width=Math.round(width*dpr);element.height=Math.round(height*dpr);}
   screen.setTransform(dpr,0,0,dpr,0,0);screen.fillStyle='#182430';screen.fillRect(0,0,width,height);
   const dw=Math.min(width,height*naturalRatio),dh=dw/naturalRatio;screen.imageSmoothingEnabled=false;screen.drawImage(scene,(width-dw)/2,(height-dh)/2,dw,dh);
   frame=requestAnimationFrame(render);
  };
  frame=requestAnimationFrame(render);return()=>{cancelAnimationFrame(frame);window.removeEventListener('blur',clear);pressedKeys.clear();};
 },[room,data]);
 return <div className={s.world} tabIndex={0} aria-label={data.name} onPointerDown={event=>{if(event.target===canvas.current)event.currentTarget.focus();}} onBlur={()=>keys.current.clear()} onKeyUp={event=>keys.current.delete(event.key.toLowerCase())} onKeyDown={event=>{
  if(talking||paused)return;const key=event.key.toLowerCase();
  if(key==='e'&&!event.repeat){event.preventDefault();keys.current.clear();if(near.current)setTalking(true);else if(atExit.current)onExit();return;}
  if(['w','a','s','d','arrowup','arrowdown','arrowleft','arrowright'].includes(key)){event.preventDefault();keys.current.add(key);}
 }}><canvas className={s.canvas} ref={canvas}/><div className={s.tools}><span>{data.name} · WASD / Flechas</span><button onClick={onExit}>Volver al pasillo</button></div>
 <CollisionInspector zone={`${room}-compacto`} initial={data.objects} onChange={inspect}/>
 {talking&&<SchoolActivity room={room} onClose={()=>setTalking(false)} onFinish={entry=>{onActivity(entry);setTalking(false);}}/>}
 </div>;
}
