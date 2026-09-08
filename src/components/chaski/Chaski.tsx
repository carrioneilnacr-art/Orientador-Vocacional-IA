'use client';

import { motion, TargetAndTransition } from 'framer-motion';
import { getChaskiImage, ChaskiPersonality, ChaskiState } from './chaski.config';

interface ChaskiProps {
  personality?: ChaskiPersonality;
  state?: ChaskiState;
  size?: 'xxs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  className?: string;
  animate?: boolean;
}

const sizeClasses = {
  xxs: 'w-6 h-6',
  xs: 'w-10 h-10',
  sm: 'w-16 h-16',
  md: 'w-32 h-32',
  lg: 'w-64 h-64',
  xl: 'w-96 h-96',
  '2xl': 'w-[500px] h-[500px]',
  full: 'w-full h-full',
};

export const Chaski = ({
  personality = 'default',
  state = 'idle',
  size = 'md',
  className = '',
  animate = true,
}: ChaskiProps) => {
  const imgSrc = getChaskiImage(personality, state);

  // Animations based on state
  const getAnimation = (): TargetAndTransition => {
    if (!animate) return {};

    switch (state) {
      case 'thinking':
      case 'analyzing':
        return {
          y: [0, -10, 0],
          scale: [1, 1.02, 1],
          transition: { duration: 3, repeat: Infinity, ease: 'easeInOut' }
        };
      case 'happy':
      case 'motivated':
        return {
          y: [0, -15, 0],
          rotate: [0, -5, 5, 0],
          transition: { duration: 2, repeat: Infinity, ease: 'easeInOut' }
        };
      case 'surprised':
        return {
          scale: [1, 1.1, 1],
          transition: { duration: 0.5, ease: 'easeOut' }
        };
      case 'listening':
        return {
          scale: [1, 1.05, 1],
          transition: { duration: 4, repeat: Infinity, ease: 'easeInOut' }
        };
      case 'idle':
      default:
        // Basic breathing/floating
        return {
          y: [0, -8, 0],
          transition: { duration: 4, repeat: Infinity, ease: 'easeInOut' }
        };
    }
  };

  return (
    <motion.div 
      className={`relative inline-flex items-center justify-center ${sizeClasses[size]} ${className}`}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <motion.img
        src={imgSrc}
        alt={`Chaski - ${personality} - ${state}`}
        className="object-contain w-full h-full drop-shadow-xl"
        animate={getAnimation()}
      />
    </motion.div>
  );
};
