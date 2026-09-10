import { Subscription } from '../types';
import { supabase } from '../lib/supabase';

export interface BackupSnapshot {
  id: string;
  createdAt: string;
  reason: string;
  itemCount: number;
  totalMonthlySpend: number;
  subscriptions: Subscription[];
}

const SNAPSHOTS_STORAGE_KEY = 'quotaverse_cloud_snapshots_v1';
const MAX_SNAPSHOTS = 15;

export const snapshotService = {
  getSnapshots(): BackupSnapshot[] {
    try {
      const raw = localStorage.getItem(SNAPSHOTS_STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  },

  async createSnapshot(subs: Subscription[], reason: string = 'Auto-saved cloud snapshot'): Promise<BackupSnapshot> {
    const totalSpend = subs.reduce((sum, s) => {
      if (s.billingCycle === 'yearly') return sum + (s.cost / 12);
      if (s.billingCycle === 'weekly') return sum + (s.cost * 4);
      if (s.billingCycle === 'bi-weekly') return sum + (s.cost * 2);
      return sum + s.cost;
    }, 0);

    const snapshot: BackupSnapshot = {
      id: `snap_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      createdAt: new Date().toISOString(),
      reason,
      itemCount: subs.length,
      totalMonthlySpend: Math.round(totalSpend),
      subscriptions: JSON.parse(JSON.stringify(subs)),
    };

    const current = this.getSnapshots();
    const updated = [snapshot, ...current].slice(0, MAX_SNAPSHOTS);

    try {
      localStorage.setItem(SNAPSHOTS_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn('Snapshot localStorage write error:', e);
    }

    // Also sync to Supabase user metadata if logged in
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const user = sessionData.session?.user;
      if (user) {
        await supabase.auth.updateUser({
          data: {
            latest_backup_snapshot_at: snapshot.createdAt,
            latest_backup_count: snapshot.itemCount,
          }
        });
      }
    } catch (err) {
      console.warn('Cloud snapshot meta sync note:', err);
    }

    return snapshot;
  },

  deleteSnapshot(id: string): BackupSnapshot[] {
    const current = this.getSnapshots();
    const updated = current.filter(s => s.id !== id);
    localStorage.setItem(SNAPSHOTS_STORAGE_KEY, JSON.stringify(updated));
    return updated;
  },

  clearAllSnapshots(): void {
    localStorage.removeItem(SNAPSHOTS_STORAGE_KEY);
  }
};
