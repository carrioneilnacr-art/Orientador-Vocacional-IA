'use client';

import { useEffect, useRef, useState } from 'react';
import { Wrench, Search, Paintbrush, Heart, BriefcaseBusiness, Archive, Check, Cog } from 'lucide-react';
import { plazaNpcs, type PlazaNpcId } from '@/game/plazaNpcs';
import PlazaScene, { plazaBlocked, PlazaObjectLayer } from './PlazaScene';
import PlazaDialogue from './PlazaDialogue';
import PlazaAtmosphere from './PlazaAtmosphere';
import s from './PlazaWorld.module.css';
import { plazaScreenY, plazaWorldY } from '@/game/plazaProjection';

const icons = { R: Wrench, I: Search, A: Paintbrush, S: Heart, E: BriefcaseBusiness, C: Archive };
const DOOR = { x: 954, y: 560 };

export function plazaSolid(x: number, y: number) {
  return (
    plazaBlocked(x, y) ||
    (x > 752 && x < 999 && y > 463 && y < 536) ||
    plazaNpcs.some(npc => Math.abs(x - npc.x) < 24 && y > npc.y - 21 && y < npc.y + 17)
  );
}

export default function PlazaWorld({
  paused,
  reducedMotion,
  npcDecisions,
  onNpcAnswer,
  onSceneChange,
}: {
  paused: boolean;
  reducedMotion: boolean;
  npcDecisions: { npcId: PlazaNpcId; choice: number; evidenceVersion?: 1 }[];
  onNpcAnswer: (npcId: PlazaNpcId, choice: number) => void;
  onSceneChange: (scene: string) => void;
}) {
  const world = useRef<HTMLDivElement>(null);
  const layer = useRef<HTMLDivElement>(null);
  const player = useRef<HTMLDivElement>(null);
  const dot = useRef<SVGCircleElement>(null);
  const position = useRef({ x: 500, y: 570 });
  const keys = useRef(new Set<string>());
  const target = useRef<{ x: number; y: number } | null>(null);
  const [near, setNear] = useState<PlazaNpcId | 'bus' | null>(null);
  const nearRef = useRef<typeof near>(null);
  const [active, setActive] = useState<PlazaNpcId | null>(null);
  const [travelling, setTravelling] = useState(false);
  const [mapOpen, setMapOpen] = useState(false);
  const state = useRef({ paused, active, travelling });
  const unlocked = plazaNpcs.every(npc =>
    npcDecisions.some(entry => entry.npcId === npc.id && entry.evidenceVersion === 1)
  );
  const npc = plazaNpcs.find(person => person.id === active);

  useEffect(() => {
    state.current = { paused, active, travelling };
    if (paused || active || travelling) {
      keys.current.clear();
      target.current = null;
    }
  }, [paused, active, travelling]);

  useEffect(() => {
    if (!travelling) return;
    const timer = window.setTimeout(() => onSceneChange('colegio'), reducedMotion ? 100 : 850);
    return () => window.clearTimeout(timer);
  }, [travelling, reducedMotion, onSceneChange]);

  useEffect(() => {
    let frame = 0,
      last = 0;
    const clear = () => {
      keys.current.clear();
      target.current = null;
    };
    window.addEventListener('blur', clear);

    const animate = (time: number) => {
      const dt = Math.min((time - (last || time)) / 1000, 0.035);
      last = time;
      const p = position.current;
      let dx = 0,
        dy = 0;
      const oldX = p.x,
        oldY = p.y;

      if (!state.current.paused && !state.current.active && !state.current.travelling) {
        dx =
          Number(keys.current.has('d') || keys.current.has('arrowright')) -
          Number(keys.current.has('a') || keys.current.has('arrowleft'));
        dy =
          Number(keys.current.has('s') || keys.current.has('arrowdown')) -
          Number(keys.current.has('w') || keys.current.has('arrowup'));

        if (dx || dy) target.current = null;
        if (target.current) {
          dx = target.current.x - p.x;
          dy = target.current.y - p.y;
          if (Math.hypot(dx, dy) < 4) {
            target.current = null;
            dx = dy = 0;
          }
        }

        const length = Math.hypot(dx, dy);
        if (length) {
          const distance = Math.min(150 * dt, target.current ? length : Infinity);
          const nx = Math.max(20, Math.min(980, p.x + (dx / length) * distance));
          const ny = Math.max(245, Math.min(592, p.y + (dy / length) * distance));
          if (!plazaSolid(nx, p.y)) p.x = nx;
          if (!plazaSolid(p.x, ny)) p.y = ny;
          if (target.current && p.x === oldX && p.y === oldY) target.current = null;
        }
      }

      const moving = Math.hypot(p.x - oldX, p.y - oldY) > 0.01;
      if (player.current) {
        player.current.style.left = `${p.x / 10}%`;
        player.current.style.top = `${plazaScreenY(p.y) / 6.2}%`;
        player.current.style.zIndex = String(Math.round(p.y));
        player.current.dataset.moving = String(moving);
        if (moving && dx) player.current.style.setProperty('--facing', dx < 0 ? '-1' : '1');
      }

      dot.current?.setAttribute('cx', String(p.x));
      dot.current?.setAttribute('cy', String(p.y));

      const neighbors = plazaNpcs
        .map(person => ({ id: person.id, d: Math.hypot(p.x - person.x, p.y - person.y) }))
        .sort((a, b) => a.d - b.d);
      const current =
        neighbors[0]?.d < 78 ? neighbors[0].id : Math.hypot(p.x - DOOR.x, p.y - DOOR.y) < 54 ? 'bus' : null;
      if (nearRef.current !== current) {
        nearRef.current = current;
        setNear(current);
      }

      if (world.current && layer.current) {
        const w = world.current.clientWidth,
          h = world.current.clientHeight;
        const scale = w >= h ? Math.max(w / 1000, h / 620) : h / 620;
        const sw = 1000 * scale,
          sh = 620 * scale;
        layer.current.style.width = `${sw}px`;
        layer.current.style.height = `${sh}px`;
        const cx = sw <= w ? (sw - w) / 2 : Math.max(0, Math.min(sw - w, p.x * scale - w / 2));
        const cy = Math.max(0, Math.min(sh - h, p.y * scale - h / 2));
        layer.current.style.transform = `translate(${-cx}px,${-cy}px)`;
      }

      frame = requestAnimationFrame(animate);
    };

    frame = requestAnimationFrame(animate);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('blur', clear);
    };
  }, []);

  function interact() {
    if (paused || active || travelling) return;
    if (near === 'bus') {
      if (unlocked) setTravelling(true);
    } else if (near) {
      setActive(near);
    }
  }

  function close() {
    setActive(null);
    keys.current.clear();
    target.current = null;
    world.current?.focus({ preventScroll: true });
  }

  return (
    /* Outer wrapper — no isolation:isolate so position:fixed children work */
    <div className={s.worldWrapper}>
      <div
        ref={world}
        className={s.world}
        data-reduced={reducedMotion}
        tabIndex={0}
        role="region"
        aria-label="Plaza de Lima. Flechas o WASD para caminar. E para hablar con un personaje."
        onBlur={event => {
          if (!event.currentTarget.contains(event.relatedTarget)) keys.current.clear();
        }}
        onKeyDown={event => {
          if (active || paused) return;
          const key = event.key.toLowerCase();
          if (['w', 'a', 's', 'd', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright'].includes(key)) {
            event.preventDefault();
            keys.current.add(key);
          }
          if (key === 'e' && !event.repeat) {
            event.preventDefault();
            interact();
          }
        }}
        onKeyUp={event => keys.current.delete(event.key.toLowerCase())}
        onPointerDown={event => {
          if (paused || active || travelling || (event.target as Element).closest('button,[role="dialog"]')) return;
          world.current?.focus({ preventScroll: true });
          const rect = layer.current?.getBoundingClientRect();
          if (!rect) return;
          target.current = {
            x: ((event.clientX - rect.left) / rect.width) * 1000,
            y: plazaWorldY(((event.clientY - rect.top) / rect.height) * 620),
          };
        }}
      >
        <div ref={layer} className={s.layer}>
          <div className={s.ground}>
            <PlazaScene layer="ground" />
          </div>
          <div className={s.back}>
            <PlazaScene layer="back" />
          </div>
          <PlazaObjectLayer />
          <PlazaAtmosphere disabled={paused || !!active || travelling} />

          {/* NPCs with glowing floating indicators */}
          {plazaNpcs.map(person => {
            const Icon = icons[person.dimension];
            const done = npcDecisions.some(entry => entry.npcId === person.id && entry.evidenceVersion === 1);
            const isNear = near === person.id;
            const isInventor = person.id === 'inventor';

            return (
              <button
                key={person.id}
                className={s.npc}
                style={{
                  left: `${person.x / 10}%`,
                  top: `${plazaScreenY(person.y) / 6.2}%`,
                  zIndex: person.y,
                }}
                aria-label={`Hablar con ${person.name}, ${person.role}`}
                disabled={paused || !!active}
                onClick={() => {
                  if (near === person.id) setActive(person.id);
                  else {
                    target.current = { x: person.x, y: person.y + 45 };
                    world.current?.focus({ preventScroll: true });
                  }
                }}
              >
                {/* NPC Ground Shadow */}
                <span className={s.npcShadow} aria-hidden="true" />

                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={person.id === 'tecnico' ? '/game/npcs/tecnico-cutout-v2.png' : `/game/npcs/${person.sprite}.png`} alt="" draggable={false} />

                {/* Glowing floating indicator */}
                <span
                  className={`${s.floatingSignal} ${isNear ? s.signalNear : ''} ${done ? s.signalDone : ''}`}
                  aria-hidden="true"
                >
                  {done ? (
                    <Check size={14} />
                  ) : isInventor ? (
                    <Cog size={16} className={s.spinningGear} />
                  ) : (
                    <Icon size={14} />
                  )}
                  {isNear && <span className={s.eKey}>E</span>}
                </span>
              </button>
            );
          })}

          {/* Little pigeon on the pavement */}
          <div
            className={s.pigeon}
            style={{ left: '16.5%', top: `${plazaScreenY(535) / 6.2}%`, zIndex: 535 }}
            aria-hidden="true"
          >
            <span>🐦</span>
          </div>

          {/* Chaski player sprite */}
          <div
            ref={player}
            className={s.player}
            style={{ left: '50%', top: '92%' }}
            aria-label="Chaski"
          >
            <span className={s.shadow} />
            <div className={s.character}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className={s.idle} src="/game/chaski-2d.png" alt="" draggable={false} />
              <span className={s.walk} />
            </div>
          </div>
        </div>

        {travelling && <div className={s.transition} role="status">Próxima parada: Colegio Horizonte</div>}
      </div>

      {/* ── UI OVERLAY: outside .world so position:fixed works correctly ── */}

      <div className={`${s.minimap} ${mapOpen ? s.minimapExpanded : ''}`} aria-label="Minimapa de la Plaza">
        <button className={s.minimapToggle} aria-expanded={mapOpen} onClick={() => setMapOpen(open => !open)}>
          <span className={s.minimapDot} aria-hidden="true" /> {mapOpen ? 'Plaza de Lima' : 'Mapa'} <span aria-hidden="true">{mapOpen ? '−' : '+'}</span>
        </button>
        {mapOpen && <svg className={s.minimapSvg} viewBox="0 0 1000 620" role="img" aria-label="Plano de la Plaza de Lima">
          <defs><pattern id="map-stone" width="36" height="24" patternUnits="userSpaceOnUse"><rect width="36" height="24" fill="#c8b896" /><path d="M0 23H36M18 0V12M0 12H36" stroke="#aa987b" strokeWidth="2" opacity=".55" /></pattern></defs>
          <rect width="1000" height="620" fill="url(#map-stone)" />
          <path d="M0 0H1000V245H0Z" fill="#aa9777" />
          <path d="M0 245H1000" stroke="#f3e5c6" strokeWidth="10" />
          <path d="M100 310Q300 400 500 410T900 370" fill="none" stroke="#efddbb" strokeWidth="36" opacity=".9" />
          <path d="M0 35H280V235H0Z" fill="#c7985f" stroke="#6f523e" strokeWidth="8" />
          <path d="M332 26H677V236H332Z" fill="#d4b886" stroke="#7a5b42" strokeWidth="8" />
          <path d="M430 55H580V235H430Z" fill="#edcf99" stroke="#92704c" strokeWidth="5" />
          <path d="M772 35H1000V260H772Z" fill="#ae9274" stroke="#775e49" strokeWidth="8" />
          <path d="M786 62L984 232M813 62L1000 225M839 62L1000 200" stroke="#e6ce9f" strokeWidth="9" />
          <ellipse cx="500" cy="380" rx="95" ry="49" fill="#8e806b" />
          <ellipse cx="500" cy="376" rx="78" ry="38" fill="#578fa1" stroke="#eee0c0" strokeWidth="8" />
          <path d="M180 335Q260 305 348 340V394H180Z M655 335Q735 305 813 341V394H655Z" fill="#547647" stroke="#d5b98c" strokeWidth="7" />
          <path d="M255 448H325M690 448H760" stroke="#5c4836" strokeWidth="15" strokeLinecap="round" />
          <path d="M75 414H151V471H75Z" fill="#aa7143" stroke="#f2ddad" strokeWidth="6" />
          <circle cx="150" cy="290" r="19" fill="#366548" /><circle cx="302" cy="275" r="24" fill="#426b49" /><circle cx="704" cy="282" r="24" fill="#426b49" /><circle cx="830" cy="290" r="19" fill="#366548" />
          <path d="M760 480H1000V535H760Z" fill="#deb532" stroke="#1a344c" strokeWidth="8" /><path d="M773 486H990V505H773Z" fill="#213b50" />
          {plazaNpcs.map(person => <circle key={person.id} cx={person.x} cy={person.y} r="13" fill={npcDecisions.some(e => e.npcId === person.id && e.evidenceVersion === 1) ? '#8cad7b' : '#efc878'} stroke="#142f40" strokeWidth="4" />)}
          <circle ref={dot} cx="500" cy="570" r="17" fill="#f5e8d2" stroke="#174466" strokeWidth="6" />
        </svg>}
      </div>

      {/* Proximity prompt */}
      {!active && near && (
        <button className={s.prompt} onClick={interact} disabled={near === 'bus' && !unlocked}>
          {near === 'bus'
            ? unlocked
              ? '[E] Subir al Metropolitano · Colegio Horizonte ➔'
              : `Habla con las 6 personas de la plaza para abordar el bus (${plazaNpcs.filter(p => !npcDecisions.some(e => e.npcId === p.id && e.evidenceVersion === 1)).length} restantes)`
            : '[E] Hablar'}
        </button>
      )}

      {/* Dialogue overlay */}
      {npc && (
        <PlazaDialogue
          key={npc.id}
          npc={npc}
          reducedMotion={reducedMotion}
          onAnswer={choice => onNpcAnswer(npc.id, choice)}
          onClose={close}
        />
      )}
    </div>
  );
}
