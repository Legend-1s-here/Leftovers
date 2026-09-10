import { Subscription } from '../types';
import { supabase } from '../lib/supabase';

const STORAGE_KEY = 'ai_subscriptions_hub_v2';
const INITIALIZED_KEY = 'quotaverse_initialized_v2';

// ── Database to TypeScript Mapper ──
function mapFromDB(row: any): Subscription {
  return {
    id: row.id,
    account: row.account,
    accountTag: row.account_tag || undefined,
    accountColor: row.account_color || undefined,
    model: row.model,
    customModelName: row.custom_model_name || undefined,
    plan: row.plan || 'Pro',
    cost: Number(row.cost) || 0,
    billingCycle: row.billing_cycle || 'monthly',
    startedDate: row.started_date || undefined,
    renewalDate: row.renewal_date,
    sessionResetAt: row.session_reset_at || null,
    sessionDurationHours: row.session_duration_hours || 5,
    notes: row.notes || undefined,
    autoRenew: row.auto_renew ?? true,
    createdAt: row.created_at || new Date().toISOString(),
    updatedAt: row.updated_at || new Date().toISOString(),
  };
}

// ── TypeScript to Database Mapper ──
function mapToDB(sub: Subscription, userId: string) {
  return {
    id: sub.id,
    user_id: userId,
    account: sub.account,
    account_tag: sub.accountTag || null,
    account_color: sub.accountColor || null,
    model: sub.model,
    custom_model_name: sub.customModelName || null,
    plan: sub.plan,
    cost: sub.cost,
    billing_cycle: sub.billingCycle,
    started_date: sub.startedDate || null,
    renewal_date: sub.renewalDate,
    session_reset_at: sub.sessionResetAt || null,
    session_duration_hours: sub.sessionDurationHours || 5,
    notes: sub.notes || null,
    auto_renew: sub.autoRenew,
    updated_at: new Date().toISOString(),
  };
}

export async function fetchUserSubscriptions(): Promise<Subscription[]> {
  try {
    const { data: sessionData } = await supabase.auth.getSession();
    const user = sessionData.session?.user;

    if (!user) {
      return loadLocalSubscriptions();
    }

    const { data, error } = await supabase
      .from('subscriptions')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Supabase fetch error, using local fallback:', error.message);
      return loadLocalSubscriptions();
    }

    if (data !== null) {
      const mapped = data.map(mapFromDB);
      saveLocalSubscriptions(mapped);
      return mapped;
    }

    return [];
  } catch (err) {
    console.error('Fetch error:', err);
    return loadLocalSubscriptions();
  }
}

export async function saveSubscriptionToCloud(sub: Subscription): Promise<void> {
  saveLocalSubscriptionSingle(sub);
  try {
    const { data: sessionData } = await supabase.auth.getSession();
    const user = sessionData.session?.user;
    if (user) {
      const dbPayload = mapToDB(sub, user.id);
      await supabase.from('subscriptions').upsert(dbPayload);
    }
  } catch (err) {
    console.error('Failed to sync subscription to Supabase:', err);
  }
}

export async function deleteSubscriptionFromCloud(id: string): Promise<void> {
  deleteLocalSubscription(id);
  try {
    const { data: sessionData } = await supabase.auth.getSession();
    if (sessionData.session?.user) {
      await supabase.from('subscriptions').delete().eq('id', id);
    }
  } catch (err) {
    console.error('Failed to delete subscription from Supabase:', err);
  }
}

export async function syncAllToSupabase(subs: Subscription[], userId: string): Promise<void> {
  try {
    const payloads = subs.map(s => mapToDB(s, userId));
    if (payloads.length > 0) {
      await supabase.from('subscriptions').upsert(payloads);
    }
  } catch (err) {
    console.error('Error batch syncing to Supabase:', err);
  }
}

// ── LocalStorage Helpers ──
export function loadLocalSubscriptions(): Subscription[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw !== null) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed; // Return actual stored items (even if empty after deletion)
      }
    }

    // Only seed sample data ONCE if the user has never loaded the app before
    const hasInitialized = localStorage.getItem(INITIALIZED_KEY);
    if (hasInitialized) {
      return [];
    }

    localStorage.setItem(INITIALIZED_KEY, 'true');
    return seedInitialData();
  } catch {
    return [];
  }
}

export function saveLocalSubscriptions(subs: Subscription[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(subs));
    localStorage.setItem(INITIALIZED_KEY, 'true');
  } catch (err) {
    console.error(err);
  }
}

function saveLocalSubscriptionSingle(sub: Subscription): void {
  const current = loadLocalSubscriptions();
  const idx = current.findIndex(s => s.id === sub.id);
  if (idx > -1) {
    current[idx] = sub;
  } else {
    current.unshift(sub);
  }
  saveLocalSubscriptions(current);
}

