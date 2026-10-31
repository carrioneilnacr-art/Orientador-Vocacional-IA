'use client';
import { useState } from 'react';
import s from './PlazaAtmosphere.module.css';
import { plazaScreenY } from '@/game/plazaProjection';

const encounters = [
  {
    id: 'fuente',
    x: 500,
    y: 372,
    label: 'Observar la fuente',
    text: 'El agua recorre varios niveles y vuelve al estanque. ¿Qué observarías para entender cómo se mantiene en movimiento?',
  },
  {
    id: 'jardin',
    x: 265,
    y: 377,
    label: 'Examinar el jardín',
    text: 'Flores, sombra y agua comparten este pequeño espacio. ¿Te gustaría diseñarlo, cuidarlo o investigar sus plantas?',
  },
  {
    id: 'banca',
    x: 278,
    y: 460,
    label: 'Descansar en la banca',
    text: 'Desde aquí puedes observar los distintos trabajos de la plaza. Tómate un momento: ¿qué actividad despertó tu curiosidad?',
  },
  {
    id: 'farol',
    x: 635,
    y: 260,
    label: 'Encender el farol',
    text: 'La luz también transforma los lugares. Diseñar, instalar y mantener la iluminación requiere ideas y trabajo en equipo.',
  },
] as const;

export default function PlazaAtmosphere({ disabled }: { disabled: boolean }) {
  const [selected, setSelected] = useState<string | null>(null);
  const [lit, setLit] = useState(false);

  return (
    <>
      {/* 4K 2D Ambient Light & Vignette Overlay */}
      <div className={s.light} aria-hidden="true" />
      <div className={s.vignette} aria-hidden="true" />

      {/* Dynamic Animated Water Ripple & Glisten for the Fountain */}
      <svg className={s.water} viewBox="0 0 180 166" aria-hidden="true">
        <g fill="none" stroke="#d3fcff" strokeWidth="1.6">
          <path className={s.stream} d="M90 20v24m-25 6q-13 21-14 50m66-50q14 20 15 50M51 99q-15 16-16 39m94-39q15 16 16 39" />
          <ellipse className={s.ripple} cx="90" cy="143" rx="49" ry="10" />
        </g>
        {Array.from({ length: 18 }, (_, i) => (
          <circle
            className={s.drop}
            key={i}
            cx={38 + ((i * 37) % 109)}
            cy={75 + ((i * 19) % 67)}
            r={i % 3 === 0 ? 1.5 : 0.8}
            fill="#e5ffff"
            style={{ animationDelay: `${i * 0.13}s` }}
          />
        ))}
      </svg>

      {/* Street Lamp Warm Glow */}
      <div className={`${s.glow} ${lit ? s.lit : ''}`} aria-hidden="true" />

      {/* Interactive Environment Inspection Nodes */}
      {encounters.map(item => (
        <button
          key={item.id}
          className={s.inspect}
          style={{
            left: `${item.x / 10}%`,
            top: `${plazaScreenY(item.y) / 6.2}%`,
            zIndex: item.y + 2,
          }}
          disabled={disabled}
          aria-label={item.label}
          title={item.label}
          onClick={() => {
            setSelected(item.id);
            if (item.id === 'farol') setLit(value => !value);
          }}
        >
          <span>◇</span>
        </button>
      ))}

      {selected && !disabled && (
        <div className={s.note} role="status">
          <strong>{encounters.find(item => item.id === selected)?.label}</strong>
          <p>{encounters.find(item => item.id === selected)?.text}</p>
          <button onClick={() => setSelected(null)}>Seguir explorando</button>
        </div>
      )}
    </>
  );
}
