import React, { useState, useEffect } from 'react';
import { AnimeBackground } from './components/AnimeBackground';
import { Header } from './components/Header';
import { StatsOverview } from './components/StatsOverview';
import { AccountFilterBar } from './components/AccountFilterBar';
import { SubscriptionCard } from './components/SubscriptionCard';
import { AccountsGroupedView } from './components/AccountsGroupedView';
import { CalendarTimelineView } from './components/CalendarTimelineView';
import { AnalyticsView } from './components/AnalyticsView';
import { SubscriptionModal } from './components/SubscriptionModal';
import { QuickSessionResetModal } from './components/QuickSessionResetModal';
import { AuthView } from './components/AuthView';
import { Subscription, ViewMode, FilterState } from './types';
import {
  fetchUserSubscriptions,
  saveSubscriptionToCloud,
  deleteSubscriptionFromCloud,
  exportSubscriptionsAsJSON,
  exportSubscriptionsAsCSV,
  loadLocalSubscriptions,
} from './services/storage';
import { getSubscriptionStatus } from './utils/dateUtils';
import { supabase } from './lib/supabase';
import { User } from '@supabase/supabase-js';

export function App() {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>('cards');
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    account: '',
    model: '',
    status: 'all',
    sortBy: 'renewal',
  });

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingSub, setEditingSub] = useState<Subscription | null>(null);
  const [prefilledAccount, setPrefilledAccount] = useState('');
  const [isQuickResetOpen, setIsQuickResetOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  // Initialize Supabase Auth Session
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setAuthLoading(false);
    });

    const {
      data: { subscription: authListener },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setAuthLoading(false);
    });

    return () => {
      authListener.unsubscribe();
    };
  }, []);

  // Fetch subscriptions whenever user state changes
  useEffect(() => {
    if (user) {
      fetchUserSubscriptions().then(subs => {
        setSubscriptions(subs);
      });
    } else {
      setSubscriptions(loadLocalSubscriptions());
    }
  }, [user]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  const handleSave = async (
    data: Omit<Subscription, 'id' | 'createdAt' | 'updatedAt'>,
    editId?: string,
  ) => {
    const now = new Date().toISOString();
    if (editId) {
      const updatedSub: Subscription = {
        ...data,
        id: editId,
        createdAt: subscriptions.find(s => s.id === editId)?.createdAt || now,
        updatedAt: now,
      };
      setSubscriptions(prev =>
        prev.map(s => s.id === editId ? updatedSub : s)
      );
      await saveSubscriptionToCloud(updatedSub);
      showToast('Subscription updated ✦');
    } else {
      const newSub: Subscription = {
        ...data,
        id: `sub_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        createdAt: now,
        updatedAt: now,
      };
      setSubscriptions(prev => [newSub, ...prev]);
      await saveSubscriptionToCloud(newSub);
      showToast('New AI subscription added ✧');
    }
  };

  const handleDelete = async (id: string) => {
    const t = subscriptions.find(s => s.id === id);
    if (!t) return;
    if (confirm(`Delete ${t.model} for ${t.account}?`)) {
      setSubscriptions(prev => prev.filter(s => s.id !== id));
      await deleteSubscriptionFromCloud(id);
      showToast('Subscription deleted');
    }
  };

  const handleTriggerSessionReset = async (sub: Subscription, hours: number) => {
    const reset = new Date();
    reset.setHours(reset.getHours() + hours);
    const updated = {
      ...sub,
      sessionResetAt: reset.toISOString(),
      sessionDurationHours: hours,
      updatedAt: new Date().toISOString(),
    };
    setSubscriptions(prev =>
      prev.map(s => s.id === sub.id ? updated : s)
    );
    await saveSubscriptionToCloud(updated);
    showToast(`⏱ ${hours}h cooldown started for ${sub.account}`);
  };

  const handleClearSessionReset = async (id: string) => {
    const target = subscriptions.find(s => s.id === id);
    if (!target) return;
    const updated = {
      ...target,
      sessionResetAt: null,
      updatedAt: new Date().toISOString(),
    };
    setSubscriptions(prev =>
      prev.map(s => s.id === id ? updated : s)
    );
    await saveSubscriptionToCloud(updated);
    showToast('Session lock cleared ✓');
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    showToast('Signed out of QuotaVerse');
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async ev => {
      try {
        const parsed = JSON.parse(ev.target?.result as string);
        if (Array.isArray(parsed)) {
          setSubscriptions(parsed);
          for (const sub of parsed) {
            await saveSubscriptionToCloud(sub);
          }
          showToast(`Imported ${parsed.length} subscriptions`);
        }
      } catch { alert('Invalid JSON file'); }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleResetData = async () => {
    if (confirm('Reset to sample data? Current items will be replaced.')) {
      localStorage.removeItem('ai_subscriptions_hub_v2');
      const sample = loadLocalSubscriptions();
      setSubscriptions(sample);
      if (user) {
        for (const s of sample) {
          await saveSubscriptionToCloud(s);
        }
      }
      showToast('Restored sample subscriptions');
    }
  };

  const filtered = subscriptions.filter(sub => {
    if (filters.search) {
      const q = filters.search.toLowerCase();
      if (![sub.account, sub.accountTag, sub.model, sub.plan, sub.notes].some(v => v?.toLowerCase().includes(q))) return false;
    }
    if (filters.account && sub.account !== filters.account) return false;
    if (filters.model  && sub.model   !== filters.model)   return false;
    if (filters.status !== 'all' && getSubscriptionStatus(sub) !== filters.status) return false;
    return true;
  }).sort((a, b) => {
    if (filters.sortBy === 'renewal') return new Date(a.renewalDate).getTime() - new Date(b.renewalDate).getTime();
    if (filters.sortBy === 'account') return a.account.localeCompare(b.account);
    if (filters.sortBy === 'model')   return a.model.localeCompare(b.model);
    if (filters.sortBy === 'cost')    return b.cost - a.cost;
    return 0;
  });

  const existingAccounts = Array.from(new Set(subscriptions.map(s => s.account)));

  if (authLoading) {
    return (
      <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', background: '#070918', color: '#fff' }}>
        <AnimeBackground />
        <div style={{ position: 'relative', zIndex: 10, textAlign: 'center' }}>
          <div style={{ fontSize: 36, marginBottom: 12 }} className="animate-pulse">✧</div>
          <p style={{ color: 'var(--muted)', font: "700 16px 'Space Grotesk'" }}>Loading QuotaVerse...</p>
        </div>
      </div>
    );
  }

  // If user is not authenticated, show Auth Page
  if (!user) {
    return (
      <div style={{ minHeight: '100vh', color: 'var(--text)', overflowX: 'hidden' }}>
        <AnimeBackground />
        <AuthView onSuccess={() => showToast('Welcome to QuotaVerse! ✦')} />
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', color: 'var(--text)', overflowX: 'hidden' }}>
      {/* Anime layer: background, canvas, sakura, auras */}
      <AnimeBackground />

      {/* Toast notification */}
      {toast && (
        <div style={{
          position: 'fixed', bottom: 24, right: 24, zIndex: 100,
          background: 'linear-gradient(135deg, #993dff, #6328dc)',
          color: '#fff', fontSize: 13, fontWeight: 700,
          padding: '10px 18px', borderRadius: 14,
          boxShadow: '0 12px 40px rgba(111,41,228,.45)',
          border: '1px solid rgba(169,100,255,.4)',
          animation: 'rise .3s both',
        }}>
          ✧ {toast}
        </div>
      )}

      {/* Sticky header */}
      <Header
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onOpenAddModal={() => { setEditingSub(null); setPrefilledAccount(''); setIsAddModalOpen(true); }}
        onOpenQuickResetModal={() => setIsQuickResetOpen(true)}
        onExportJSON={() => { exportSubscriptionsAsJSON(subscriptions); showToast('JSON backup exported'); }}
        onExportCSV={() => { exportSubscriptionsAsCSV(subscriptions); showToast('CSV exported'); }}
        onImportJSON={handleImportJSON}
        onResetData={handleResetData}
        activeCount={subscriptions.filter(s => getSubscriptionStatus(s) !== 'expired').length}
        totalCount={subscriptions.length}
        user={user}
        onSignOut={handleSignOut}
      />

      {/* Main content shell */}
      <main style={{ position: 'relative', zIndex: 2, width: 'min(1480px, calc(100% - 42px))', margin: '0 auto', paddingBottom: 70 }}>
        <StatsOverview subscriptions={subscriptions} />
        <AccountFilterBar filters={filters} onFilterChange={setFilters} subscriptions={subscriptions} />

        {/* ── Cards View ── */}
        {viewMode === 'cards' && (
          filtered.length > 0 ? (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 19,
            }}>
              {filtered.map((sub, i) => (
                <div key={sub.id} style={{ animationDelay: `${i * 0.06}s` }}>
                  <SubscriptionCard
                    subscription={sub}
                    onEdit={s => { setEditingSub(s); setIsAddModalOpen(true); }}
                    onDelete={handleDelete}
                    onTriggerSessionReset={handleTriggerSessionReset}
                    onClearSessionReset={handleClearSessionReset}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div style={{
              textAlign: 'center', padding: '60px 0',
              border: '1px solid var(--line)', borderRadius: 'var(--radius)',
              background: 'rgba(14,20,43,.6)',
            }}>
              <div style={{ fontSize: 42, marginBottom: 12 }}>✧</div>
              <p style={{ color: 'var(--muted)', margin: 0 }}>No subscriptions match your filters.</p>
              <button
                onClick={() => { setEditingSub(null); setPrefilledAccount(''); setIsAddModalOpen(true); }}
                style={{
                  marginTop: 18, padding: '11px 22px', borderRadius: 13,
                  background: 'linear-gradient(135deg, #993dff, #6328dc)',
                  color: '#fff', fontWeight: 700, fontSize: 13, cursor: 'pointer',
                  border: 0, font: 'inherit',
                }}
              >
                ＋ Add Subscription
              </button>
            </div>
          )
        )}

        {/* ── Grouped by Account View ── */}
        {viewMode === 'accounts' && (
          <AccountsGroupedView
            subscriptions={filtered}
            onEdit={s => { setEditingSub(s); setIsAddModalOpen(true); }}
            onDelete={handleDelete}
            onTriggerSessionReset={handleTriggerSessionReset}
            onClearSessionReset={handleClearSessionReset}
            onAddForAccount={acc => { setEditingSub(null); setPrefilledAccount(acc); setIsAddModalOpen(true); }}
          />
        )}

        {/* ── Calendar View ── */}
        {viewMode === 'calendar' && (
          <CalendarTimelineView
            subscriptions={filtered}
            onEdit={s => { setEditingSub(s); setIsAddModalOpen(true); }}
          />
        )}

        {/* ── Analytics View ── */}
        {viewMode === 'analytics' && (
          <AnalyticsView subscriptions={subscriptions} />
        )}
      </main>

      {/* Modals */}
      <SubscriptionModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleSave}
        editingSubscription={editingSub}
        existingAccounts={existingAccounts}
        initialAccount={prefilledAccount}
      />
      <QuickSessionResetModal
        isOpen={isQuickResetOpen}
        onClose={() => setIsQuickResetOpen(false)}
        subscriptions={subscriptions}
        onTriggerReset={handleTriggerSessionReset}
      />
    </div>
  );
}

export default App;