function deleteLocalSubscription(id: string): void {
  const current = loadLocalSubscriptions();
  saveLocalSubscriptions(current.filter(s => s.id !== id));
}

export function exportSubscriptionsAsJSON(subs: Subscription[]): void {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(subs, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute("href", dataStr);
  downloadAnchor.setAttribute("download", `quotaverse-backup-${new Date().toISOString().slice(0,10)}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

export function exportSubscriptionsAsCSV(subs: Subscription[]): void {
  const headers = ['Account', 'Tag', 'Model', 'Plan', 'Cost ($)', 'Billing Cycle', 'Renewal Date', 'Started Date', 'Notes'];
  const rows = subs.map(s => [
    `"${s.account}"`,
    `"${s.accountTag || ''}"`,
    `"${s.model}"`,
    `"${s.plan}"`,
    s.cost,
    `"${s.billingCycle}"`,
    `"${s.renewalDate}"`,
    `"${s.startedDate || ''}"`,
    `"${(s.notes || '').replace(/"/g, '""')}"`,
  ]);

  const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute("href", encodeURI(csvContent));
  downloadAnchor.setAttribute("download", `quotaverse-${new Date().toISOString().slice(0,10)}.csv`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

function seedInitialData(): Subscription[] {
  const today = new Date();
  const formatYMD = (d: Date) => d.toISOString().slice(0, 10);
  const addDays = (num: number) => {
    const d = new Date(today);
    d.setDate(d.getDate() + num);
    return formatYMD(d);
  };
  const addHours = (hours: number) => {
    const d = new Date();
    d.setHours(d.getHours() + hours);
    return d.toISOString();
  };

  const initial: Subscription[] = [
    {
      id: 'sub_1',
      account: 'priya.work@gmail.com',
      accountTag: 'Work',
      accountColor: '#8b5cf6',
      model: 'antigravity',
      plan: 'Google Cloud Vertex / Agentic Pro',
      cost: 40,
      billingCycle: 'monthly',
      startedDate: addDays(-20),
      renewalDate: addDays(10),
      sessionDurationHours: 1,
      notes: 'Main work agent environment. High quota tier.',
      autoRenew: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'sub_2',
      account: 'priya.work@gmail.com',
      accountTag: 'Work',
      accountColor: '#8b5cf6',
      model: 'claude',
      plan: 'Claude Pro (Sonnet 3.7)',
      cost: 20,
      billingCycle: 'monthly',
      startedDate: addDays(-28),
      renewalDate: addDays(2),
      sessionResetAt: addHours(3.5),
      sessionDurationHours: 5,
      notes: 'Hit 5-hour rolling limit during codebase refactoring.',
      autoRenew: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'sub_3',
      account: 'priya.personal@gmail.com',
      accountTag: 'Personal',
      accountColor: '#ec4899',
      model: 'claude',
      plan: 'Claude Pro (Backup)',
      cost: 20,
      billingCycle: 'monthly',
      startedDate: addDays(-10),
      renewalDate: addDays(20),
      sessionDurationHours: 5,
      notes: 'Secondary Claude account used when work account hits limit.',
      autoRenew: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'sub_4',
      account: 'priya.personal@gmail.com',
      accountTag: 'Personal',
      accountColor: '#ec4899',
      model: 'codex',
      plan: 'ChatGPT Plus (GPT-4o & Codex)',
      cost: 20,
      billingCycle: 'monthly',
      startedDate: addDays(-15),
      renewalDate: addDays(15),
      sessionDurationHours: 3,
      notes: 'For quick debugging and codex generations.',
      autoRenew: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'sub_5',
      account: 'research.lab@gmail.com',
      accountTag: 'Research',
      accountColor: '#10b981',
      model: 'gemini',
      plan: 'Gemini Advanced (Google One 2TB)',
      cost: 20,
      billingCycle: 'monthly',
      startedDate: addDays(-25),
      renewalDate: addDays(5),
      sessionDurationHours: 2,
      notes: '2M token context window for large documentation analysis.',
      autoRenew: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'sub_6',
      account: 'research.lab@gmail.com',
      accountTag: 'Research',
      accountColor: '#10b981',
      model: 'cursor',
      plan: 'Cursor Pro',
      cost: 20,
      billingCycle: 'monthly',
      startedDate: addDays(-32),
      renewalDate: addDays(-2),
      sessionDurationHours: 24,
      notes: 'Need to update payment card for auto-renewal.',
      autoRenew: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  ];

  saveLocalSubscriptions(initial);
  return initial;
}
