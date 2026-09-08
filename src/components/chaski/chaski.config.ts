export type ChaskiPersonality = 
  | 'analitico' 
  | 'creativo' 
  | 'social' 
  | 'emprendedor' 
  | 'explorador'
  | 'default';

export type ChaskiState = 
  | 'idle' 
  | 'thinking' 
  | 'listening' 
  | 'happy' 
  | 'curious' 
  | 'analyzing' 
  | 'motivated' 
  | 'surprised';

interface ChaskiConfig {
  images: Record<ChaskiPersonality, Record<ChaskiState, string>>;
  colors: Record<ChaskiPersonality, string>;
}

// TODO: The user should adjust these image filenames once they identify which image corresponds to which state.
// Currently mapped generically to the 13 available images (chaski-1.png to chaski-13.png).
export const chaskiConfig: ChaskiConfig = {
  colors: {
    analitico: 'text-blue-600', // Azules
    creativo: 'text-purple-600', // Violetas
    social: 'text-rose-500', // Corales / rosas
    emprendedor: 'text-orange-500', // Ámbar / naranja
    explorador: 'text-green-600', // Verdes
    default: 'text-slate-800'
  },
  images: {
    default: {
      idle: '/assets/chaski/chaski-10.png',
      thinking: '/assets/chaski/chaski-8.png',
      listening: '/assets/chaski/chaski-10.png',
      happy: '/assets/chaski/chaski-2.png',
      curious: '/assets/chaski/chaski-5.png',
      analyzing: '/assets/chaski/chaski-8.png',
      motivated: '/assets/chaski/chaski-12.png',
      surprised: '/assets/chaski/chaski-7.png',
    },
    analitico: {
      idle: '/assets/chaski/chaski-10.png',
      thinking: '/assets/chaski/chaski-8.png',
      listening: '/assets/chaski/chaski-10.png',
      happy: '/assets/chaski/chaski-2.png',
      curious: '/assets/chaski/chaski-5.png',
      analyzing: '/assets/chaski/chaski-8.png',
      motivated: '/assets/chaski/chaski-12.png',
      surprised: '/assets/chaski/chaski-7.png',
    },
    creativo: {
      idle: '/assets/chaski/chaski-10.png',
      thinking: '/assets/chaski/chaski-8.png',
      listening: '/assets/chaski/chaski-10.png',
      happy: '/assets/chaski/chaski-2.png',
      curious: '/assets/chaski/chaski-5.png',
      analyzing: '/assets/chaski/chaski-8.png',
      motivated: '/assets/chaski/chaski-12.png',
      surprised: '/assets/chaski/chaski-7.png',
    },
    social: {
      idle: '/assets/chaski/chaski-10.png',
      thinking: '/assets/chaski/chaski-8.png',
      listening: '/assets/chaski/chaski-10.png',
      happy: '/assets/chaski/chaski-2.png',
      curious: '/assets/chaski/chaski-5.png',
      analyzing: '/assets/chaski/chaski-8.png',
      motivated: '/assets/chaski/chaski-12.png',
      surprised: '/assets/chaski/chaski-7.png',
    },
    emprendedor: {
      idle: '/assets/chaski/chaski-10.png',
      thinking: '/assets/chaski/chaski-8.png',
      listening: '/assets/chaski/chaski-10.png',
      happy: '/assets/chaski/chaski-2.png',
      curious: '/assets/chaski/chaski-5.png',
      analyzing: '/assets/chaski/chaski-8.png',
      motivated: '/assets/chaski/chaski-12.png',
      surprised: '/assets/chaski/chaski-7.png',
    },
    explorador: {
      idle: '/assets/chaski/chaski-10.png',
      thinking: '/assets/chaski/chaski-8.png',
      listening: '/assets/chaski/chaski-10.png',
      happy: '/assets/chaski/chaski-2.png',
      curious: '/assets/chaski/chaski-5.png',
      analyzing: '/assets/chaski/chaski-8.png',
      motivated: '/assets/chaski/chaski-12.png',
      surprised: '/assets/chaski/chaski-7.png',
    }
  }
};

export const getChaskiImage = (personality: ChaskiPersonality = 'default', state: ChaskiState = 'idle') => {
  return chaskiConfig.images[personality]?.[state] || chaskiConfig.images.default.idle;
};

export const getChaskiColor = (personality: ChaskiPersonality = 'default') => {
  return chaskiConfig.colors[personality] || chaskiConfig.colors.default;
};
