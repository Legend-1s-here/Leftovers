import { Subscription } from '../types';

const STORAGE_KEY = 'ai_subscriptions_hub_v2';

export function loadSubscriptions(): Subscription[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return seedInitialData();
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : seedInitialData();
  } catch (err) {
    console.error('Failed to load from storage:', err);
    return seedInitialData();
  }
}

export function saveSubscriptions(subs: Subscription[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(subs));
  } catch (err) {
    console.error('Failed to save subscriptions:', err);
  }
}

export function exportSubscriptionsAsJSON(subs: Subscription[]): void {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(subs, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute("href", dataStr);
  downloadAnchor.setAttribute("download", `ai-subscriptions-backup-${new Date().toISOString().slice(0,10)}.json`);
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
  downloadAnchor.setAttribute("download", `ai-subscriptions-${new Date().toISOString().slice(0,10)}.csv`);
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
      renewalDate: addDays(2), // Expiring soon
      sessionResetAt: addHours(3.5), // Active rolling lock
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
      renewalDate: addDays(-2), // Expired
      sessionDurationHours: 24,
      notes: 'Need to update payment card for auto-renewal.',
      autoRenew: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  ];

  saveSubscriptions(initial);
  return initial;
}
