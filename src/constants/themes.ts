import { ThemeMode } from '../types';

export interface ThemeConfig {
  id: ThemeMode;
  name: string;
  shortName: string;
  icon: string;
  description: string;
  bgImage?: string;
  accent: string;
  secondary: string;
  surfaceBg: string;
  lineColor: string;
  hasParticles: boolean;
  hasCanvas: boolean;
  particleType: 'sakura' | 'embers' | 'none' | 'rain';
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
    lineColor: 'rgba(144, 153, 220, 0.18)',
    hasParticles: true,
    hasCanvas: true,
    particleType: 'sakura',
  },
  torii: {
    id: 'torii',
    name: 'Torii Gate Sunset',
    shortName: 'Torii Sunset',
    icon: '⛩️',
    description: 'Twilight crimson horizon with warm floating embers',
    bgImage: '/themes/torii-sunset.png',
    accent: '#ff5e48',
    secondary: '#ffb338',
    surfaceBg: '#150a12',
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
    description: 'Deep OLED black, clean contrast, zero distractions',
    accent: '#e2e8f0',
    secondary: '#64748b',
    surfaceBg: '#030407',
    lineColor: 'rgba(255, 255, 255, 0.1)',
    hasParticles: false,
    hasCanvas: false,
    particleType: 'none',
  },
  lofi: {
    id: 'lofi',
    name: 'Lo-Fi Study / Coding Room',
    shortName: 'Lo-Fi Room',
    icon: '🎧',
    description: 'Cozy midnight lavender with gentle rain streaks',
    bgImage: '/themes/lofi-room.png',
    accent: '#a78bfa',
    secondary: '#818cf8',
    surfaceBg: '#0c0e1e',
    lineColor: 'rgba(167, 139, 250, 0.2)',
    hasParticles: true,
    hasCanvas: false,
    particleType: 'rain',
  },
};
