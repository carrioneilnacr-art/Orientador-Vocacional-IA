'use client';
import Link from 'next/link';
import {useEffect,useState} from 'react';
import type {ExplorationResult} from '@/modules/adventure/domain/exploration';

export default function AdventureResults(){
 const [result,setResult]=useState<ExplorationResult|null>(null),[error,setError]=useState(''),[retry,setRetry]=useState(0);
 useEffect(()=>{
  const controller=new AbortController();
  void fetch('/api/aventura/resultado',{signal:controller.signal,cache:'no-store'}).then(async response=>{const data=await response.json();if(!response.ok)throw new Error(data.error??'No pudimos recuperar tus descubrimientos.');if(!controller.signal.aborted){setResult(data.result);setError('');}}).catch(cause=>{if(!controller.signal.aborted)setError(cause instanceof Error?cause.message:'No pudimos recuperar tus descubrimientos.');});
  return()=>controller.abort();
 },[retry]);
 return <main style={{minHeight:'100vh',background:'#122c40',color:'#fff5de',padding:'clamp(20px,4vw,64px)'}}><div style={{maxWidth:960,margin:'auto'}}><Link href="/aventura" style={{color:'#f3d18b'}}>← Volver a la aventura</Link><p>CHASKI · TUS DESCUBRIMIENTOS</p><h1>Lo que te llamó la atención</h1><p>Plaza de Lima y colegio · Recorrido exploratorio</p>{error?<div role="alert"><p>{error}</p><button onClick={()=>setRetry(value=>value+1)}>Volver a intentar</button></div>:!result?<p role="status">Recuperando tus descubrimientos…</p>:<><p>{result.disclaimer}</p><section aria-label="Preferencias declaradas" style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))',gap:16,margin:'28px 0'}}>{result.notes.map(note=><article key={note.id} style={{border:'1px solid #caa96b',borderRadius:16,padding:20,background:'#1c3d52'}}><h2 style={{fontSize:20}}>{note.label}</h2><p>{note.text}</p></article>)}</section><p>Chaski guarda lo que expresaste. Puedes seguir explorando y conversar con tu orientador sobre lo que te gustaría probar. Tus intentos y la rapidez del juego no se usan para etiquetar tu capacidad.</p></>}</div></main>;
}
