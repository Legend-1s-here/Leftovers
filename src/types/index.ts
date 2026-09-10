export type ModelKey =
  | 'antigravity'
  | 'claude'
  | 'codex'
  | 'gemini'
  | 'cursor'
  | 'copilot'
  | 'custom';

export type BillingCycle = 'monthly' | 'yearly' | 'weekly' | 'bi-weekly' | 'free';

export interface Subscription {
  id: string;
  account: string; // e.g. "priya.work@gmail.com"
  accountTag?: string; // e.g. "Work", "Personal", "Side Project"
  accountColor?: string; // hex or tailwind class
  model: ModelKey;
  customModelName?: string;
  plan: string; // e.g. "Pro", "Max 5x", "Team", "Free"
  cost: number; // e.g. 20
  billingCycle: BillingCycle;
  startedDate?: string; // YYYY-MM-DD
  renewalDate: string; // YYYY-MM-DD
  sessionResetAt?: string | null; // ISO timestamp string if hit rate-limit
  sessionDurationHours?: number; // default rolling duration in hours (e.g. 5h for Claude, 1h for Antigravity)
  notes?: string;
  autoRenew: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ModelMeta {
  key: ModelKey;
  name: string;
  tagline: string;
  icon: string;
  color: string;
  badgeBg: string;
  badgeBorder: string;
  badgeText: string;
  defaultSessionHours: number;
  officialUrl: string;
}

export type ViewMode = 'cards' | 'accounts' | 'calendar' | 'analytics';

export type FilterStatus = 'all' | 'active' | 'expiring' | 'expired' | 'session_locked';

export interface FilterState {
  search: string;
  account: string;
  model: string;
  status: FilterStatus;
  sortBy: 'limit_reset' | 'renewal' | 'account' | 'model' | 'cost';
}
