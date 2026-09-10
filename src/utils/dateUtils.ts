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

/** Formats date & time in the exact format: 9/11/2026, 2:01:07 AM */
export function formatExactDateTime(isoString?: string | null): string {
  if (!isoString) return '—';
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return '—';
    return d.toLocaleString('en-US', {
      month: 'numeric',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });
  } catch {
    return '—';
  }
}

/** Parses flexible user input dates like "9/11/2026, 2:01:07 AM", "2026-09-11 02:01", ISO strings etc. */
export function parseFlexibleDateTime(input: string): Date | null {
  if (!input || !input.trim()) return null;
  const cleaned = input.trim();
  
  // Try standard Date parsing
  const d1 = new Date(cleaned);
  if (!isNaN(d1.getTime())) return d1;

  // Try parsing "M/D/YYYY, H:M:S AM/PM" or "M/D/YYYY H:M:S AM/PM"
  const usFormatRegex = /^(\d{1,2})[/-](\d{1,2})[/-](\d{4})(?:[,\s]+(\d{1,2}):(\d{1,2})(?::(\d{1,2}))?\s*(AM|PM)?)?$/i;
  const match = cleaned.match(usFormatRegex);
  if (match) {
    const month = parseInt(match[1], 10) - 1;
    const day = parseInt(match[2], 10);
    const year = parseInt(match[3], 10);
    let hour = match[4] ? parseInt(match[4], 10) : 0;
    const minute = match[5] ? parseInt(match[5], 10) : 0;
    const second = match[6] ? parseInt(match[6], 10) : 0;
    const ampm = match[7]?.toUpperCase();

    if (ampm === 'PM' && hour < 12) hour += 12;
    if (ampm === 'AM' && hour === 12) hour = 0;

    const parsed = new Date(year, month, day, hour, minute, second);
    if (!isNaN(parsed.getTime())) return parsed;
  }

  return null;
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
