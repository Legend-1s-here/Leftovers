import { ModelKey, ModelMeta } from '../types';

export const MODEL_CONFIGS: Record<ModelKey, ModelMeta> = {
  antigravity: {
    key: 'antigravity',
    name: 'Antigravity',
    tagline: 'Google DeepMind Advanced Agentic AI',
    icon: '🚀',
    color: '#a855f7',
    badgeBg: 'bg-purple-500/10',
    badgeBorder: 'border-purple-500/30',
    badgeText: 'text-purple-400',
    defaultSessionHours: 1,
    officialUrl: 'https://antigravity.google',
  },
  claude: {
    key: 'claude',
    name: 'Claude (Anthropic)',
    tagline: 'Claude 3.7 Sonnet & Opus',
    icon: '🧠',
    color: '#f97316',
    badgeBg: 'bg-orange-500/10',
    badgeBorder: 'border-orange-500/30',
    badgeText: 'text-orange-400',
    defaultSessionHours: 5, // Claude 5-hour rolling limit window
    officialUrl: 'https://claude.ai',
  },
  codex: {
    key: 'codex',
    name: 'OpenAI / Codex',
    tagline: 'ChatGPT Plus, Team & OpenAI Models',
    icon: '⚡',
    color: '#10b981',
    badgeBg: 'bg-emerald-500/10',
    badgeBorder: 'border-emerald-500/30',
    badgeText: 'text-emerald-400',
    defaultSessionHours: 3,
    officialUrl: 'https://chatgpt.com',
  },
  gemini: {
    key: 'gemini',
    name: 'Google Gemini',
    tagline: 'Gemini Advanced & 2.5 Flash / Pro',
    icon: '✨',
    color: '#3b82f6',
    badgeBg: 'bg-blue-500/10',
    badgeBorder: 'border-blue-500/30',
    badgeText: 'text-blue-400',
    defaultSessionHours: 2,
    officialUrl: 'https://gemini.google.com',
  },
  cursor: {
    key: 'cursor',
    name: 'Cursor AI',
    tagline: 'Pro AI Code Editor fast requests',
    icon: '🖱️',
    color: '#06b6d4',
    badgeBg: 'bg-cyan-500/10',
    badgeBorder: 'border-cyan-500/30',
    badgeText: 'text-cyan-400',
    defaultSessionHours: 24,
    officialUrl: 'https://cursor.com',
  },
  copilot: {
    key: 'copilot',
    name: 'GitHub Copilot',
    tagline: 'Copilot Individual & Business',
    icon: '🤖',
    color: '#818cf8',
    badgeBg: 'bg-indigo-500/10',
    badgeBorder: 'border-indigo-500/30',
    badgeText: 'text-indigo-400',
    defaultSessionHours: 24,
    officialUrl: 'https://github.com/features/copilot',
  },
  custom: {
    key: 'custom',
    name: 'Custom Model',
    tagline: 'Custom AI service or API endpoint',
    icon: '🔮',
    color: '#ec4899',
    badgeBg: 'bg-pink-500/10',
    badgeBorder: 'border-pink-500/30',
    badgeText: 'text-pink-400',
    defaultSessionHours: 4,
    officialUrl: '',
  },
};

export const ACCOUNT_COLORS = [
  '#8b5cf6', // violet
  '#ec4899', // pink
  '#3b82f6', // blue
  '#10b981', // emerald
  '#f59e0b', // amber
  '#06b6d4', // cyan
  '#ef4444', // red
  '#6366f1', // indigo
];
