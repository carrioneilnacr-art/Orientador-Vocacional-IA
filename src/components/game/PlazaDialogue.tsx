'use client';

import { useEffect, useRef, useState } from 'react';
import {
  Wrench,
  Search,
  Paintbrush,
  Heart,
  BriefcaseBusiness,
  Archive,
  Cog,
  X,
  ArrowRight,
} from 'lucide-react';
import { plazaNpcs, type PlazaChoiceIcon } from '@/game/plazaNpcs';
import styles from './PlazaWorld.module.css';

type Npc = typeof plazaNpcs[number];

const iconMap: Record<PlazaChoiceIcon, React.ComponentType<{ size?: number; className?: string }>> = {
  wrench: Wrench,
  search: Search,
  brush: Paintbrush,
  heart: Heart,
  briefcase: BriefcaseBusiness,
  archive: Archive,
  gear: Cog,
};

export default function PlazaDialogue({
  npc,
  reducedMotion,
  onAnswer,
  onClose,
}: {
  npc: Npc;
  reducedMotion: boolean;
  onAnswer: (choice: number) => void;
  onClose: () => void;
}) {
  const [answer, setAnswer] = useState<number | null>(null);
  const [selected, setSelected] = useState(0);
  const [visible, setVisible] = useState(0);
  const panel = useRef<HTMLDivElement>(null);

  const text = answer === null ? npc.question : npc.reactions[answer];
  const finished = reducedMotion || visible >= text.length;

  useEffect(() => {
    panel.current?.focus();
  }, []);

  useEffect(() => {
    setVisible(0);
    if (reducedMotion) return;
    const timer = window.setInterval(() => {
      setVisible(count => Math.min(count + 1, text.length));
    }, 25);
    return () => window.clearInterval(timer);
  }, [text, reducedMotion]);

  function choose(index: number) {
    if (answer !== null) return;
    onAnswer(index);
    setAnswer(index);
  }

  return (
    <div
      ref={panel}
      tabIndex={-1}
      className={styles.dialogueBox}
      role="dialog"
      aria-modal="true"
      aria-label={`Conversación con ${npc.name}`}
      onKeyDown={event => {
        event.stopPropagation();
        if (event.key === 'Escape') {
          event.preventDefault();
          onClose();
          return;
        }
        if (event.key === 'Tab') {
          const buttons = Array.from(panel.current?.querySelectorAll<HTMLButtonElement>('button:not(:disabled)') ?? []);
          if (!buttons.length) return;
          const index = buttons.indexOf(document.activeElement as HTMLButtonElement);
          event.preventDefault();
          buttons[(index + (event.shiftKey ? buttons.length - 1 : 1)) % buttons.length]?.focus();
          return;
        }
        if (['e', 'E', ' ', 'Enter'].includes(event.key)) {
          event.preventDefault();
          if (event.repeat) return;
          if (!finished) setVisible(text.length);
          else if (answer !== null) onClose();
          else choose(selected);
          return;
        }
        if (finished && answer === null) {
          if (event.key === '1') {
            event.preventDefault();
            choose(0);
            return;
          }
          if (event.key === '2') {
            event.preventDefault();
            choose(1);
            return;
          }
          if (event.key === '3') {
            event.preventDefault();
            choose(2);
            return;
          }
          if (['ArrowLeft', 'ArrowUp'].includes(event.key)) {
            event.preventDefault();
            setSelected(i => (i + 2) % 3);
            return;
          }
          if (['ArrowRight', 'ArrowDown'].includes(event.key)) {
            event.preventDefault();
            setSelected(i => (i + 1) % 3);
            return;
          }
        }
      }}
    >
      {/* Decorative Golden Corner Notches (Pixel RPG style) */}
      <span className={styles.cornerTL} aria-hidden="true" />
      <span className={styles.cornerTR} aria-hidden="true" />
      <span className={styles.cornerBL} aria-hidden="true" />
      <span className={styles.cornerBR} aria-hidden="true" />

      {/* Left Column: Portrait and Nameplate */}
      <div className={styles.portraitContainer}>
        <div className={styles.portraitFrame}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={npc.id === 'tecnico' ? '/game/npcs/tecnico-cutout-v2.png' : `/game/npcs/${npc.sprite}.png`} className={styles.portraitImg} alt="" />
        </div>
        <div className={styles.nameBadge}>{npc.name}</div>
      </div>

      {/* Right Column: Dialogue Text and 3 Choices */}
      <div className={styles.dialogueBody}>
        <div className={styles.dialogueHeader}>
          <span className={styles.roleSubtitle}>{npc.role}</span>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Cerrar conversación">
            <X size={18} />
          </button>
        </div>

        <p className={styles.dialogueText} aria-label={text}>
          {reducedMotion ? text : text.slice(0, visible)}
          {!finished && <span className={styles.blockCursor} aria-hidden="true">█</span>}
        </p>

        {!finished && (
          <button className={styles.skipBtn} onClick={() => setVisible(text.length)}>
            Mostrar todo · [E]
          </button>
        )}

        {finished && answer === null && (
          <div className={styles.choicesRow} role="group" aria-label="Tu respuesta">
            {npc.choices.map((choice, index) => {
              const iconKey = npc.choiceIcons?.[index] ?? 'search';
              const Icon = iconMap[iconKey] || Search;
              const isSelected = selected === index;
              return (
                <button
                  key={choice}
                  className={`${styles.choiceButton} ${isSelected ? styles.choiceSelected : ''}`}
                  onFocus={() => setSelected(index)}
                  onPointerEnter={() => setSelected(index)}
                  onClick={() => choose(index)}
                  aria-label={`Opción ${index + 1}: ${choice}`}
                >
                  <span className={styles.choiceIconBadge}>
                    <Icon size={19} />
                  </span>
                  <span className={styles.choiceLabel}>{choice}</span>
                </button>
              );
            })}
          </div>
        )}

        {finished && answer !== null && (
          <div className={styles.reactionFooter}>
            <button className={styles.continueButton} onClick={onClose} autoFocus>
              Pista guardada en la bitácora · Continuar ↵ <ArrowRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
