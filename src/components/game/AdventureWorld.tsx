"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import styles from "./AdventureWorld.module.css";

interface AdventureWorldProps {
  onVisit: (id: string) => void;
  completed: string[];
  paused: boolean;
  reducedMotion: boolean;
  scene?: string;
  onSceneChange?: (scene: string) => void;
}

const SCENES = [{ id: "barrio", label: "Barrio de los Caminos" }, { id: "colegio", label: "Colegio Horizonte" }, { id: "malecon", label: "Malecón de las Ideas" }];
const SCENE_STATION_LABELS: Record<string, Record<string, string>> = {
  colegio: { inventos: "Laboratorio de inventos", mural: "Mural del colegio", comunidad: "Aula de encuentro", observatorio: "Huerto de ciencias" },
  malecon: { inventos: "Taller del malecón", mural: "Mural frente al mar", comunidad: "Parque del encuentro", observatorio: "Mirador de preguntas" },
};

const STATIONS = [
  { id: "inventos", label: "Taller de inventos", subtitle: "Haz que funcione", x: 205, y: 300, color: "#ffca70", number: "01" },
  { id: "mural", label: "Estudio del mural", subtitle: "Dale tu propia voz", x: 770, y: 300, color: "#f5a6b4", number: "02" },
  { id: "comunidad", label: "Casa de la comunidad", subtitle: "Conecta con otros", x: 245, y: 505, color: "#a7e4b4", number: "03" },
  { id: "observatorio", label: "Observatorio", subtitle: "Sigue la curiosidad", x: 770, y: 505, color: "#a9c9ff", number: "04" },
];
const BLOCKS = [
  { x: 115, y: 200, w: 180, h: 75 },
  { x: 680, y: 200, w: 180, h: 75 },
  { x: 155, y: 405, w: 180, h: 75 },
  { x: 680, y: 405, w: 180, h: 75 },
];
const TREES = [[52, 220], [75, 350], [50, 490], [105, 555], [375, 200], [390, 520], [895, 205], [930, 320], [900, 460], [920, 550], [630, 210], [650, 560]];

function blocked(x: number, y: number, scene: string) {
  return BLOCKS.some(b => x > b.x - 12 && x < b.x + b.w + 12 && y > b.y - 8 && y < b.y + b.h + 12)
    || (scene === "barrio" && Math.hypot(x - 492, y - 327) < 43)
    || TREES.some(([tx, ty]) => Math.hypot(x - tx, y - ty) < 17);
}

