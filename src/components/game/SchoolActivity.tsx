'use client';
import Image from 'next/image';
import {useEffect,useRef,useState} from 'react';
import {schoolRooms,type SchoolRoomId} from '@/game/colegioRooms';
import {schoolActivityNames,preferenceLabels,type SchoolEvidence} from '@/game/schoolActivities';
import {labPlans,labConclusions,reviewLabConclusion,reviewLabPlan,techObservations,techHypotheses,techRepairs,reviewTechRepair,muralAudiences,muralPalettes,muralCompositions,muralReviews,reflectionPrompts} from '@/modules/adventure/domain/schoolChallengeContent';
import s from './SchoolActivity.module.css';
export default function SchoolActivity({room,onFinish,onClose}:{room:SchoolRoomId;onFinish:(entry:SchoolEvidence)=>void;onClose:()=>void}){
 const dialog=useRef<HTMLDialogElement>(null),completed=useRef(false);
 const [stage,setStage]=useState(0),[choices,setChoices]=useState<number[]>([]),[observed,setObserved]=useState<number[]>([]),[attempts,setAttempts]=useState(0),[feedback,setFeedback]=useState(''),[solved,setSolved]=useState(false),[reflect,setReflect]=useState(false);
 const npc=schoolRooms[room].npc;
 useEffect(()=>{const previous=document.activeElement as HTMLElement|null;const el=dialog.current;el?.showModal();return()=>{el?.close();previous?.focus();};},[]);
 const palette=muralPalettes[choices[1]??0];
 function select(index:number){
  setChoices(old=>[...old.slice(0,stage),index]);setAttempts(n=>n+1);
  if(room==='laboratorio'){
   if(stage===0){setFeedback(reviewLabPlan(index).feedback);setStage(1);}
   else{const result=reviewLabConclusion(choices[0],index);setSolved(result.solved);setFeedback(result.feedback);setStage(2);}
  }else if(room==='tecnologia'){
   if(stage===0){setFeedback('Hipótesis registrada. Elige una intervención y comprueba el resultado.');setStage(1);}
   else{const result=reviewTechRepair(choices[0],index);setSolved(result.solved);setFeedback(result.feedback);setStage(2);}
  }else{setFeedback(stage===0?muralAudiences[index].brief:stage===1?muralPalettes[index].tradeoff:stage===2?muralCompositions[index].tradeoff:'Guardaste cómo pondrías a prueba tu intención. Ninguna composición define tu talento.');setStage(n=>n+1);}
 }
 const labels=room==='laboratorio'?(stage===0?labPlans.map(x=>x.label):labConclusions):room==='tecnologia'?(stage===0?techHypotheses:techRepairs):stage===0?muralAudiences.map(x=>x.label):stage===1?muralPalettes.map(x=>x.label):stage===2?muralCompositions.map(x=>x.label):muralReviews;
 const ready=room==='taller'?stage===4:stage===2;
 const prompt=room==='laboratorio'?(stage===0?'El huerto se seca. ¿Cómo investigarías el efecto de sol y sombra sin confundirlo con otras condiciones?':'Datos ficticios de esta simulación: con plantas equivalentes y el mismo riego, la tierra en sombra conservó más humedad. ¿Qué podemos concluir?'):room==='tecnologia'?(stage===0?'La feria empieza y el proyector no muestra la presentación. Examina las comprobaciones y formula una hipótesis.':'Prueba un ajuste virtual. No manipulamos equipos eléctricos reales.'):['¿A quién quieres invitar a explorar las aulas?','Elige una paleta para comunicar tu intención.','Decide cómo organizar la mirada.','¿Cómo revisarías si la invitación se entiende?'][Math.min(stage,3)];
 function finish(preference:SchoolEvidence['preference']){if(completed.current)return;completed.current=true;onFinish({version:1,chapterId:'colegio',contentVersion:'adventure-v2',activityId:room,preference,performance:{attempts,solved:room==='taller'?null:solved},choices,completedAt:new Date().toISOString()});}
 return <dialog ref={dialog} className={s.dialog} aria-label={schoolActivityNames[room]} onCancel={e=>{e.preventDefault();onClose();}} onKeyDown={e=>e.stopPropagation()}>
 <button className={s.close} aria-label="Cerrar actividad" onClick={onClose}>×</button>
 <div className={s.header}><Image src={npc.src} alt="" width={54} height={74}/><div><small>{npc.name} · {npc.role}</small><h2>{reflect?'¿Qué te gustaría seguir probando?':schoolActivityNames[room]}</h2></div></div>
 {reflect?<><p>{reflectionPrompts[room]}</p><div className={s.choices}>{(Object.entries(preferenceLabels) as [SchoolEvidence['preference'],string][]).map(([value,label])=><button key={value} onClick={()=>finish(value)}>{label}</button>)}</div></>:<>
 <p>{prompt}</p>
 {room==='tecnologia'&&<div className={s.clues}>{techObservations.map((item,index)=><button key={item.label} aria-pressed={observed.includes(index)} onClick={()=>{setObserved(old=>old.includes(index)?old:[...old,index]);setFeedback(item.text);}}>{item.label}</button>)}</div>}
 {room==='taller'&&stage>0&&<div className={s.preview}><svg viewBox="0 0 480 180" role="img" aria-label="Tu invitación y composición"><rect width="480" height="180" fill={palette.background}/>{(choices[2]??0)===0?<path d="M20 160Q180 10 460 130" fill="none" stroke={palette.accent} strokeWidth="14"/>:(choices[2]??0)===1?<circle cx="240" cy="90" r="70" fill="none" stroke={palette.accent} strokeWidth="12"/>:<g fill={palette.accent}>{[35,180,325].map(x=><rect key={x} x={x} y="20" width="115" height="140" rx="12"/>)}</g>}<rect x="40" y="64" width="400" height="48" fill={palette.background}/><text x="240" y="94" textAnchor="middle" fill={palette.foreground} fontSize="23" fontWeight="bold">{muralAudiences[choices[0]].message}</text></svg></div>}
 <p className={s.feedback} role="status">{feedback||'Puedes probar, revisar y pedir una pista. No hay cronómetro.'}</p>
 {!ready&&<div className={s.choices}>{labels.map((label,index)=><button key={label} disabled={room==='tecnologia'&&stage===0&&observed.length<3} onClick={()=>select(index)}>{label}</button>)}</div>}
 <div className={s.footer}><button onClick={()=>setFeedback(room==='laboratorio'?'Para investigar una condición, mantén las demás iguales. Una prueba no basta para generalizar.':room==='tecnologia'?'Compara la entrada seleccionada con la conectada y revisa qué cable pasó la comprobación.':'Tu intención puede cambiar con otra mirada. Prueba que el mensaje se entienda sin depender solo del color.')}>Pista de Chaski</button>{ready&&<><button onClick={()=>{setStage(0);setChoices([]);setSolved(false);setFeedback('Nueva prueba. Puedes cambiar tu enfoque.');}}>Revisar mi propuesta</button><button onClick={()=>setReflect(true)}>Contar qué me interesó</button></>}</div>
 <p className={s.help}>El resultado del reto no decide tu vocación. Puedes reflexionar aunque tu propuesta necesite ajustes.</p></>}
 </dialog>;
}
