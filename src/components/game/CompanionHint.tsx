'use client';

import { useEffect, useRef, useState } from 'react';
import s from './CompanionHint.module.css';

interface CompanionHintProps {
  scene: string;
  completedCount: number;
  paused: boolean;
}

const MUTE_KEY = 'chaski-lumi-muted-v1';
const EXPLORATION_TIPS = [
  '¿Qué actividad probarías aunque nadie te pusiera una nota?',
  'Puedes cambiar de idea. A veces descubrir lo que no te gusta también abre un camino.',
  '¿Qué parte de esta aventura te gustaría contarle a alguien?',
  'No hace falta hacerlo perfecto. Prueba algo que te dé curiosidad.',
];

function contextualHint(scene: string, completedCount: number, index: number): string {
  if (index % 2 === 1) return EXPLORATION_TIPS[Math.floor(index / 2) % EXPLORATION_TIPS.length];
  if (completedCount >= 4) return 'Ya probaste caminos distintos. ¿Cuál volverías a explorar por elección propia?';
  const place = scene.toLowerCase();
  if (place.includes('colegio') || place.includes('school')) return 'Piensa en algo que te gustaría crear o resolver con tus compañeros. ¿Por dónde empezarías?';
  if (place.includes('malecon') || place.includes('malecón') || place.includes('coast')) return 'Toma un momento para observar. ¿Qué detalle te despierta una pregunta?';
  if (place.includes('lima') || place.includes('ciudad') || place.includes('city')) return 'Mira a tu alrededor. ¿Te da más curiosidad crear, investigar, construir o ayudar a alguien?';
  return completedCount > 0
    ? 'Ya descubriste algo de ti. ¿Quieres repetir lo que disfrutaste o probar un camino diferente?'
    : 'Elige un lugar que te dé curiosidad. Puedes explorar a tu ritmo y volver cuando quieras.';
}

/** Optional companion: local mute setting, no telemetry and no vocational inference. */
export default function CompanionHint({ scene, completedCount, paused }: CompanionHintProps) {
  const [muted, setMuted] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [hint, setHint] = useState<string | null>(null);
  const sequence = useRef(0);

  useEffect(() => {
    try { setMuted(localStorage.getItem(MUTE_KEY) === 'true'); }
    catch { /* The companion also works without browser storage. */ }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded || muted || paused) return;
    const timer = window.setInterval(() => {
      if (document.visibilityState !== 'visible') return;
      setHint(contextualHint(scene, completedCount, sequence.current++));
    }, 55_000);
    return () => window.clearInterval(timer);
  }, [scene, completedCount, muted, paused, loaded]);

  useEffect(() => {
    if (!hint) return;
    const timer = window.setTimeout(() => setHint(null), 9_000);
    return () => window.clearTimeout(timer);
  }, [hint]);

  function toggleMute() {
    const next = !muted;
    setMuted(next);
    setHint(null);
    try { localStorage.setItem(MUTE_KEY, String(next)); }
    catch { /* Keep the setting for this visit when persistence is unavailable. */ }
  }

  return <aside
    className={s.companion}
    aria-label="Lumi, compañero de exploración"
    hidden={paused || !loaded}
    onPointerDown={event => event.stopPropagation()}
    onClick={event => event.stopPropagation()}
    onKeyDown={event => event.stopPropagation()}
  >
    <div className={s.hint} aria-live="polite" aria-atomic="true">
      {hint && <div className={s.bubble}><strong>Lumi</strong><p>{hint}</p></div>}
    </div>
    <div className={s.controls}>
      <button
        type="button"
        className={s.ask}
        aria-label={hint ? 'Ocultar sugerencia de Lumi' : 'Pedir una sugerencia a Lumi'}
        aria-expanded={!!hint}
        onClick={() => setHint(old => old ? null : contextualHint(scene, completedCount, sequence.current++))}
      >
        <svg viewBox="0 0 36 36" width="28" height="28" aria-hidden="true">
          <path d="M16 18C1 8 3 1 13 10L18 17M20 18C35 8 33 1 23 10L18 17" fill="#d9faff" fillOpacity=".65" />
          <ellipse cx="18" cy="23" rx="7" ry="9" fill="#ddf49b" />
          <path d="M12 23h12" stroke="#6f9857" strokeWidth="2" />
          <circle cx="18" cy="15" r="5" fill="#20494c" />
          <circle cx="16" cy="14" r="1" fill="#fffbd8" /><circle cx="20" cy="14" r="1" fill="#fffbd8" />
        </svg>
        <span>Lumi</span>
      </button>
      <button
        type="button"
        className={s.mute}
        aria-label={muted ? 'Activar sugerencias automáticas de Lumi' : 'Silenciar sugerencias automáticas de Lumi'}
        aria-pressed={muted}
        onClick={toggleMute}
      >{muted ? 'Activar' : 'Silenciar'}</button>
    </div>
  </aside>;
}
