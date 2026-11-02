import { plazaScreenY } from '@/game/plazaProjection';
import type { CSSProperties } from 'react';

export { plazaBlocked } from '@/game/plazaLayout';

// ── Drawable objects (world-space coordinates rendered with depth z-index) ────
// Tree and planter positions are carefully balanced so the yellow gallery on the left
// and the bus station on the right are 100% visible and unobstructed.
export const PLAZA_DRAWABLES = [
  // Central fountain & stone gardens
  { id: 'fuente',                   x: 410, y: 227, width: 180, height: 166, depth: 399, asset: 'fuente' },
  { id: 'jardin-oeste',             x: 180, y: 318, width: 168, height:  78, depth: 396, asset: 'jardin' },
  { id: 'jardin-este',              x: 655, y: 318, width: 158, height:  78, depth: 396, asset: 'jardin' },

  // Benches
  { id: 'banca-oeste',              x: 270, y: 432, width: 105, height:  58, depth: 474, asset: 'banca' },

  // Artisan / book market stall (mid-right behind students)
  { id: 'puesto',                   x: 605, y: 400, width:  95, height:  85, depth: 480, asset: 'puesto' },

  // Colonial street lamps with glowing lanterns
  { id: 'farol-oeste',              x:  56, y: 205, width:  60, height: 148, depth: 353, asset: 'farol' },
  { id: 'farol-centro',             x: 605, y: 121, width:  60, height: 148, depth: 269, asset: 'farol' },

  // Wrought-iron railings at the bottom-left foreground
  { id: 'reja-oeste',               x:   0, y: 555, width: 220, height:  45, depth: 594 },

  // Left foreground flower planter (frames the bottom-left corner nicely)
  { id: 'flores-primer-plano-oeste', x: -35, y: 559, width: 260, height:  91, depth: 610, asset: 'jardin' },

  // Background flower planters behind the main path
  { id: 'flores-fondo-oeste',        x: 252, y: 204, width:  75, height:  42, depth: 245, asset: 'jardin' },
  { id: 'flores-fondo-este',         x: 678, y: 208, width:  75, height:  42, depth: 245, asset: 'jardin' },

  // Frondose tree behind the west garden — pushed back to depth 270 so arches stay open
  { id: 'arbol-frondoso-oeste',      x: 240, y:  82, width: 110, height: 180, depth: 281, asset: 'arbol' },
  // Frondose tree behind the east garden framing the cathedral
  { id: 'arbol-frondoso-este',       x: 665, y:  78, width: 120, height: 190, depth: 290, asset: 'arbol' },

  // Tall royal palms: placed in the far background (depth 240/250) so they tower majestically
  // without blocking the gallery arches on the left or the mirador stairs on the right
  { id: 'palmera-izq',               x:  70, y: -25, width: 155, height: 320, depth: 304, asset: 'palmera' },
  { id: 'palmera-der',               x: 775, y:  -8, width: 165, height: 315, depth: 307, asset: 'palmera' },
] as const;

export type PlazaObjectId = typeof PLAZA_DRAWABLES[number]['id'];

// ── Wrought-iron railing SVG fallback ─────────────────────────────────────────
function IronRailing({ width, height }: { width: number; height: number }) {
  return (
    <>
      <path d={`M0 ${height * 0.45}h${width}`} stroke="#1a1a1a" strokeWidth="4" />
      {Array.from({ length: Math.ceil(width / 14) }, (_, i) => (
        <path
          key={i}
          d={`M${i * 14 + 7} 0 v${height * 0.42} m-3-${height * 0.35} 3-5 3 5`}
          stroke="#222"
          strokeWidth="2.5"
        />
      ))}
      <path d={`M0 ${height * 0.65}h${width}v${height * 0.35}H0Z`} fill="#7c6544" />
      {Array.from({ length: Math.ceil(width / 18) }, (_, i) => (
        <g key={`f${i}`} transform={`translate(${i * 18 + 2} ${height * 0.55})`}>
          <circle cx="5" cy="5" r="4" fill={i % 3 === 0 ? '#e63946' : i % 3 === 1 ? '#f77f00' : '#fcbf49'} />
          <circle cx="9" cy="4" r="3" fill={i % 3 === 0 ? '#d62828' : '#ffb703'} />
          <circle cx="7" cy="8" r="3.5" fill={i % 3 === 0 ? '#e63946' : '#f4a261'} />
        </g>
      ))}
    </>
  );
}

