import React from 'react';
import { Subscription } from '../types';
import { SubscriptionCard } from './SubscriptionCard';

interface AccountsGroupedViewProps {
  subscriptions: Subscription[];
  onEdit: (sub: Subscription) => void;
  onDelete: (id: string) => void;
  onTriggerSessionReset: (sub: Subscription, hours: number) => void;
  onClearSessionReset: (id: string) => void;
  onAddForAccount: (account: string) => void;
}

export const AccountsGroupedView: React.FC<AccountsGroupedViewProps> = ({
  subscriptions,
  onEdit,
  onDelete,
  onTriggerSessionReset,
  onClearSessionReset,
  onAddForAccount,
}) => {
  const grouped = subscriptions.reduce((acc, sub) => {
    if (!acc[sub.account]) acc[sub.account] = [];
    acc[sub.account].push(sub);
    return acc;
  }, {} as Record<string, Subscription[]>);

  const accounts = Object.keys(grouped).sort();

  if (!accounts.length) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 0', border: '1px solid var(--line)', borderRadius: 'var(--radius)', background: 'rgba(14,20,43,.6)' }}>
        <p style={{ color: 'var(--muted)' }}>No subscriptions match your filters.</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 36 }}>
      {accounts.map(accountEmail => {
        const subs = grouped[accountEmail];
        const first = subs[0];
        const totalCost = subs.reduce((s, x) => s + x.cost, 0);

        return (
          <div key={accountEmail} style={{
            padding: 24,
            border: '1px solid var(--line)',
            borderRadius: 'var(--radius)',
            background: 'rgba(14,20,43,.6)',
          }}>
            {/* Account header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, paddingBottom: 18, borderBottom: '1px solid var(--line)', marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 15,
                  background: first?.accountColor || '#9a4dff',
                  display: 'grid', placeItems: 'center',
                  fontSize: 20, boxShadow: `0 0 22px ${first?.accountColor || '#9a4dff'}66`,
                }}>
                  ✉
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                    <h3 style={{ font: "700 15px 'Space Grotesk'", margin: 0 }}>{accountEmail}</h3>
                    {first?.accountTag && (
                      <span style={{ padding: '3px 8px', borderRadius: 7, fontSize: 11, fontWeight: 700, background: 'rgba(154,77,255,.18)', color: '#c79aff', border: '1px solid rgba(154,77,255,.3)' }}>
                        {first.accountTag}
                      </span>
                    )}
                  </div>
                  <p style={{ color: 'var(--muted)', fontSize: 12, marginTop: 3 }}>
                    {subs.length} model{subs.length > 1 ? 's' : ''} · Est. ${totalCost}/mo total
                  </p>
                </div>
              </div>

              <button
                onClick={() => onAddForAccount(accountEmail)}
                style={{
                  padding: '9px 15px', borderRadius: 11,
                  background: 'rgba(140,70,255,.13)', border: '1px solid rgba(155,83,255,.3)',
                  color: '#c79aff', fontSize: 12, fontWeight: 600, cursor: 'pointer', font: 'inherit',
                }}
              >
                ＋ Add Model to this Gmail
              </button>
            </div>

            {/* Cards grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 19 }}>
              {subs.map(sub => (
                <SubscriptionCard
                  key={sub.id}
                  subscription={sub}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onTriggerSessionReset={onTriggerSessionReset}
                  onClearSessionReset={onClearSessionReset}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};
