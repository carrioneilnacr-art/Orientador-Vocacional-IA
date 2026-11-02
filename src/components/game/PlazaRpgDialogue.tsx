'use client';
import {useEffect,useRef,useState} from 'react';
import {rpgNpcs,npcCrop,type RpgNpcId} from '@/game/plazaRpgNpcs';
import {getPlazaDialogue,type NarrativeContentVersion} from '@/modules/adventure/domain/narrativeContent';
import s from './PlazaRpgDialogue.module.css';

export default function PlazaRpgDialogue({npcId,contentVersion,savedChoice,reducedMotion,onAnswer,onClose,content,savedMessage,character}:{npcId:RpgNpcId;contentVersion?:NarrativeContentVersion;savedChoice?:number;reducedMotion:boolean;onAnswer:(choice:number)=>void;onClose:()=>void;content?:{question:string;choices:readonly [string,string,string];reactions:readonly [string,string,string]};savedMessage?:string;character?:{name:string;role:string;src:string;crop:readonly [number,number,number,number]}}){
 const npc=character??rpgNpcs.find(n=>n.id===npcId)!;const data=content??getPlazaDialogue(npcId,contentVersion);
 const [answer,setAnswer]=useState<number|null>(savedChoice??null),[visible,setVisible]=useState(0),[selected,setSelected]=useState(0);
 const panel=useRef<HTMLDivElement>(null),portrait=useRef<HTMLCanvasElement>(null),answered=useRef(savedChoice!==undefined);
 const text=answer===null?data.question:data.reactions[answer],finished=reducedMotion||visible>=text.length;
 useEffect(()=>{const previous=document.activeElement as HTMLElement|null;panel.current?.focus();return()=>{previous?.focus();};},[]);
 useEffect(()=>{if(reducedMotion)return;let count=0;const timer=window.setInterval(()=>{count++;setVisible(old=>Math.max(old,count));if(count>=text.length)window.clearInterval(timer);},30);return()=>window.clearInterval(timer);},[text,reducedMotion]);
 useEffect(()=>{const img=new window.Image();img.onload=()=>{const ctx=portrait.current?.getContext('2d');if(!ctx)return;const [x,y,w,h]=character?.crop??npcCrop(npcId);ctx.clearRect(0,0,240,260);ctx.imageSmoothingEnabled=false;const cropHeight=h*.58;const scale=Math.min(240/w,260/cropHeight);ctx.drawImage(img,x,y,w,cropHeight,(240-w*scale)/2,260-cropHeight*scale,w*scale,cropHeight*scale);};img.src=npc.src;return()=>{img.onload=null;};},[npcId,npc.src,character]);
 function choose(index:number){if(answered.current||!finished)return;answered.current=true;onAnswer(index);setVisible(0);setAnswer(index);}
 return <div ref={panel} className={s.panel} data-reduced={reducedMotion} tabIndex={-1} role="dialog" aria-modal="true" aria-label={`Conversación con ${npc.name}`} onKeyDown={e=>{
 e.stopPropagation();const key=e.key.toLowerCase();
 if(key==='escape'){e.preventDefault();onClose();return;}
 if(key==='tab'){e.preventDefault();const buttons=Array.from(panel.current?.querySelectorAll<HTMLButtonElement>('button')??[]);const index=buttons.indexOf(document.activeElement as HTMLButtonElement);buttons[(index+(e.shiftKey?buttons.length-1:1))%buttons.length]?.focus();return;}
 if(['e','enter',' '].includes(key)){e.preventDefault();if(e.repeat)return;if(!finished)setVisible(text.length);else if(answer!==null)onClose();else choose(selected);return;}
 if(answer===null&&finished&&['arrowup','arrowdown','w','s'].includes(key)){e.preventDefault();setSelected(i=>(i+(['w','arrowup'].includes(key)?2:1))%3);}
 }}>
 <canvas ref={portrait} width={240} height={260} className={s.portrait} aria-hidden="true"/>
 <div className={s.copy}><h2>{npc.name}<span> · {npc.role}</span></h2><p aria-label={text}>{reducedMotion?text:text.slice(0,visible)}{!finished&&<span className={s.cursor} aria-hidden="true">▏</span>}</p><small>{answer===null?'No hay respuestas correctas ni incorrectas.':savedMessage??'Tu respuesta está guardada en la bitácora.'}</small></div>
 <div className={s.responses}>{!finished?<button onClick={()=>setVisible(text.length)}>Mostrar texto <span>↵</span></button>:answer===null?data.choices.map((choice,index)=><button key={choice} data-selected={selected===index} onFocus={()=>setSelected(index)} onPointerEnter={()=>setSelected(index)} onClick={()=>choose(index)}><span aria-hidden="true">{selected===index?'▸':''}</span>{choice}</button>):<button data-selected="true" onClick={onClose}>Seguir explorando <span>▸</span></button>}</div>
 <button className={s.close} onClick={onClose} aria-label="Cerrar conversación">×</button>
 </div>;
}