export function PlazaObject({ id }: { id: PlazaObjectId }) {
  const item = PLAZA_DRAWABLES.find(o => o.id === id)!;
  if ('asset' in item) {
    return (
      <svg viewBox={`0 0 ${item.width} ${item.height}`} width="100%" height="100%" aria-hidden="true">
        <image
          href={`/game/plaza/${item.asset}.png`}
          width={item.width}
          height={item.height}
          preserveAspectRatio="none"
        />
      </svg>
    );
  }
  return (
    <svg viewBox={`0 0 ${item.width} ${item.height}`} width="100%" height="100%" aria-hidden="true">
      <IronRailing width={item.width} height={item.height} />
    </svg>
  );
}

export function PlazaObjectLayer() {
  return (
    <>
      {PLAZA_DRAWABLES.map(item => (
        <div
          key={item.id}
          data-plaza-object={item.id}
          style={
            {
              position: 'absolute',
              left: `${item.x / 10}%`,
              top: `${(plazaScreenY(item.y + item.height) - item.height) / 6.2}%`,
              width: `${item.width / 10}%`,
              height: `${item.height / 6.2}%`,
              zIndex: item.depth,
              pointerEvents: 'none',
            } as CSSProperties
          }
        >
          <PlazaObject id={item.id} />
        </div>
      ))}
    </>
  );
}

// ── Ultra-detailed Cobblestone paving pattern with individual shading ─────────
function PavingStones() {
  const colors = ['#d8c39e', '#ecd8b2', '#cfb78f', '#f2e0be', '#c7ad83', '#dfcc9f'];
  return (
    <g>
      {Array.from({ length: 20 }, (_, row) => {
        const y = 377 + row * 12.2;
        const w = 20 + row * 2.1;
        return Array.from({ length: Math.ceil(1000 / w) + 1 }, (_, col) => {
          const x = col * w - (row % 2) * (w / 2);
          const seed = (col * 17 + row * 31) % colors.length;
          return (
            <g key={`${row}-${col}`}>
              <path
                d={`M${x + 1} ${y + 1}l${w - 3} 0.7 1 9.5-${w - 3} 0.7Z`}
                fill={colors[seed]}
                stroke="#9a8166"
                strokeWidth=".6"
              />
              {/* Warm sunset specular highlight on top stone edge */}
              <path d={`M${x + 2} ${y + 2.5}h${w - 5}`} stroke="#fff7e0" strokeWidth="1" opacity=".45" />
            </g>
          );
        });
      })}
    </g>
  );
}