function UrbanGround({ scene }: { scene: string }) {
  const school = scene === "colegio";
  return <g>
    {school ? <>
      <path d="M0 103h1000v517H0Z" fill="#d6d4b8" />
      <path d="M0 165h1000v455H0Z" fill="#e4dcc2" />
      <path d="M0 165h1000M0 365h1000M0 565h1000M100 165v455M400 165v455M600 165v455M900 165v455" stroke="#b9bea7" strokeWidth="2" opacity=".4" />
      <rect x="278" y="65" width="444" height="106" rx="4" fill="#eacda0" />
      <path d="M269 65h462v14H269Z" fill="#a65848" />
      <path d="M278 139h444v32H278Z" fill="#c68f68" />
      {[302, 358, 414, 526, 582, 638].map(x => <g key={x}><rect x={x} y="88" width="38" height="35" rx="3" fill="#7eafb7" stroke="#f8e8bf" strokeWidth="5" /><path d={`M${x + 19} 88v35`} stroke="#f8e8bf" strokeWidth="3" /></g>)}
      <path d="M473 171v-54a27 27 0 0 1 54 0v54" fill="#6d7975" />
      <path d="M485 171v-42h30v42" fill="#a9c7be" />
      <rect x="424" y="66" width="152" height="22" rx="4" fill="#faf0d5" />
      <text x="500" y="81" textAnchor="middle" fill="#466367" fontSize="11" fontWeight="800" letterSpacing="2">HORIZONTE</text>
      <path d="M545 159V29" stroke="#84918c" strokeWidth="4" /><path d="M547 30q15 7 29 0t28 0v37q-14-7-28 0t-29 0Z" fill="#f7eee1" /><path d="M547 30q7 3 18 2v37q-10 1-18-2Zm39 1q9-5 18-1v37q-10-4-18 0Z" fill="#c87569" />
      <rect x="358" y="271" width="288" height="225" rx="6" fill="#88a59a" />
      <rect x="374" y="285" width="256" height="196" rx="3" stroke="#f2ead2" strokeWidth="2" />
      <path d="M374 383h256M374 334h43v98h-43m256-98h-43v98h43" stroke="#f2ead2" strokeWidth="2" /><circle cx="502" cy="383" r="38" stroke="#f2ead2" strokeWidth="2" />
      <path d="M362 328v109m280-109v109" stroke="#657f78" strokeWidth="6" />
      <circle cx="518" cy="453" r="7" fill="#eee9d8" /><path d="m514 448 7 2 1 6-6 3-5-5Z" fill="#6f7e72" />
    </> : <>
      <path d="M0 81h1000v189H0Z" fill="#70b5c4" />
      <path d="M0 98h1000M0 140h1000" stroke="#aed9da" strokeWidth="2" opacity=".5" />
      <g className={styles.waves} stroke="#d3ece5" strokeWidth="3" opacity=".7"><path d="M20 170q60-14 120 0t120 0m120-23q60-14 120 0t120 0m150 35q55-14 110 0t110 0" /></g>
      <path d="M0 225q100-33 220-9t220 0 220 0 340-14v418H0Z" fill="#c5ad87" />
      <path d="M0 245q100-33 220-9t220 0 220 0 340-14v398H0Z" fill="#9cb482" />
      <path d="M0 246q100-33 220-9t220 0 220 0 340-14" stroke="#f1d9ad" strokeWidth="24" />
      <path d="M0 226q100-33 220-9t220 0 220 0 340-14" stroke="#7c8c7c" strokeWidth="3" />
      {Array.from({ length: 20 }, (_, i) => <path key={i} d={`M${i * 53} ${221 + Math.sin(i / 3) * 8}v19`} stroke="#7c8c7c" strokeWidth="3" />)}
      <g transform="translate(484 211)"><ellipse cy="11" rx="49" ry="15" fill="#718d75" opacity=".4" /><path d="m-28 0 12-117h32L28 0Z" fill="#f8eed8" /><path d="m-24-38 4-31h40l4 31Z" fill="#b77564" /><rect x="-19" y="-138" width="38" height="24" rx="3" fill="#6c9da4" stroke="#eadfbe" strokeWidth="4" /><path d="m-25-139 25-19 25 19Z" fill="#597d82" /><rect x="-7" y="-25" width="14" height="25" rx="7" fill="#70887c" /><path d="M-18-127h36" stroke="#f8eac7" strokeWidth="2" /></g>
      <g className={styles.gulls} stroke="#496f7b" strokeWidth="2" strokeLinecap="round"><path d="M120 89q8-10 16 0 8-10 16 0m577 20q8-10 16 0 8-10 16 0m-44-42q5-7 10 0 5-7 10 0" /></g>
      <path d="M340 380q145-35 311 7v141q-152 27-311-15Z" fill="#83a977" />
      <path d="M350 389q137-35 290 6v120q-147 22-290-15Z" fill="url(#chaski-grass-texture)" />
    </>}
    <path d="M205 305c110 0 151 66 284 66 121 0 178-61 281-61M245 505c90-27 166-87 244-94 105-9 180 70 281 94M490 370v-135" stroke={school ? "#c9c8ac" : "#dfc994"} strokeWidth="29" strokeLinecap="round" opacity={school ? ".45" : "1"} />
    <g fill="#788c8b" opacity=".8">{[25, 67, 119, 805, 856, 914].map((x, i) => <g key={x}><rect x={x} y={82 - i % 3 * 13} width="33" height="72" /><path d={`M${x + 7} ${90 - i % 3 * 13}h5m7 0h5m-17 13h5m7 0h5m-17 13h5m7 0h5`} stroke="#c6d4c6" strokeWidth="4" /></g>)}</g>
  </g>;
}

