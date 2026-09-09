import { Subscription } from '../types';

export function getDaysUntil(dateStr?: string): number {
  if (!dateStr) return 999;
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const target = new Date(dateStr);
  target.setHours(0, 0, 0, 0);
  return Math.round((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

export function formatDateDisplay(dateStr?: string): string {
  if (!dateStr) return '—';
  try {
    const [y, m, d] = dateStr.split('-');
    if (!y || !m || !d) return dateStr;
    const date = new Date(+y, +m - 1, +d);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

export function formatTimeDisplay(isoString?: string | null): string {
  if (!isoString) return '—';
  try {
    const d = new Date(isoString);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } catch {
    return '—';
  }
}

export function getSessionCountdown(resetIso?: string | null): {
  isLocked: boolean;
  formatted: string;
  hours: number;
  minutes: number;
  seconds: number;
  remainingSeconds: number;
} {
  if (!resetIso) {
    return { isLocked: false, formatted: '', hours: 0, minutes: 0, seconds: 0, remainingSeconds: 0 };
  }
  const now = Date.now();
  const resetTime = new Date(resetIso).getTime();
  const diffMs = resetTime - now;

  if (diffMs <= 0) {
    return { isLocked: false, formatted: 'Ready to use!', hours: 0, minutes: 0, seconds: 0, remainingSeconds: 0 };
  }

  const remainingSeconds = Math.floor(diffMs / 1000);
  const days = Math.floor(remainingSeconds / 86400);
  const hours = Math.floor((remainingSeconds % 86400) / 3600);
  const minutes = Math.floor((remainingSeconds % 3600) / 60);
  const seconds = remainingSeconds % 60;

  const pad = (n: number) => n.toString().padStart(2, '0');
  const formatted = days > 0
    ? `${days}d ${pad(hours)}h ${pad(minutes)}m ${pad(seconds)}s`
    : hours > 0 
    ? `${hours}h ${pad(minutes)}m ${pad(seconds)}s`
    : `${minutes}m ${pad(seconds)}s`;

  return { isLocked: true, formatted, hours: days * 24 + hours, minutes, seconds, remainingSeconds };
}

export function getCycleProgress(startedDate?: string, renewalDate?: string): number {
  if (!renewalDate) return 0;
  const now = new Date().getTime();
  const end = new Date(renewalDate).getTime();
  
  // If no start date, assume 30 days before renewal date
  const start = startedDate 
    ? new Date(startedDate).getTime()
    : end - (30 * 24 * 60 * 60 * 1000);

  const total = end - start;
  if (total <= 0) return 100;
  const elapsed = now - start;
  const pct = Math.round((elapsed / total) * 100);
  return Math.max(0, Math.min(100, pct));
}

export function getSubscriptionStatus(sub: Subscription): 'session_locked' | 'expired' | 'expiring' | 'active' {
  if (sub.sessionResetAt) {
    const session = getSessionCountdown(sub.sessionResetAt);
    if (session.isLocked) return 'session_locked';
  }
  const days = getDaysUntil(sub.renewalDate);
  if (days < 0) return 'expired';
  if (days <= 5) return 'expiring';
  return 'active';
}