// ── Main Scene Renderer (Ground, Buildings, Lighting & Shadows) ───────────────
export default function PlazaScene({ layer }: { layer: 'ground' | 'back' | 'objects' | 'front' }) {
  if (layer === 'objects' || layer === 'front') return null;

  return (
    <svg viewBox="0 0 1000 620" preserveAspectRatio="none" width="100%" height="100%" aria-hidden="true">
      <defs>
        {/* ── 4K-Style 2D Cinematic Golden-Hour Sky Gradient ── */}
        <linearGradient id="sky-cinema" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#0d1b3e" />
          <stop offset="14%"  stopColor="#182e66" />
          <stop offset="28%"  stopColor="#2b4582" />
          <stop offset="42%"  stopColor="#54528c" />
          <stop offset="56%"  stopColor="#925272" />
          <stop offset="68%"  stopColor="#cf633a" />
          <stop offset="80%"  stopColor="#ea892d" />
          <stop offset="90%"  stopColor="#f7b748" />
          <stop offset="97%"  stopColor="#fed978" />
          <stop offset="100%" stopColor="#fff0bc" />
        </linearGradient>

        {/* ── Sun Corona Radial Gradient ── */}
        <radialGradient id="sun-corona" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor="#ffffff" stopOpacity="1" />
          <stop offset="35%"  stopColor="#fff5cc" stopOpacity=".95" />
          <stop offset="65%"  stopColor="#fec84d" stopOpacity=".5" />
          <stop offset="85%"  stopColor="#f39c12" stopOpacity=".2" />
          <stop offset="100%" stopColor="#e67e22" stopOpacity="0" />
        </radialGradient>

        {/* ── Golden Volumetric God Ray Gradients ── */}
        <linearGradient id="godray-1" x1="0.8" y1="0.2" x2="0.1" y2="0.85">
          <stop offset="0%"   stopColor="#fff4b8" stopOpacity=".18" />
          <stop offset="40%"  stopColor="#fbb040" stopOpacity=".10" />
          <stop offset="100%" stopColor="#f39c12" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="godray-2" x1="0.8" y1="0.2" x2="0.3" y2="0.95">
          <stop offset="0%"   stopColor="#fff7cc" stopOpacity=".22" />
          <stop offset="50%"  stopColor="#fbb040" stopOpacity=".12" />
          <stop offset="100%" stopColor="#f39c12" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="godray-3" x1="0.8" y1="0.2" x2="0.5" y2="1.0">
          <stop offset="0%"   stopColor="#fffbe6" stopOpacity=".20" />
          <stop offset="45%"  stopColor="#f5af38" stopOpacity=".10" />
          <stop offset="100%" stopColor="#f39c12" stopOpacity="0" />
        </linearGradient>

        {/* ── Wet Stone Reflection Radial Sheen (under fountain) ── */}
        <radialGradient id="fountain-wet-reflection" cx="50%" cy="45%" r="50%">
          <stop offset="0%"   stopColor="#72e4f8" stopOpacity=".45" />
          <stop offset="35%"  stopColor="#38b6d8" stopOpacity=".30" />
          <stop offset="65%"  stopColor="#f5a623" stopOpacity=".20" />
          <stop offset="90%"  stopColor="#e8912d" stopOpacity=".08" />
          <stop offset="100%" stopColor="#c49060" stopOpacity="0" />
        </radialGradient>

        {/* ── Floor Sunset Sheen Gradient ── */}
        <linearGradient id="floor-sunset-sheen" x1="1" y1="0.5" x2="0" y2="0.5">
          <stop offset="0%"   stopColor="#fbb040" stopOpacity=".22" />
          <stop offset="50%"  stopColor="#f7931e" stopOpacity=".10" />
          <stop offset="100%" stopColor="#1a2a40" stopOpacity=".04" />
        </linearGradient>

        {/* ── Cobblestone base pattern ── */}
        <pattern id="plaza-paving" width="72" height="40" patternTransform="scale(.56)" patternUnits="userSpaceOnUse">
          <rect width="72" height="40" fill="#caa985" />
          <path d="M0 0h72M0 20h72M0 40h72M0 0v20m36-20v20m36 0v20m-54-20v20" stroke="#9a7d5b" strokeWidth="1" />
          <path d="M2 3h31v13H2Zm37 21h29v13H39Z" fill="#dfbe98" opacity=".45" />
        </pattern>

        {/* ── Soft shadow gradients ── */}
        <linearGradient id="building-ambient-shadow" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#081422" stopOpacity=".65" />
          <stop offset="100%" stopColor="#081422" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* ══════════════════════════════════════════════════════
          GROUND LAYER: HD 2D Sunset Sky, God Rays, Mountains,
          Cobblestones, Floor Reflections & Ground Shadows
          ══════════════════════════════════════════════════════ */}
      {layer === 'ground' && (
        <>
          {/* 1. Deep 4K Sunset Sky */}
          <rect width="1000" height="620" fill="url(#sky-cinema)" />

          {/* 2. Atmospheric sunset mist band across the horizon */}
          <rect x="0" y="270" width="1000" height="110" fill="#f59e38" opacity=".24" />

          {/* 3. Setting Sun with rich corona and lens flare */}
          <circle cx="830" cy="180" r="140" fill="url(#sun-corona)" />
          <circle cx="830" cy="180" r="32"  fill="#ffffff" opacity=".95" />
          <circle cx="830" cy="180" r="48"  fill="#ffe885" opacity=".60" />

          {/* 4. Cinematic Volumetric God Rays (Light Shafts) */}
          <polygon points="830,180 -50,420 -50,470" fill="url(#godray-1)" />
          <polygon points="830,180 180,480 270,510" fill="url(#godray-2)" />
          <polygon points="830,180 430,440 510,470" fill="url(#godray-3)" />
          <polygon points="830,180 640,410 710,430" fill="url(#godray-2)" />

          {/* 5. Rich Multi-Tier Cumulus Pixel Clouds */}
          {/* High-tier clouds (west) */}
          <g opacity=".85">
            <ellipse cx="140" cy="85" rx="110" ry="32" fill="#d29676" />
            <ellipse cx="210" cy="72" rx="80"  ry="25" fill="#f4caa2" />
            <ellipse cx="80"  cy="98" rx="60"  ry="20" fill="#b9786a" />
            <ellipse cx="160" cy="62" rx="65"  ry="20" fill="#feddbb" />
          </g>
          {/* Mid-tier clouds (center zenith) */}
          <g opacity=".75">
            <ellipse cx="480" cy="48" rx="90" ry="24" fill="#cf8264" />
            <ellipse cx="550" cy="38" rx="70" ry="20" fill="#f8cfa4" />
            <ellipse cx="420" cy="58" rx="55" ry="16" fill="#b5675c" />
          </g>
          {/* Golden clouds near the sun (east) */}
          <g opacity=".90">
            <ellipse cx="690" cy="75" rx="120" ry="30" fill="#f6b865" />
            <ellipse cx="760" cy="62" rx="85"  ry="24" fill="#ffe29d" />
            <ellipse cx="630" cy="88" rx="68"  ry="18" fill="#e08e42" />
            <ellipse cx="720" cy="52" rx="70"  ry="20" fill="#fff5cb" />
          </g>
          {/* Low horizon wisps */}
          <path d="M0 240 Q150 220 300 235 T600 230 T900 225 T1000 230" stroke="#fba858" strokeWidth="8" opacity=".35" fill="none" />
          <path d="M50 255 Q220 240 400 252 T800 245 T1000 248" stroke="#ffd27d" strokeWidth="6" opacity=".30" fill="none" />

          {/* 6. Distant Andean Mountain Silhouettes (Cerros de Lima / Rímac) */}
          <path
            d="M0 300 Q80 255 180 272 Q310 238 420 266 Q540 230 660 260 Q780 225 890 250 Q950 238 1000 248 L1000 374 L0 374Z"
            fill="#3e3868" opacity=".50"
          />
          <path
            d="M0 322 Q120 295 250 306 Q370 285 500 300 Q640 278 760 295 Q880 278 1000 292 L1000 374 L0 374Z"
            fill="#5e416a" opacity=".35"
          />

          {/* 7. Cobblestone Esplanade Ground */}
          <rect x="0" y="374" width="1000" height="246" fill="url(#plaza-paving)" />
          <PavingStones />

          {/* 8. Floor Directional Sunset Light Sheen */}
          <rect x="0" y="374" width="1000" height="246" fill="url(#floor-sunset-sheen)" />

          {/* 9. WET STONE REFLECTION & SPECULAR WATER SHIMMER (Under central fountain) */}
          <ellipse cx="500" cy="425" rx="145" ry="52" fill="url(#fountain-wet-reflection)" />
          {/* Wet stone specular highlights */}
          <ellipse cx="500" cy="415" rx="80" ry="18" fill="#e0f8ff" opacity=".28" />
          <path d="M440 425 Q500 420 560 425" stroke="#ffffff" strokeWidth="2.5" opacity=".4" fill="none" />
          <path d="M465 435 Q500 431 535 435" stroke="#ffe090" strokeWidth="1.8" opacity=".35" fill="none" />

          {/* 10. GROUND CAST SHADOWS (2D Depth / Ambient Occlusion) */}
          {/* Cathedral forward cast shadow */}
          <polygon points="268,374 210,412 700,412 734,374" fill="#0c1724" opacity=".25" />
          {/* Gallery building cast shadow */}
          <polygon points="0,374 135,415 135,374" fill="#0c1724" opacity=".30" />
          {/* Fountain base contact shadow */}
          <ellipse cx="500" cy="396" rx="98" ry="18" fill="#08121d" opacity=".45" />
          {/* Benches ground cast shadows */}
          <ellipse cx="322" cy="486" rx="43" ry="6" fill="#08121d" opacity=".22" />
          {/* Market stall ground shadow */}
          <ellipse cx="652" cy="483" rx="42" ry="7" fill="#08121d" opacity=".22" />
          {/* Tree and palm dappled ground shadows */}
          <ellipse cx="151" cy="385" rx="28" ry="8" fill="#08121d" opacity=".14" />
          <ellipse cx="300" cy="382" rx="24" ry="7" fill="#08121d" opacity=".13" />
          <ellipse cx="704" cy="383" rx="25" ry="7" fill="#08121d" opacity=".13" />
          <ellipse cx="831" cy="386" rx="28" ry="8" fill="#08121d" opacity=".14" />

          {/* Front stone kerb lines */}
          <path d="M0 374h1000" stroke="#f0d5b2" strokeWidth="5" />
          <path d="M0 382h1000" stroke="#bfa37b" strokeWidth="2" opacity=".7" />
          <path d="M0 556h1000" stroke="#a08060" strokeWidth="2" opacity=".6" />
        </>
      )}

      {/* ══════════════════════════════════════════════════════
          BACK LAYER: Buildings, Clean Colonial Gallery, Cathedral,
          Naturally Grounded Mirador Staircase, & Modern Metropolitano Platform
          ══════════════════════════════════════════════════════ */}
      {layer === 'back' && (
        <>
          {/* 1. LEFT: Yellow Colonial Gallery (Archways & Wooden Balconies)
                 Crisp, prominent, and completely unobstructed! */}
          <image
            href="/game/plaza/galeria.png"
            x="-40"
            y="42"
            width="340"
            height="340"
            preserveAspectRatio="none"
          />

          {/* Building left edge shadow */}
          <rect x="0" y="42" width="90" height="340" fill="url(#building-ambient-shadow)" opacity=".6" />

          {/* Authentic Peruvian Flag waving on the main gallery balcony */}
          <g transform="translate(202 78)">
            <rect x="0"  y="0" width="8" height="40" fill="#c8102e" rx="1" />
            <rect x="8"  y="0" width="8" height="40" fill="#ffffff" />
            <rect x="16" y="0" width="8" height="40" fill="#c8102e" rx="1" />
            <line x1="-3" y1="0" x2="27" y2="0" stroke="#d4a017" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="12" cy="0" r="3" fill="#ffd700" />
          </g>

          {/* 2. CENTER: Catedral de Lima — Centerpiece of the Plaza */}
          <image
            href="/game/plaza/catedral.png"
            x="268"
            y="12"
            width="466"
            height="368"
            preserveAspectRatio="xMidYMax meet"
          />
          {/* Subtle warm depth shadow behind cathedral towers */}
          <ellipse cx="500" cy="290" rx="280" ry="50" fill="#08121d" opacity=".18" />

          {/* 3. RIGHT: Grand Colonial Mirador Staircase & Terraces
                 Upper terraces climbing up in the background */}
          <image
            href="/game/plaza/mirador.png"
            x="675"
            y="142"
            width="330"
            height="150"
            preserveAspectRatio="none"
          />

          {/* Retaining stone base trim under the staircase */}
          <rect x="675" y="288" width="325" height="4" fill="#846d50" />

          {/* Independent station geometry and transparent vehicle sprite. */}
          <g transform="translate(760 312)">
            <path d="M0 110V17L20 0H240V12H25L14 27V110" fill="#23394b" stroke="#d0ae70" strokeWidth="4" />
            <path d="M16 20H240V31H16Z" fill="#304d5f" />
            <path d="M22 33H226" stroke="#f5d99b" strokeWidth="3" opacity=".8" />
            <path d="M0 122H240" stroke="#c2a479" strokeWidth="10" />
            <path d="M0 129H240" stroke="#f2cc4e" strokeWidth="4" strokeDasharray="16 7" />
            <rect x="26" y="51" width="13" height="63" rx="2" fill="#29475a" stroke="#e1bb78" strokeWidth="2" />
            <rect x="29" y="62" width="7" height="13" fill="#7cc6d5" />
            <rect x="55" y="105" width="8" height="20" rx="2" fill="#667b83" />
            <rect x="200" y="105" width="8" height="20" rx="2" fill="#667b83" />
          </g>
          <image href="/game/plaza/metropolitano-sprite-v2.png" x="748" y="425" width="310" height="119" preserveAspectRatio="xMidYMid meet" />

          {/* Garden strips along the back plaza wall */}
          <image href="/game/plaza/jardin.png" x="8"   y="336" width="220" height="50" />
          <image href="/game/plaza/jardin.png" x="325" y="338" width="88"  height="44" />
          <image href="/game/plaza/jardin.png" x="584" y="340" width="128" height="44" />

          {/* Foundation curb along the esplanade back */}
          <path d="M0 372h740v11H0Z" fill="#8c7452" />
          <path d="M0 383h740"       stroke="#e8d3b5" strokeWidth="4.5" />
        </>
      )}
    </svg>
  );
}
