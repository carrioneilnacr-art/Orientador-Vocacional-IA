'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, BookOpen, Check, Compass, Leaf, Zap, RotateCcw, Settings2, X, Users } from 'lucide-react';
import { initialProgress, missions, readProgress, recordPreference, reflectionLabels, SAVE_KEY, type Mission, type Progress } from '@/game/adventure';
import AdventureWorld from './AdventureWorld';
import CompanionHint from './CompanionHint';
import s from './Adventure.module.css';



function Overlay({ title, onClose, children, returnTo }: { title: string; onClose: () => void; children: React.ReactNode; returnTo?: HTMLElement | null }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const previous = returnTo ?? (document.activeElement instanceof HTMLElement ? document.activeElement : null);
    const dialog = ref.current;
    dialog?.showModal();
    return () => { dialog?.close(); requestAnimationFrame(() => previous?.focus()); };
  }, []);
  return <dialog ref={ref} className={s.dialog} onCancel={onClose} onClick={e => { if (e.target === e.currentTarget) onClose(); }} aria-label={title}>
    <button className={s.close} aria-label="Cerrar" onClick={onClose}><X size={20} /></button>{children}
  </dialog>;
}

function MissionPlay({ mission, onFinish, onClose, returnTo }: { mission: Mission; onFinish: (preference: Progress['decisions'][number]['preference']) => void; onClose: () => void; returnTo: HTMLElement | null }) {
  const [pieces, setPieces] = useState([0, 0, 0]);
  const [step, setStep] = useState<'play' | 'reflect'>('play');
  const ready = pieces.every(p => p > 0);
  const [clue, setClue] = useState<number | null>(null);
  const clues = mission.id === 'comunidad' ? [
    '“Es mi primera feria y no conozco a nadie”. Escuchar antes de proponer ayuda a entender qué necesita cada persona.',
    '“Tenemos muchas ideas distintas”. Propones que cada persona cuente qué le gustaría aportar al equipo.',
    '“No sabemos dónde reunirnos”. Acuerdan un lugar visible y un plan que todos pueden consultar.',
  ] : ['La tierra del jardín está seca, aunque el río sigue llevando agua.', 'Hay hojas acumuladas en la entrada del canal. El paso del agua está bloqueado.', 'Las plantas junto al río conservan sus hojas verdes. Conviene probar limpiando el canal.'];
  function activate(i: number) { setPieces(old => old.map((v, j) => j === i ? v + 1 : v)); setClue(i); }
  return <Overlay title={mission.title} onClose={onClose} returnTo={returnTo}>
    <span className={s.eyebrow}>{mission.place} · {step === 'play' ? 'Experimenta' : 'Tu descubrimiento'}</span>
    <h2>{step === 'play' ? mission.title : '¿Esto despertó tu curiosidad?'}</h2>
    <p className={s.modalIntro}>{step === 'play' ? mission.description : mission.reflection}</p>
    {step === 'play' ? <>
      <div className={s.missionStage} style={{ '--mission-color': mission.color } as React.CSSProperties}>
        {mission.id === 'inventos' && <div className={s.circuit} aria-label={`${pieces.filter(Boolean).length} piezas activadas`}>
          {pieces.map((p, i) => <div className={p ? s.powered : ''} key={i}>{i === 0 ? <Zap /> : i === 1 ? <span>＋</span> : <span className={ready ? s.lit : ''}>✦</span>}{i < 2 && <i />}</div>)}
          <strong>{ready ? '¡La plaza ya tiene luz!' : 'Una idea puede encender todo un pueblo.'}</strong>
        </div>}
        {mission.id === 'mural' && <svg viewBox="0 0 500 200" className={s.mural} role="img" aria-label="Tu mural de bienvenida con cielo, montañas y un símbolo">
          <rect width="500" height="200" rx="12" fill={['#c4e9e2', '#e5d1ee', '#f8d8b4'][pieces[0] % 3]} />
          <circle cx="380" cy="50" r="27" fill="#fff4c1" /><path d="M0 200L100 50L200 165L295 60L430 200Z" fill={['#48998c', '#7978ad', '#bd7e67'][pieces[1] % 3]} />
          <path d="M90 200L210 95L330 200Z M290 200L430 100L500 200Z" fill="#254f59" opacity=".6" />
          {pieces[2] % 3 === 0 ? <path d="M230 58L250 28L270 58L250 87Z" fill="#fff7d6" /> : pieces[2] % 3 === 1 ? <circle cx="250" cy="55" r="24" fill="#fff7d6" /> : <path d="M230 70Q250 15 270 70Z" fill="#fff7d6" />}
        </svg>}
        {(mission.id === 'comunidad' || mission.id === 'observatorio') && <div className={s.clueScene}>
          {mission.id === 'comunidad' ? <Users size={58} /> : <Leaf size={58} />}
          <p aria-live="polite">{clue === null ? 'Cada encuentro es una nueva pista. ¿Por dónde quieres empezar?' : clues[clue]}</p>
          {ready && <strong>{mission.id === 'comunidad' ? 'El equipo ya tiene un punto de encuentro.' : '¡El agua vuelve al jardín!'}</strong>}
        </div>}
      </div>
      <p>{mission.prompt}</p>
      <div className={s.actions}>{mission.actions.map((action, i) => <button key={action} className={pieces[i] ? s.selectedAction : ''} onClick={() => activate(i)}>{pieces[i] ? <Check size={17} /> : <span className={s.actionNumber}>{i + 1}</span>}{action}</button>)}</div>
      <div className={s.modalFooter}><span>Sin cronómetro. Prueba a tu ritmo.</span><button className={s.primary} disabled={!ready} onClick={() => setStep('reflect')}>Continuar <ArrowRight size={17} /></button></div>
    </> : <>
      <div className={s.reflectionNote}><Image src="/game/chaski-2d.png" alt="Chaski" width={76} height={90} /><p>Lo importante es lo que te interesó. Puedes disfrutar algo, tener dudas o descubrir que prefieres otra actividad.</p></div>
      <div className={s.reflections}>{(Object.entries(reflectionLabels) as [Progress['decisions'][number]['preference'], string][]).map(([value, label]) => <button key={value} onClick={() => onFinish(value)}>{label}<ArrowRight size={18} /></button>)}</div>
    </>}
  </Overlay>;
}

