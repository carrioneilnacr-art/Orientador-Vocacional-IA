'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, BookOpen, Check, Compass, Leaf, Zap, RotateCcw, Settings2, X, Users, Gamepad2, Landmark, MapPin, Maximize2 } from 'lucide-react';
import { initialProgress, missions, readProgress, recordPreference, recordNpcChoice, reflectionLabels, SAVE_KEY, type Mission, type Progress } from '@/game/adventure';
import { plazaNpcs, type PlazaNpcId } from '@/game/plazaNpcs';
import AdventureWorld from './AdventureWorld';
import PlazaWorld from './PlazaWorld';
import s from './Adventure.module.css';
import './AdventureShell.css';

function Overlay({ title, onClose, children, returnTo }: { title: string; onClose: () => void; children: React.ReactNode; returnTo?: HTMLElement | null }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const previous = returnTo ?? (document.activeElement instanceof HTMLElement ? document.activeElement : null);
    const dialog = ref.current;
    dialog?.showModal();
    return () => { dialog?.close(); requestAnimationFrame(() => previous?.focus()); };
  }, [returnTo]);
  return (
    <dialog ref={ref} className={s.dialog} onCancel={onClose} onClick={e => { if (e.target === e.currentTarget) onClose(); }} aria-label={title}>
      <button className={s.close} aria-label="Cerrar" onClick={onClose}><X size={20} /></button>
      {children}
    </dialog>
  );
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

  return (
    <Overlay title={mission.title} onClose={onClose} returnTo={returnTo}>
      <span className={s.eyebrow}>{mission.place} · {step === 'play' ? 'Experimenta' : 'Tu descubrimiento'}</span>
      <h2>{step === 'play' ? mission.title : '¿Esto despertó tu curiosidad?'}</h2>
      <p className={s.modalIntro}>{step === 'play' ? mission.description : mission.reflection}</p>
      {step === 'play' ? (
        <>
          <div className={s.missionStage} style={{ '--mission-color': mission.color } as React.CSSProperties}>
            {mission.id === 'inventos' && (
              <div className={s.circuit} aria-label={`${pieces.filter(Boolean).length} piezas activadas`}>
                {pieces.map((p, i) => (
                  <div className={p ? s.powered : ''} key={i}>
                    {i === 0 ? <Zap /> : i === 1 ? <span>＋</span> : <span className={ready ? s.lit : ''}>✦</span>}
                    {i < 2 && <i />}
                  </div>
                ))}
                <strong>{ready ? '¡La plaza ya tiene luz!' : 'Una idea puede encender todo un pueblo.'}</strong>
              </div>
            )}
            {mission.id === 'mural' && (
              <svg viewBox="0 0 500 200" className={s.mural} role="img" aria-label="Tu mural de bienvenida con cielo, montañas y un símbolo">
                <rect width="500" height="200" rx="12" fill={['#c4e9e2', '#e5d1ee', '#f8d8b4'][pieces[0] % 3]} />
                <circle cx="380" cy="50" r="27" fill="#fff4c1" />
                <path d="M0 200L100 50L200 165L295 60L430 200Z" fill={['#48998c', '#7978ad', '#bd7e67'][pieces[1] % 3]} />
                <path d="M90 200L210 95L330 200Z M290 200L430 100L500 200Z" fill="#254f59" opacity=".6" />
                {pieces[2] % 3 === 0 ? <path d="M230 58L250 28L270 58L250 87Z" fill="#fff7d6" /> : pieces[2] % 3 === 1 ? <circle cx="250" cy="55" r="24" fill="#fff7d6" /> : <path d="M230 70Q250 15 270 70Z" fill="#fff7d6" />}
              </svg>
            )}
            {(mission.id === 'comunidad' || mission.id === 'observatorio') && (
              <div className={s.clueScene}>
                {mission.id === 'comunidad' ? <Users size={58} /> : <Leaf size={58} />}
                <p aria-live="polite">{clue === null ? 'Cada encuentro es una nueva pista. ¿Por dónde quieres empezar?' : clues[clue]}</p>
                {ready && <strong>{mission.id === 'comunidad' ? 'El equipo ya tiene un punto de encuentro.' : '¡El agua vuelve al jardín!'}</strong>}
              </div>
            )}
          </div>
          <p>{mission.prompt}</p>
          <div className={s.actions}>
            {mission.actions.map((action, i) => (
              <button key={action} className={pieces[i] ? s.selectedAction : ''} onClick={() => activate(i)}>
                {pieces[i] ? <Check size={17} /> : <span className={s.actionNumber}>{i + 1}</span>}
                {action}
              </button>
            ))}
          </div>
          <div className={s.modalFooter}>
            <span>Sin cronómetro. Prueba a tu ritmo.</span>
            <button className={s.primary} disabled={!ready} onClick={() => setStep('reflect')}>
              Continuar <ArrowRight size={17} />
            </button>
          </div>
        </>
      ) : (
        <>
          <div className={s.reflectionNote}>
            <Image src="/game/chaski-2d.png" alt="Chaski" width={76} height={90} />
            <p>Lo importante es lo que te interesó. Puedes disfrutar algo, tener dudas o descubrir que prefieres otra actividad.</p>
          </div>
          <div className={s.reflections}>
            {(Object.entries(reflectionLabels) as [Progress['decisions'][number]['preference'], string][]).map(([value, label]) => (
              <button key={value} onClick={() => onFinish(value)}>
                {label}
                <ArrowRight size={18} />
              </button>
            ))}
          </div>
        </>
      )}
    </Overlay>
  );
}

