import type { Metadata } from 'next';
import Adventure from '@/components/game/Adventure';

export const metadata: Metadata = {
  title: 'Chaski Adventure · Explora tu futuro',
  description: 'Explora un pequeño mundo, transforma la feria y descubre qué actividades te gustaría seguir probando con Chaski.',
};

export default function AdventurePage() { return <Adventure />; }