export default function Adventure() {
  const [progress, setProgress] = useState<Progress>(initialProgress);
  const [loaded, setLoaded] = useState(false);
  const [scene, setScene] = useState('barrio');
  const [saveState, setSaveState] = useState('Preparando aventura…');
  const [mission, setMission] = useState<Mission | null>(null);
  const [panel, setPanel] = useState<'journal' | 'settings' | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);
  const [notice, setNotice] = useState('');
  const [opener, setOpener] = useState<HTMLElement | null>(null);
  useEffect(() => { if (!notice) return; const timer = window.setTimeout(() => setNotice(''), 6500); return () => window.clearTimeout(timer); }, [notice]);
  function openPanel(value: 'journal' | 'settings') { setOpener(document.activeElement instanceof HTMLElement ? document.activeElement : null); setPanel(value); }
  useEffect(() => {
    try { setProgress(readProgress(localStorage.getItem(SAVE_KEY))); }
    catch { setSaveState('Guardado no disponible en este navegador'); }
    setLoaded(true);
  }, []);
  useEffect(() => {
    if (!loaded) return;
    try { localStorage.setItem(SAVE_KEY, JSON.stringify(progress)); setSaveState('Guardado en este dispositivo'); }
    catch { setSaveState('No se pudo guardar. Conserva esta pestaña abierta.'); }
  }, [progress, loaded]);
  const visit = useCallback((id: string) => { const found = missions.find(m => m.id === id); if (found) { setOpener(document.activeElement instanceof HTMLElement ? document.activeElement : null); setMission(found); } }, []);
  const completed = progress.decisions.map(d => d.missionId);
  
  function finish(preference: Progress['decisions'][number]['preference']) {
    if (!mission) return;
    setProgress(old => recordPreference(old, mission.id, preference));
    setNotice(`${mission.place}: descubrimiento añadido a tu bitácora.`);
    setMission(null);
  }
  const reduced = progress.reducedMotion;
  return <main className={s.adventure} data-reduced={reduced}>
    <div className={s.gameScreen}>
      <AdventureWorld scene={scene} onSceneChange={setScene} onVisit={visit} completed={completed} paused={!!mission || !!panel || !loaded} reducedMotion={reduced} />
      <div className={s.gameTop}><Link href="/" aria-label="Volver a la portada"><ArrowLeft size={19} /></Link><div><span>CHASKI ADVENTURE</span><strong>{scene === 'colegio' ? 'Colegio Horizonte' : scene === 'malecon' ? 'Malecón de las Ideas' : 'Barrio de los Caminos'}</strong></div></div>
      <div className={s.gameTools}><button onClick={() => openPanel('journal')} aria-label="Abrir bitácora"><BookOpen size={23} /><span>Bitácora</span><b>{completed.length}</b></button><button onClick={() => openPanel('settings')} aria-label="Ajustes de accesibilidad"><Settings2 size={21} /></button></div>
      <div className={s.gameControls}><span>WASD / flechas · Toca para caminar · E interactuar</span></div>
      <CompanionHint scene={scene} completedCount={completed.length} paused={!!mission || !!panel || !loaded} />
      <p className={s.gameNotice} role="status">{notice}</p>
    </div>
    {mission && <MissionPlay key={mission.id} mission={mission} returnTo={opener} onFinish={finish} onClose={() => setMission(null)} />}
    {panel === 'journal' && <Overlay returnTo={opener} title="Tu bitácora" onClose={() => setPanel(null)}><span className={s.eyebrow}>TU HISTORIA, A TU RITMO</span><h2>Lo que descubriste en el camino.</h2><p className={s.modalIntro}>Estas son tus preferencias durante la aventura. Puedes cambiarlas al volver a un taller.</p>
      {!completed.length && <div className={s.emptyJournal}><BookOpen size={42} /><p>Tu primera página está por escribirse.</p><small>Visita un taller y cuéntale a Chaski qué te pareció.</small></div>}
      <div className={s.journalEntries}>{progress.decisions.map(d => { const m = missions.find(m => m.id === d.missionId)!; return <article key={d.missionId}><span>{m.place}</span><h3>{m.discovery}</h3><p>{reflectionLabels[d.preference]}</p><button onClick={() => { setPanel(null); visit(m.id); }}>Volver a explorar <ArrowRight size={15} /></button></article>; })}</div>
      <div className={s.journalDisclaimer}><Compass size={21} /><p>Tu curiosidad puede cambiar. Esta bitácora es exploratoria y no calcula un diagnóstico ni una compatibilidad profesional.</p></div>
      {completed.length === 4 && <Link className={s.primary} href="/cuestionario">Seguir descubriendo mis intereses <ArrowRight size={17} /></Link>}
    </Overlay>}
    {panel === 'settings' && <Overlay returnTo={opener} title="Ajustes de la aventura" onClose={() => { setPanel(null); setConfirmReset(false); }}><span className={s.eyebrow}>JUEGA A TU MANERA</span><h2>Tu aventura, tu ritmo.</h2><p>{saveState}</p><p className={s.modalIntro}>Todas las decisiones están disponibles desde los botones de los talleres. No necesitas moverte por el mapa.</p><label className={s.setting}><span><strong>Reducir movimiento</strong><small>Disminuye las animaciones decorativas.</small></span><input type="checkbox" checked={reduced} onChange={e => setProgress(old => ({ ...old, reducedMotion: e.target.checked }))} /></label><div className={s.journalDisclaimer}><BookOpen size={22} /><p>El progreso se guarda únicamente en este navegador. No se sincroniza entre dispositivos. No pedimos tu nombre ni enviamos tus elecciones al servidor.</p></div>
      {confirmReset ? <div className={s.resetConfirm}><p>¿Borrar la bitácora de esta aventura en este navegador?</p><button onClick={() => { setProgress({ ...initialProgress, decisions: [] }); setConfirmReset(false); setPanel(null); setNotice('Aventura reiniciada.'); }}>Sí, comenzar de nuevo</button><button onClick={() => setConfirmReset(false)}>Conservar mi progreso</button></div> : <button className={s.reset} onClick={() => setConfirmReset(true)}><RotateCcw size={16} /> Empezar de nuevo</button>}
    </Overlay>}
  </main>;
}