export default function Adventure() {
  const [progress, setProgress] = useState<Progress>(initialProgress);
  const [loaded, setLoaded] = useState(false);
  const [scene, setScene] = useState('plaza');
  const [saveState, setSaveState] = useState('Preparando aventura…');
  const [mission, setMission] = useState<Mission | null>(null);
  const [panel, setPanel] = useState<'journal' | 'settings' | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);
  const [notice, setNotice] = useState('');
  const [opener, setOpener] = useState<HTMLElement | null>(null);
  const screenRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() !== 'b' || event.repeat || mission || panel || event.target instanceof HTMLInputElement) return;
      event.preventDefault();
      openPanel('journal');
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [mission, panel]);

  useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(() => setNotice(''), 6500);
    return () => window.clearTimeout(timer);
  }, [notice]);

  function openPanel(value: 'journal' | 'settings') {
    setOpener(document.activeElement instanceof HTMLElement ? document.activeElement : null);
    setPanel(value);
  }

  useEffect(() => {
    try { setProgress(readProgress(localStorage.getItem(SAVE_KEY))); }
    catch { setSaveState('Guardado no disponible en este navegador'); }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify(progress));
      setSaveState('Guardado en este dispositivo');
    } catch {
      setSaveState('No se pudo guardar. Conserva esta pestaña abierta.');
    }
  }, [progress, loaded]);

  const visit = useCallback((id: string) => {
    const found = missions.find(m => m.id === id);
    if (found) {
      setOpener(document.activeElement instanceof HTMLElement ? document.activeElement : null);
      setMission(found);
    }
  }, []);

  const completed = progress.decisions.map(d => d.missionId);

  function answerNpc(npcId: PlazaNpcId, choice: number) {
    setProgress(old => recordNpcChoice(old, npcId, choice));
    setNotice('Tu respuesta quedó guardada en la bitácora.');
  }

  function finish(preference: Progress['decisions'][number]['preference']) {
    if (!mission) return;
    setProgress(old => recordPreference(old, mission.id, preference));
    setNotice(`${mission.place}: descubrimiento añadido a tu bitácora.`);
    setMission(null);
  }

  const reduced = progress.reducedMotion;
  const explored = progress.npcDecisions.filter(entry => entry.evidenceVersion === 1).length;
  const progressPercent = Math.round(((explored + completed.length) / (plazaNpcs.length + missions.length)) * 100);
  const location = ({ plaza: 'Plaza de Lima', colegio: 'Colegio Horizonte', barrio: 'Barrio de los Caminos', malecon: 'Malecón de las Ideas' } as Record<string, string>)[scene] ?? 'Chaski Adventure';
  const dimensions = [
    ['R', 'Realista', '#69e8a4'], ['I', 'Investigador', '#64d7ff'], ['A', 'Artístico', '#ff9ed8'],
    ['S', 'Social', '#ffda69'], ['E', 'Emprendedor', '#ffa86b'], ['C', 'Convencional', '#bba5ff'],
  ];

  return (
    <main className={`${s.adventure} adventure`} data-reduced={reduced}>
      <header className="adventureHeader">
        <Link className="productBrand" href="/" aria-label="Ir a la portada de Orientador Vocacional IA">
          <Image src="/game/chaski-2d.png" alt="" width={58} height={58} />
          <span>ORIENTADOR<br />VOCACIONAL <em>IA</em></span>
        </Link>
        <nav aria-label="Navegación principal">
          <Link className="activeNavigation" href="/aventura" aria-current="page"><Gamepad2 size={21} /> Aventura</Link>
          <Link href="/universidades"><Landmark size={21} /> Universidades</Link>
        </nav>
      </header>
      <div className="playLayout">
      <div ref={screenRef} className={`${s.gameScreen} gameScreen`}>
        {scene === 'plaza' ? (
          <PlazaWorld
            key="plaza-perspectiva-v4"
            onSceneChange={setScene}
            npcDecisions={progress.npcDecisions}
            onNpcAnswer={answerNpc}
            paused={!!mission || !!panel || !loaded}
            reducedMotion={reduced}
          />
        ) : (
          <AdventureWorld
            scene={scene}
            onSceneChange={setScene}
            onVisit={visit}
            completed={completed}
            npcDecisions={progress.npcDecisions}
            onNpcAnswer={answerNpc}
            paused={!!mission || !!panel || !loaded}
            reducedMotion={reduced}
          />
        )}
        <div className={`${s.gameTop} gameTop`}>
          <Link href="/" aria-label="Volver a la portada">
            <ArrowLeft size={19} />
          </Link>
          <div><MapPin size={24} /><span><strong>{location}</strong><small>Capítulo 1 · Descubre tu camino</small></span></div>
        </div>
        <div className={`${s.gameTools} gameTools`}>
          <button onClick={() => openPanel('journal')} aria-label="Abrir bitácora">
            <BookOpen size={23} />
            <span>Bitácora</span>
            <b>{completed.length + progress.npcDecisions.length}</b>
          </button>
          <button onClick={() => openPanel('settings')} aria-label="Ajustes de accesibilidad">
            <Settings2 size={21} />
          </button>
          <button onClick={() => { if (document.fullscreenElement) void document.exitFullscreen(); else void screenRef.current?.requestFullscreen(); }} aria-label="Alternar pantalla completa"><Maximize2 size={21} /></button>
        </div>
        <div className={`${s.gameControls} gameControls`}>
          <span><kbd>W</kbd><kbd>A</kbd><kbd>S</kbd><kbd>D</kbd> Mover</span><span><kbd>E</kbd> Interactuar</span><span><kbd>B</kbd> Bitácora</span>
        </div>
        <p className={`${s.gameNotice} gameNotice`} role="status">
          {notice}
        </p>
      </div>
      <section className="belowGame" aria-label="Orientación y progreso">
        <div className="assistantCard">
          <Image src="/game/chaski-2d.png" alt="Chaski" width={120} height={125} />
          <div className="assistantCopy"><span className="cardKicker">TU COMPAÑERO DE RUTA</span><h2>Chaski <span>✦</span></h2><p>{scene === 'plaza' ? explored ? `Ya conversaste con ${explored} de las 6 personas de la plaza. Sigue explorando y guarda tus ideas en la bitácora.` : '¡Bienvenido a la Plaza de Lima! Explora el lugar, conversa con sus habitantes y descubre qué actividades despiertan tu curiosidad.' : `Estás en ${location}. Explora los encuentros y registra lo que descubras en tu bitácora.`}</p><small>{explored ? `${explored} pistas guardadas` : 'Tu camino empieza aquí'}</small></div>
        </div>
        <div className="progressCard">
          <span className="cardKicker">CAPÍTULO 01 · EXPLORACIÓN</span><h2>Tu camino se va dibujando</h2>
          <div className="progressLine"><div role="progressbar" aria-valuenow={progressPercent} aria-valuemin={0} aria-valuemax={100} aria-label="Progreso de la aventura"><i style={{ width: `${progressPercent}%` }} /></div><strong>{progressPercent}%</strong></div>
          <p className="progressCaption">{explored} de 6 conversaciones en la plaza</p>
          <div className="progressBottom"><div className="dimensionList">{dimensions.map(([letter, label, color]) => <span key={letter} title={label} aria-label={label} style={{ '--dimension-color': color } as React.CSSProperties}>{letter}</span>)}</div><button onClick={() => openPanel('journal')}>Ver bitácora <BookOpen size={16} /></button></div>
        </div>
      </section>
      </div>

      {mission && (
        <MissionPlay
          key={mission.id}
          mission={mission}
          returnTo={opener}
          onFinish={finish}
          onClose={() => setMission(null)}
        />
      )}

      {panel === 'journal' && (
        <Overlay returnTo={opener} title="Tu bitácora" onClose={() => setPanel(null)}>
          <span className={s.eyebrow}>TU HISTORIA, A TU RITMO</span>
          <h2>Lo que descubriste en el camino.</h2>
          <p className={s.modalIntro}>Estas son tus preferencias durante la aventura. Puedes cambiarlas al volver a un taller.</p>
          {!completed.length && !progress.npcDecisions.length && (
            <div className={s.emptyJournal}>
              <BookOpen size={42} />
              <p>Tu primera página está por escribirse.</p>
              <small>Conversa con alguien en la plaza y cuéntale a Chaski qué te pareció.</small>
            </div>
          )}
          <div className={s.journalEntries}>
            {progress.npcDecisions.map(entry => {
              const npc = plazaNpcs.find(item => item.id === entry.npcId)!;
              return (
                <article key={entry.npcId}>
                  <span>Plaza de Lima · {npc.role}</span>
                  <h3>{npc.name}: {npc.question}</h3>
                  <p>{entry.note ?? npc.choices[entry.choice]}</p>
                  <button onClick={() => { setPanel(null); setScene('plaza'); }}>
                    Volver a la plaza <ArrowRight size={15} />
                  </button>
                </article>
              );
            })}
          </div>
          <div className={s.journalEntries}>
            {progress.decisions.map(d => {
              const m = missions.find(m => m.id === d.missionId)!;
              return (
                <article key={d.missionId}>
                  <span>{m.place}</span>
                  <h3>{m.discovery}</h3>
                  <p>{reflectionLabels[d.preference]}</p>
                  <button onClick={() => { setPanel(null); visit(m.id); }}>
                    Volver a explorar <ArrowRight size={15} />
                  </button>
                </article>
              );
            })}
          </div>
          <div className={s.journalDisclaimer}>
            <Compass size={21} />
            <p>Tu curiosidad puede cambiar. Esta bitácora es exploratoria y no calcula un diagnóstico ni una compatibilidad profesional.</p>
          </div>
          {completed.length === 4 && (
            <Link className={s.primary} href="/cuestionario">
              Seguir descubriendo mis intereses <ArrowRight size={17} />
            </Link>
          )}
        </Overlay>
      )}

      {panel === 'settings' && (
        <Overlay returnTo={opener} title="Ajustes de la aventura" onClose={() => { setPanel(null); setConfirmReset(false); }}>
          <span className={s.eyebrow}>JUEGA A TU MANERA</span>
          <h2>Tu aventura, tu ritmo.</h2>
          <p>{saveState}</p>
          <p className={s.modalIntro}>Todas las decisiones están disponibles desde los botones de los talleres. No necesitas moverte por el mapa.</p>
          <label className={s.setting}>
            <span>
              <strong>Reducir movimiento</strong>
              <small>Disminuye las animaciones decorativas.</small>
            </span>
            <input
              type="checkbox"
              checked={reduced}
              onChange={e => setProgress(old => ({ ...old, reducedMotion: e.target.checked }))}
            />
          </label>
          <div className={s.journalDisclaimer}>
            <BookOpen size={22} />
            <p>El progreso se guarda únicamente en este navegador. No se sincroniza entre dispositivos. No pedimos tu nombre ni enviamos tus elecciones al servidor.</p>
          </div>
          {confirmReset ? (
            <div className={s.resetConfirm}>
              <p>¿Borrar la bitácora de esta aventura en este navegador?</p>
              <button
                onClick={() => {
                  setProgress({ ...initialProgress, decisions: [], npcDecisions: [] });
                  setConfirmReset(false);
                  setPanel(null);
                  setNotice('Aventura reiniciada.');
                }}
              >
                Sí, comenzar de nuevo
              </button>
              <button onClick={() => setConfirmReset(false)}>Conservar mi progreso</button>
            </div>
          ) : (
            <button className={s.reset} onClick={() => setConfirmReset(true)}>
              <RotateCcw size={16} /> Empezar de nuevo
            </button>
          )}
        </Overlay>
      )}
    </main>
  );
}
