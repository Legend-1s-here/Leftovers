import { ThemeMode } from '../types';

export interface ThemeConfig {
  id: ThemeMode;
  name: string;
  shortName: string;
  icon: string;
  description: string;
  bgImage: string;
  accent: string;
  secondary: string;
  surfaceBg: string;
  lineColor: string;
  hasParticles: boolean;
  hasCanvas: boolean;
  particleType: 'sakura' | 'embers' | 'minimalist' | 'rain';
}

export const THEMES: Record<ThemeMode, ThemeConfig> = {
  shonen: {
    id: 'shonen',
    name: 'Neon Shonen Cyberpunk',
    shortName: 'Shonen',
    icon: '🌌',
    description: 'Chakra orbs, twinkling stars & falling sakura petals',
    bgImage: '/shonen-background-anime-v2.png',
    accent: '#9a4dff',
    secondary: '#29c8e8',
    surfaceBg: '#070918',
    lineColor: 'rgba(147, 164, 255, 0.16)',
    hasParticles: true,
    hasCanvas: true,
    particleType: 'sakura',
  },
  torii: {
    id: 'torii',
    name: 'Torii Gate Sunset',
    shortName: 'Torii Sunset',
    icon: '⛩️',
    description: 'Japanese sunset lake, glowing Torii gate & floating crimson petals',
    bgImage: '/themes/torii-sunset.png',
    accent: '#ff4d3d',
    secondary: '#ffa03a',
    surfaceBg: '#0f050b',
    lineColor: 'rgba(255, 110, 80, 0.22)',
    hasParticles: true,
    hasCanvas: true,
    particleType: 'embers',
  },
  minimalist: {
    id: 'minimalist',
    name: 'Minimalist Dark Mode',
    shortName: 'OLED Minimal',
    icon: '🌑',
    description: 'Deep celestial navy-black with cyber light streaks & crisp contrast',
    bgImage: '/themes/minimalist-dark.png',
    accent: '#e2e8f0',
    secondary: '#38bdf8',
    surfaceBg: '#030407',
    lineColor: 'rgba(255, 255, 255, 0.12)',
    hasParticles: true,
    hasCanvas: true,
    particleType: 'minimalist',
  },
  lofi: {
    id: 'lofi',
    name: 'Lo-Fi Study / Coding Room',
    shortName: 'Lo-Fi Room',
    icon: '🎧',
    description: 'Rainy city window, cozy desk lamp & calming ambient glow',
    bgImage: '/themes/lofi-room.jpg',
    accent: '#a78bfa',
    secondary: '#818cf8',
    surfaceBg: '#080916',
    lineColor: 'rgba(167, 139, 250, 0.2)',
    hasParticles: true,
    hasCanvas: false,
    particleType: 'rain',
  },
};
