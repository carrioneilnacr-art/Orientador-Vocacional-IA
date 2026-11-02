'use client';
import {useState} from 'react';
import {useRouter} from 'next/navigation';
import type {ExplorationInput} from '../domain/exploration';
export const SUBMISSION_KEY='chaski-adventure-submission-v1';
export default function CompleteExplorationButton({input}:{input:ExplorationInput}){
 const [busy,setBusy]=useState(false),[error,setError]=useState('');const router=useRouter();
 async function complete(){
  if(busy)return;setBusy(true);setError('');
  try{
   const session=await fetch('/api/aventura/sesion',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({restart:localStorage.getItem(SUBMISSION_KEY)!=='started'})});
   if(!session.ok)throw new Error('No pudimos iniciar el guardado. Conservamos tu bitácora local.');
   localStorage.setItem(SUBMISSION_KEY,'started');
   const response=await fetch('/api/aventura/resultado',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(input)});
   const data:unknown=await response.json();
   if(!response.ok)throw new Error(data&&typeof data==='object'&&'error' in data&&typeof data.error==='string'?data.error:'No pudimos guardar el recorrido. Inténtalo nuevamente.');
   router.push('/aventura/resultados');
  }catch(cause){setError(cause instanceof Error?cause.message:'No hay conexión. Tu bitácora local se conserva.');setBusy(false);}
 }
 return <div style={{marginTop:16}}><p>Completaste la plaza y las tres actividades del colegio. Puedes revisar tus descubrimientos de estos capítulos.</p><button type="button" onClick={()=>void complete()} disabled={busy}>{busy?'Guardando descubrimientos…':'Ver mis descubrimientos'}</button>{error&&<p role="alert">{error}</p>}</div>;
}
