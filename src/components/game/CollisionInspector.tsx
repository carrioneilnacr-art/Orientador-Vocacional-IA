'use client';
import {useEffect,useState} from 'react';
import type {PatioSolid} from '@/game/colegioPatio';
import styles from './CollisionInspector.module.css';

export function drawCollisionOverlay(ctx:CanvasRenderingContext2D,objects:readonly PatioSolid[],selected:string){
 for(const object of objects){
  ctx.save();ctx.strokeStyle=object.id===selected?'#fff38c':'#50f4cf';ctx.fillStyle=object.id===selected?'#ffdc4455':'#35ddc333';ctx.lineWidth=3;
  ctx.beginPath();if(object.ellipse)ctx.ellipse(object.x,object.y,object.rx,object.ry,0,0,Math.PI*2);else ctx.rect(object.x-object.rx,object.y-object.ry,object.rx*2,object.ry*2);ctx.fill();ctx.stroke();
  if(object.id===selected){
   ctx.font='18px system-ui';ctx.textAlign='left';ctx.fillStyle='#071d2f';ctx.fillRect(object.x-object.rx,object.y-object.ry-24,ctx.measureText(object.id).width+12,24);ctx.fillStyle='#ffffff';ctx.fillText(object.id,object.x-object.rx+5,object.y-object.ry-5);
  }
  ctx.restore();
 }
}

export default function CollisionInspector({zone,revision,initial,onChange}:{zone:string;revision?:string;initial:readonly PatioSolid[];onChange:(objects:PatioSolid[],visible:boolean,selected:string)=>void}){
 const storageKey=`chaski-colliders-${zone}${revision?`-${revision}`:''}`;
 const [objects,setObjects]=useState(()=>initial.map(object=>({...object}))),[visible,setVisible]=useState(false),[selected,setSelected]=useState(initial[0]?.id??''),[report,setReport]=useState('');
 useEffect(()=>{
  try{
   const saved=JSON.parse(localStorage.getItem(storageKey)??'null');
   if(!Array.isArray(saved))return;
   setObjects(initial.map(base=>{
    const prior=saved.find(o=>o?.id===base.id);
    if(!prior||![prior.x,prior.y,prior.rx,prior.ry].every(Number.isFinite)||prior.rx<=0||prior.ry<=0)return {...base};
    return {...base,x:prior.x,y:prior.y,rx:prior.rx,ry:prior.ry};
   }));
  }catch{/* The default map is usable without local storage. */}
 },[initial,storageKey]);
 useEffect(()=>{onChange(objects,visible,selected);},[objects,visible,selected,onChange]);
 const object=objects.find(item=>item.id===selected);
 const change=(field:'x'|'y'|'rx'|'ry',value:number)=>{if(!Number.isFinite(value))return;setObjects(old=>old.map(item=>item.id===selected?{...item,[field]:field==='rx'||field==='ry'?Math.max(1,value):value}:item));};
 return <aside className={styles.inspector} onKeyDown={event=>event.stopPropagation()} onPointerDown={event=>event.stopPropagation()}>
  <button onClick={()=>setVisible(value=>!value)}>{visible?'Cerrar objetos':'Objetos y colisiones'}</button>
  {visible&&<div className={styles.panel}><strong>Objetos de {zone}</strong><p>Verde = zona sólida. Selecciona un objeto y ajusta su tamaño o posición.</p><select aria-label="Objeto reconocido" value={selected} onChange={event=>setSelected(event.target.value)}>{objects.map(item=><option key={item.id}>{item.id}</option>)}</select>
  {object&&<div className={styles.fields}>{(['x','y','rx','ry'] as const).map(field=><label key={field}>{({x:'Posición X',y:'Posición Y',rx:'Semiancho',ry:'Semialto'})[field]}<input type="number" value={object[field]} onChange={event=>change(field,Number(event.target.value))}/></label>)}</div>}
  <button onClick={()=>{localStorage.setItem(storageKey,JSON.stringify(objects));setReport('Ajustes guardados en este navegador.');}}>Guardar ajustes</button><button onClick={()=>{setObjects(initial.map(item=>({...item})));localStorage.removeItem(storageKey);}}>Restablecer</button>
  <button onClick={()=>setReport(JSON.stringify({zone,objects},null,2))}>Mostrar datos para compartir</button><textarea aria-label="Datos para compartir con Codex" readOnly value={report}/><small>Puedes decirme «aumenta el semiancho de banca-frente-der en 10» o copiar estos datos.</small></div>}
 </aside>;
}