function Tree({ x, y, index }: { x: number; y: number; index: number }) {
  return <g transform={`translate(${x} ${y})`}>
    <ellipse cy="12" rx="27" ry="11" fill="#255f42" opacity=".17" />
    <path d="M-5 0h10v20H-5z" fill="#9a7051" />
    <path d="M0-65C-39-48-37-4-17 2c10 6 36 3 43-11C42-32 24-58 0-65Z" fill={index % 2 ? "#3c8960" : "#367d56"} />
    <path d="M-11-49c-17 13-17 30-10 34 5 3 9-8 13-16 5-9 14-13 11-18-3-5-9-3-14 0Z" fill="#66a66a" opacity=".7" />
  </g>;
}

function Workshop({ x, y, roof, kind, lit }: { x: number; y: number; roof: string; kind: string; lit: boolean }) {
  return <g transform={`translate(${x} ${y})`}>
    <ellipse cx="90" cy="81" rx="106" ry="15" fill="#235942" opacity=".14" />
    <rect width="180" height="76" rx="6" fill="#f2e4bb" />
    <path d="M180 0v76h-16V0" fill="#d6c79e" />
    <path d="M-12 3 15-45h150l28 48Z" fill={roof} />
    <path d="M15-45h150l-9 13H8Z" fill="#fff" opacity=".12" />
    <path d="M4-25h174M-3-10h187M35-44 19 1M73-44 68 1M112-44l3 45M150-44l15 45" stroke="#173e3e" opacity=".17" strokeWidth="3" />
    <rect x="74" y="22" width="36" height="54" rx="17" fill="#725b4c" />
    <path d="M80 76V40a12 12 0 0 1 24 0v36" fill="#4f5044" />
    {[19, 127].map(wx => <g key={wx}><rect x={wx} y="22" width="32" height="28" rx="4" fill={lit ? "#ffe6a1" : "#8dbfc0"} stroke="#b1996b" strokeWidth="4" /><path d={`M${wx + 16} 22v28M${wx} 36h32`} stroke="#f6e6bc" strokeWidth="3" /></g>)}
    {kind === "inventos" && <g transform="translate(38 -48)"><rect x="-8" y="-26" width="19" height="31" fill="#c9ae87" /><path d="M-11-27h25v7h-25" fill="#e1c69d" /></g>}
    {kind === "mural" && <><rect x="-30" y="35" width="26" height="36" rx="3" fill="#fff0d2" /><path d="m-27 61 8-13 7 8 5-10v20h-20" fill="#f2889f" /><circle cx="-10" cy="44" r="4" fill="#edbc62" /></>}
    {kind === "comunidad" && <path d="M-12 5h205v13H-12z" fill="#80a37c" />}
    {kind === "observatorio" && <g transform="translate(89 -42)"><path d="M-25 0a25 25 0 0 1 50 0" fill="#abc7ce" /><path d="M0-24v23" stroke="#688e9e" strokeWidth="4" /><path d="m3-18 23-15 7 10-26 14Z" fill="#42677a" /><circle cx="29" cy="-28" r="7" fill="#bde4e5" /></g>}
    {lit && kind === "mural" && <g transform="translate(187 10)">
      <path d="m-6 65 8-55 29 55" stroke="#9b7452" strokeWidth="4" strokeLinecap="round" />
      <rect x="-13" y="1" width="47" height="49" rx="3" fill="#fff0cf" stroke="#bd956d" strokeWidth="3" />
      <circle cx="21" cy="13" r="7" fill="#edb752" />
      <path d="m-10 40 14-24 13 18 15-12v24h-42Z" fill="#5d9d94" />
      <path d="m-10 44 15-14 13 14 14-8v10h-42Z" fill="#e58d9e" />
      <circle cx="-18" cy="63" r="5" fill="#eb93a8" /><circle cx="-6" cy="64" r="5" fill="#e7bd64" /><circle cx="6" cy="64" r="5" fill="#83bbb0" />
    </g>}
    {lit && kind === "comunidad" && <g>
      <path d="M-30-8Q90 33 211-8" stroke="#7b6b50" strokeWidth="2" />
      {[0, 1, 2, 3, 4, 5, 6].map(i => <path key={i} d={`m${-23 + i * 35} ${-6 + Math.sin(i / 6 * Math.PI) * 16} 19 2-10 17Z`} fill={["#edc76d", "#76b4a2", "#dd9d9e"][i % 3]} />)}
      <g transform="translate(-27 70)"><rect x="-11" y="-8" width="30" height="9" rx="2" fill="#bf8d5a" /><path d="M-6 0v9m20-9v9" stroke="#7e6246" strokeWidth="3" /><circle cx="0" cy="-13" r="6" fill="#e8b97d" /><path d="M-7-7h14v7H-7Z" fill="#589e94" /></g>
      <g transform="translate(199 67)"><rect x="-13" y="-6" width="32" height="9" rx="2" fill="#bf8d5a" /><path d="M-8 3v9m22-9v9" stroke="#7e6246" strokeWidth="3" /><circle cx="4" cy="-12" r="6" fill="#bb875d" /><path d="M-3-6h14v7H-3Z" fill="#cc8394" /></g>
    </g>}
    {lit && kind === "observatorio" && <g transform="translate(0 77)">
      <path d="M-25-1Q-9-16 11-7L48 0l-5 21-66-3Z" fill="#6b9a58" />
      <path d="M137 3q34-18 61-7l9 21-65 5Z" fill="#6b9a58" />
      {[-16, 4, 25, 149, 171, 190].map((gx, i) => <g key={gx} transform={`translate(${gx} ${i % 2 * 7})`}><path d="M0 6V-8m0 6-7-5m7 9 7-5" stroke="#42774b" strokeWidth="2" strokeLinecap="round" /><circle cy="-10" r="5" fill={i % 2 ? "#e9c76c" : "#f0b4a3"} /><circle cy="-10" r="2" fill="#aa7e4f" /></g>)}
    </g>}
    <path d="M65 79h55l8 8H57Z" fill="#b8aa84" />
  </g>;
}

