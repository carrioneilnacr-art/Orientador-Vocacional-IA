'use client';
import Link from 'next/link';
import {useEffect,useState} from 'react';
import type {SchoolExploration} from '@/modules/school-portal/application/listExplorations';
export default function ExploracionesPage(){
 const [entries,setEntries]=useState<SchoolExploration[]>([]),[error,setError]=useState(''),[loading,setLoading]=useState(true),[next,setNext]=useState<string|null>(null);
 async function load(before?:string,signal?:AbortSignal){
  try{const response=await fetch(`/api/colegio/exploraciones${before?`?before=${encodeURIComponent(before)}`:''}`,{cache:'no-store',signal});const data=await response.json();if(!response.ok)throw new Error(data.error||'No se pudo consultar la información.');setEntries(old=>before?[...old,...data.entries]:data.entries);setNext(data.nextBefore);setError('');}
  catch(cause){if(!signal?.aborted)setError(cause instanceof Error?cause.message:'Error de conexión.');}
  finally{if(!signal?.aborted)setLoading(false);}
 }
 useEffect(()=>{const controller=new AbortController();queueMicrotask(()=>{if(!controller.signal.aborted)void load(undefined,controller.signal);});return()=>controller.abort();},[]);
 return <main className="min-h-screen bg-chaski-page p-6 text-chaski-heading"><div className="mx-auto max-w-4xl"><Link href="/colegio/dashboard">← Portal del colegio</Link><h1 className="mt-6 text-3xl font-semibold">Exploraciones de tus estudiantes</h1><p className="my-4">Preferencias declaradas en la aventura. Son pistas para conversar, no diagnósticos ni medidas de capacidad.</p>{loading&&<p role="status">Consultando registros…</p>}{error&&<p role="alert">{error}</p>}{!loading&&!error&&!entries.length&&<p>No hay exploraciones finalizadas y autorizadas para mostrar.</p>}{entries.map(entry=><article key={entry.id} className="my-4 rounded-2xl border border-chaski-border bg-white p-5"><h2 className="text-xl font-semibold">{entry.studentName}</h2><time dateTime={entry.createdAt}>{new Date(entry.createdAt).toLocaleDateString('es-PE')}</time><ul className="mt-4 space-y-3">{entry.notes.map((note,i)=><li key={i}><strong>{note.label}: </strong>{note.text}</li>)}</ul></article>)}{next&&!loading&&<button className="rounded-xl border p-3" onClick={()=>{setLoading(true);void load(next);}}>Ver anteriores</button>}</div></main>;
}