export default function AdventureWorld({ onVisit, completed, paused, reducedMotion, scene: providedScene, onSceneChange }: AdventureWorldProps) {
  const [localScene, setLocalScene] = useState("barrio");
  const scene = SCENES.some(item => item.id === providedScene) ? providedScene! : localScene;
  const sceneLabel = SCENES.find(item => item.id === scene)!.label;
  const worldRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<HTMLDivElement>(null);
  const miniPlayerRef = useRef<SVGCircleElement>(null);
  const position = useRef({ x: 488, y: 415 });
  const target = useRef<{ x: number; y: number } | null>(null);
  const keys = useRef(new Set<string>());
  const viewport = useRef({ width: 1000, height: 620, sceneWidth: 1000, sceneHeight: 620 });
  const camera = useRef({ x: 0, y: 0 });
  const latest = useRef({ paused, reducedMotion, onVisit, scene });

  useEffect(() => { latest.current = { paused, reducedMotion, onVisit, scene }; if (paused) { keys.current.clear(); target.current = null; } }, [paused, reducedMotion, onVisit, scene]);
  useEffect(() => { position.current = { x: 488, y: 415 }; target.current = null; keys.current.clear(); }, [scene]);

  useEffect(() => {
    const world = worldRef.current;
    const layer = sceneRef.current;
    if (!world || !layer) return;
    function resize() {
      if (!world || !layer) return;
      const width = world.clientWidth;
      const height = world.clientHeight;
      const sceneWidth = Math.max(width, height * 1000 / 620);
      const sceneHeight = sceneWidth * 620 / 1000;
      viewport.current = { width, height, sceneWidth, sceneHeight };
      layer.style.width = `${sceneWidth}px`;
      layer.style.height = `${sceneHeight}px`;
      camera.current = {
        x: Math.max(0, Math.min(sceneWidth - width, position.current.x / 1000 * sceneWidth - width / 2)),
        y: Math.max(0, Math.min(sceneHeight - height, position.current.y / 620 * sceneHeight - height / 2)),
      };
      layer.style.transform = `translate(${-camera.current.x}px, ${-camera.current.y}px)`;
    }
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(world);
    return () => observer.disconnect();
  }, []);

  function changeScene(next: string) {
    if (paused) return;
    setLocalScene(next);
    onSceneChange?.(next);
    keys.current.clear();
    target.current = null;
    worldRef.current?.focus({ preventScroll: true });
  }

  useEffect(() => {
    let frame = 0;
    let lastTime = 0;
    function animate(time: number) {
      const dt = Math.min((time - (lastTime || time)) / 1000, .035);
      lastTime = time;
      let dx = 0;
      let dy = 0;
      const held = keys.current;
      if (!latest.current.paused) {
        dx = Number(held.has("arrowright") || held.has("d")) - Number(held.has("arrowleft") || held.has("a"));
        dy = Number(held.has("arrowdown") || held.has("s")) - Number(held.has("arrowup") || held.has("w"));
        if (dx || dy) target.current = null;
        if (target.current) {
          dx = target.current.x - position.current.x;
          dy = target.current.y - position.current.y;
          if (Math.hypot(dx, dy) < 5) { target.current = null; dx = 0; dy = 0; }
        }
        const length = Math.hypot(dx, dy);
        if (length) {
          const distance = Math.min(175 * dt, target.current ? length : Infinity);
          const nx = Math.max(30, Math.min(970, position.current.x + dx / length * distance));
          const ny = Math.max(172, Math.min(575, position.current.y + dy / length * distance));
          if (!blocked(nx, position.current.y, latest.current.scene)) position.current.x = nx;
          if (!blocked(position.current.x, ny, latest.current.scene)) position.current.y = ny;
        }
      }
      if (playerRef.current) {
        const nearbyStation = STATIONS.some(station => Math.hypot(station.x - position.current.x, station.y - position.current.y) < 118);
        playerRef.current.style.left = `${position.current.x / 10}%`;
        playerRef.current.style.top = `${position.current.y / 6.2}%`;
        playerRef.current.classList.toggle(styles.walking, Boolean(dx || dy) && !latest.current.reducedMotion);
        playerRef.current.classList.toggle(styles.idle, !dx && !dy && !latest.current.paused);
        playerRef.current.classList.toggle(styles.nearby, nearbyStation && !latest.current.paused);
        if (dx) playerRef.current.style.setProperty("--facing", dx < 0 ? "-1" : "1");
      }
      if (miniPlayerRef.current) { miniPlayerRef.current.setAttribute("cx", String(position.current.x)); miniPlayerRef.current.setAttribute("cy", String(position.current.y)); }
      if (sceneRef.current) {
        const view = viewport.current;
        const aimX = Math.max(0, Math.min(view.sceneWidth - view.width, position.current.x / 1000 * view.sceneWidth - view.width / 2));
        const aimY = Math.max(0, Math.min(view.sceneHeight - view.height, position.current.y / 620 * view.sceneHeight - view.height / 2));
        const smoothing = latest.current.reducedMotion ? 1 : Math.min(1, dt * 10);
        camera.current.x += (aimX - camera.current.x) * smoothing;
        camera.current.y += (aimY - camera.current.y) * smoothing;
        sceneRef.current.style.transform = `translate(${-camera.current.x}px, ${-camera.current.y}px)`;
      }
      frame = requestAnimationFrame(animate);
    }
    const clear = () => { keys.current.clear(); target.current = null; };
    window.addEventListener("blur", clear);
    frame = requestAnimationFrame(animate);
    return () => { cancelAnimationFrame(frame); window.removeEventListener("blur", clear); };
  }, []);

  return <div
    ref={worldRef}
    className={`${styles.world} ${reducedMotion ? styles.still : ""}`}
    tabIndex={0}
    role="region"
    aria-label={`${sceneLabel}. Muévete con las flechas o WASD, toca un camino o selecciona un taller. Pulsa E cerca de un taller para entrar.`}
    onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) { keys.current.clear(); target.current = null; } }}
    onKeyDown={event => {
      if (paused || event.target !== event.currentTarget) return;
      const key = event.key.toLowerCase();
      if (["arrowup", "arrowdown", "arrowleft", "arrowright", "w", "a", "s", "d"].includes(key)) { event.preventDefault(); keys.current.add(key); }
      if (key === "e" && !event.repeat) {
        const nearby = STATIONS.find(station => Math.hypot(station.x - position.current.x, station.y - position.current.y) < 130);
        if (nearby) { event.preventDefault(); onVisit(nearby.id); }
      }
    }}
    onKeyUp={event => keys.current.delete(event.key.toLowerCase())}
    onPointerDown={event => {
      if (paused || (event.target as Element).closest("button, [data-map-overlay]")) return;
      event.currentTarget.focus({ preventScroll: true });
      const bounds = sceneRef.current?.getBoundingClientRect();
      if (!bounds) return;
      target.current = { x: (event.clientX - bounds.left) / bounds.width * 1000, y: (event.clientY - bounds.top) / bounds.height * 620 };
    }}
  >
    <div ref={sceneRef} className={styles.sceneLayer} data-world-scene={scene}>
    <svg className={styles.landscape} viewBox="0 0 1000 620" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="chaski-sky" x2="0" y2="1"><stop stopColor="#b6dce3" /><stop offset="1" stopColor="#eff3cf" /></linearGradient>
        <linearGradient id="chaski-grass" x2="0" y2="1"><stop stopColor="#a6bf7a" /><stop offset="1" stopColor="#7d9f66" /></linearGradient>
        <linearGradient id="chaski-river" x2="1" y2="1"><stop stopColor="#88d4cf" /><stop offset="1" stopColor="#55aab4" /></linearGradient>
        <pattern id="chaski-grass-texture" width="40" height="37" patternUnits="userSpaceOnUse"><path d="m5 23 2-4 2 4m17-14 2-3 2 3" stroke="#4d7951" strokeWidth="1.4" opacity=".19" /><circle cx="18" cy="29" r="1" fill="#dbe8a7" opacity=".55" /></pattern>
      </defs>
      <path fill="url(#chaski-sky)" d="M0 0h1000v620H0z" />
      <circle cx="820" cy="60" r="35" fill="#fff4cb" opacity=".8" />
      <g className={styles.clouds} fill="#edf7e7" opacity=".65"><path d="M87 42c3-20 26-22 36-7 13-12 34-5 35 10H70c0-10 9-15 17-3Z" /><path d="M617 61c1-17 25-20 34-6 16-15 40-6 43 11h-92c0-8 8-14 15-5Z" /></g>
      {scene === "barrio" ? <g>
      <path d="M-30 157 80 90l100 59 112-81 119 72 100-43 145 54 111-77 121 64 142-46v145H-30Z" fill="#b3b6a1" />
      <path d="m-20 198 141-68 110 73 125-45 92 40 110-55 134 66 100-59 160 41 78-23v111H-20Z" fill="#8d9e89" />
      <path d="M0 210c120-39 178-15 283-25 148-14 204-34 340-12 132 21 237-11 377 21v426H0Z" fill="url(#chaski-grass)" />
      <path d="M0 210c120-39 178-15 283-25 148-14 204-34 340-12 132 21 237-11 377 21v426H0Z" fill="url(#chaski-grass-texture)" />
      <path d="M575 171c-65 47 101 91 47 163-36 48-33 98-12 139 24 46 5 88-40 147h89c35-64 42-104 15-156-19-35-21-66 9-106 70-93-85-138-42-181Z" fill="#c1ce94" />
      <path d="M584 170c-59 49 104 92 48 169-36 49-31 94-10 134 25 50 1 100-39 147h64c37-58 44-101 15-152-23-42-19-72 10-113 65-91-86-137-40-181Z" fill="url(#chaski-river)" />
      <g stroke="#d3f4e3" opacity=".5" strokeWidth="3" strokeLinecap="round"><path d="m602 231 17 9m16 44 9 13m-23 70-8 19m21 136-3 17m-11 41-11 17" /></g>
      <path d="M205 305c110 0 151 66 284 66 121 0 178-61 281-61M245 505c90-27 166-87 244-94 105-9 180 70 281 94M490 370v-135" stroke="#789157" strokeWidth="48" strokeLinecap="round" opacity=".32" />
      <path d="M205 305c110 0 151 66 284 66 121 0 178-61 281-61M245 505c90-27 166-87 244-94 105-9 180 70 281 94M490 370v-135" stroke="#dfc994" strokeWidth="39" strokeLinecap="round" />
      <path d="M208 303c110 0 150 65 281 65 121 0 178-61 281-61M245 502c90-27 166-87 244-94 105-9 180 70 281 94" stroke="#e9d6a4" strokeWidth="24" strokeLinecap="round" />
      <g transform="rotate(-12 633 415)"><rect x="591" y="388" width="85" height="57" rx="3" fill="#8d6748" />{[0, 1, 2, 3, 4, 5, 6].map(i => <path key={i} d={`M${596 + i * 12} 391v50`} stroke="#c49a66" strokeWidth="9" />)}<path d="M589 389h88M589 444h88" stroke="#654e3b" strokeWidth="6" /></g>
      <g transform="translate(0 111)" fill="#d8c7ab"><path d="M0 57V-8h36v65m6 0V-26h46v83m8 0V0h31v57m748 0V-18h35v75m6 0V-38h42v95m6 0V-5h36v62" /><path d="M5-8h26V4H5m44-30h32v12H49m833-4h22v12h-22m40-32h30v12h-30" fill="#876f5e" /></g>
      </g> : <UrbanGround scene={scene} />}
      <Workshop x={115} y={200} roof="#ba7950" kind="inventos" lit={completed.includes("inventos")} />
      <Workshop x={680} y={200} roof="#b86f7c" kind="mural" lit={completed.includes("mural")} />
      <Workshop x={155} y={405} roof="#578e75" kind="comunidad" lit={completed.includes("comunidad")} />
      <Workshop x={680} y={405} roof="#64859f" kind="observatorio" lit={completed.includes("observatorio")} />
      {scene === "barrio" && <g transform="translate(492 327)"><ellipse cy="12" rx="49" ry="25" fill="#537a59" opacity=".3" /><ellipse rx="42" ry="22" fill="#d8cba9" /><ellipse cy="-4" rx="34" ry="16" fill="#71b9bb" /><ellipse cy="-5" rx="25" ry="11" fill="#a5d4cd" /><path d="M-6-5v-35h12v35" fill="#d6d9bb" /><ellipse cy="-39" rx="18" ry="8" fill="#dce3c3" /><path d="M0-44v-17" stroke="#c0e5de" strokeWidth="4" strokeLinecap="round" /><circle cy="-65" r="5" fill="#e0f0cd" /></g>}
      <path d="M320 187Q492 247 665 183" stroke="#8d8564" strokeWidth="2" />
      {Array.from({ length: 12 }, (_, i) => { const x = 334 + i * 27; const y = 188 + Math.sin((i + .5) / 12 * Math.PI) * 27; return <path key={i} d={`M${x} ${y}l14 3-9 18Z`} fill={["#e7b36f", "#c98083", "#67a99e", "#f0db98"][i % 4]} />; })}
      {TREES.map(([x, y], i) => <Tree key={i} x={x} y={y} index={i} />)}
      {[[342, 290], [394, 452], [849, 350], [128, 381], [824, 563], [545, 545], [452, 240]].map(([x, y], i) => <g key={i} transform={`translate(${x} ${y})`}><path d="M0 0v9m-5-3 5 3 5-3" stroke="#587e4b" strokeWidth="2" /><circle r="4" fill={i % 2 ? "#f1c86e" : "#f5e7b0"} /><circle r="1.5" fill="#a97b47" /></g>)}
      <g transform="translate(487 516)"><rect x="-3" y="-16" width="6" height="32" rx="2" fill="#9a7653" /><path d="M-31-22h61l9 10-9 10h-61Z" fill="#ead6a6" /><path d="m-9-13 16 0m-4-4 5 4-5 4" stroke="#8b7857" strokeWidth="2" /></g>
      {completed.length === 4 && <g className={styles.celebration} fill="#ffe6a3">{[0,1,2,3,4,5,6,7].map(i => <circle key={i} cx={350 + i * 43} cy={245 + i % 3 * 19} r="3" />)}</g>}
      <g className={styles.neighbors}>
        {[[337, 347, "#b57c85"], [846, 380, "#578a93"], [440, 552, "#c99b62"]].map(([x, y, color], i) => <g key={i} transform={`translate(${x} ${y})`}><ellipse cy="12" rx="9" ry="4" fill="#476345" opacity=".25" /><path d="M-4 6v8m8-8v8" stroke="#53655c" strokeWidth="3" /><path d="M-7-2q7-7 14 0l-1 9H-6Z" fill={String(color)} /><circle cy="-9" r="6" fill={i % 2 ? "#bb8a65" : "#e4b68b"} /><path d="M-6-11q0-8 9-5l3 5" fill="#5c5c4c" /></g>)}
      </g>
    </svg>
    {STATIONS.map(station => <button
      key={station.id}
      type="button"
      disabled={paused}
      className={`${styles.station} ${completed.includes(station.id) ? styles.completed : ""}`}
      style={{ left: `${station.x / 10}%`, top: `${station.y / 6.2}%`, "--station-color": station.color } as CSSProperties}
      onClick={() => onVisit(station.id)}
      onFocus={() => { position.current = { x: station.x, y: station.y }; target.current = null; }}
      aria-label={`${SCENE_STATION_LABELS[scene]?.[station.id] ?? station.label}. ${station.subtitle}.${completed.includes(station.id) ? " Actividad completada. Puedes volver a explorar." : " Entrar a la actividad."}`}
    ><span className={styles.marker}>{completed.includes(station.id) ? <svg viewBox="0 0 20 20" aria-hidden="true"><path d="m4 10 4 4 8-8" /></svg> : station.number}</span><span className={styles.stationLabel}>{SCENE_STATION_LABELS[scene]?.[station.id] ?? station.label}<small>{station.subtitle}</small></span></button>)}
    <div ref={playerRef} className={styles.player} style={{ left: "48.8%", top: "66.935%" }} aria-hidden="true"><span className={styles.playerShadow} /><span className={styles.character}>{/* The idle pose and the dedicated four-frame walking sheet switch with movement. */}{/* eslint-disable-next-line @next/next/no-img-element */}<img src="/game/chaski-2d.png" alt="" draggable={false} className={`${styles.sprite} ${styles.idleSprite}`} /><span className={styles.walkSprite} /></span><svg className={styles.inspectMap} viewBox="0 0 40 30"><path d="m2 7 12-4 12 4 12-4v21l-12 4-12-4-12 4Z" fill="#ecddb1" stroke="#927e54" strokeWidth="1.5" /><path d="M14 3v21M26 7v21" stroke="#c5ad77" strokeWidth="1.5" /><path d="m6 19 8-9 11 10 7-8" fill="none" stroke="#6eaaa0" strokeWidth="2" /></svg><span className={styles.interactPrompt}>E · Explorar</span><span className={styles.you}>TÚ</span></div>
    </div>
    <div className={styles.navigation} data-map-overlay>
      <div className={styles.miniMap} aria-label={`Minimapa de ${sceneLabel}`} role="img">
        <div className={styles.miniHeading}><span>MAPA LOCAL</span><span>N ↑</span></div>
        <svg viewBox="0 0 1000 620" aria-hidden="true"><rect width="1000" height="620" rx="30" fill={scene === "colegio" ? "#c9c7ad" : "#8ba275"} />{scene === "malecon" ? <path d="M0 0h1000v190H0Z" fill="#76b4c1" /> : scene === "barrio" ? <path d="M580 0q-60 150 50 240t-10 380h60q65-270-10-380T650 0" fill="#76b4c1" /> : <rect x="358" y="271" width="288" height="225" fill="#78988a" />}<path d="M205 305 490 380l280-80M245 505l245-95 280 95" stroke="#dfcea5" strokeWidth="38" strokeLinecap="round" />{STATIONS.map(item => <rect key={item.id} x={item.x - 54} y={item.y - 91} width="108" height="65" rx="8" fill={completed.includes(item.id) ? "#c7e3a8" : item.color} />)}<circle ref={miniPlayerRef} cx="488" cy="415" r="24" fill="#fff7cd" stroke="#235a61" strokeWidth="13" /></svg>
        <span className={styles.miniCaption}>{sceneLabel}<small>Lima imaginada</small></span>
      </div>
      <nav className={styles.sceneExits} aria-label="Viajar a otro escenario">
        {SCENES.filter(item => item.id !== scene).map(item => <button key={item.id} type="button" disabled={paused} onClick={() => changeScene(item.id)}><svg viewBox="0 0 20 20" aria-hidden="true"><path d="M3 10h13m-5-5 5 5-5 5" /></svg><span>{item.id === "barrio" ? "Ir al barrio" : item.id === "colegio" ? "Ir al colegio" : "Ir al malecón"}</span></button>)}
      </nav>
    </div>
  </div>;
}
