import React from 'react';
import { Subscription } from '../types';
import { MODEL_CONFIGS } from '../constants/models';

interface AnalyticsViewProps {
  subscriptions: Subscription[];
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ subscriptions }) => {
  const spendByModel: Record<string, number> = {};
  const countByModel: Record<string, number> = {};

  subscriptions.forEach(sub => {
    spendByModel[sub.model] = (spendByModel[sub.model] || 0) + sub.cost;
    countByModel[sub.model] = (countByModel[sub.model] || 0) + 1;
  });

  const spendByAccount: Record<string, number> = {};
  const countByAccount: Record<string, number> = {};

  subscriptions.forEach(sub => {
    spendByAccount[sub.account] = (spendByAccount[sub.account] || 0) + sub.cost;
    countByAccount[sub.account] = (countByAccount[sub.account] || 0) + 1;
  });

  const totalMonthlySpend = subscriptions.reduce((sum, s) => sum + s.cost, 0);
  const maxModelSpend = Math.max(...Object.values(spendByModel), 1);
  const maxAccountSpend = Math.max(...Object.values(spendByAccount), 1);

  const cardBox: React.CSSProperties = {
    padding: 22,
    borderRadius: 16,
    border: '1px solid var(--line)',
    background: 'linear-gradient(145deg, rgba(16,25,53,.85), rgba(10,15,34,.9))',
    boxShadow: 'var(--shadow)',
  };

  return (
    <div
      style={{
        padding: 24,
        borderRadius: 'var(--radius)',
        border: '1px solid var(--line)',
        background: 'rgba(14,20,43,.76)',
        boxShadow: 'var(--shadow)',
      }}
    >
      <div style={{ paddingBottom: 16, borderBottom: '1px solid var(--line)', marginBottom: 24 }}>
        <h2 style={{ font: "700 18px 'Space Grotesk'", margin: 0, color: '#fff', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span>◴</span> AI Spending &amp; Quota Analytics
        </h2>
        <p style={{ color: 'var(--muted)', fontSize: 13, marginTop: 4 }}>
          Breakdown of monthly AI model investment across all Gmail accounts
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20 }}>
        {/* Spend by Model */}
        <div style={cardBox}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3 style={{ font: "700 15px 'Space Grotesk'", margin: 0, color: '#e7ebff' }}>
              Investment by AI Model
            </h3>
            <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--green)' }}>
              ${totalMonthlySpend}/mo total
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {Object.entries(spendByModel)
              .sort(([, a], [, b]) => b - a)
              .map(([modelKey, cost]) => {
                const meta = (MODEL_CONFIGS as Record<string, any>)[modelKey] || MODEL_CONFIGS.custom;
                const count = countByModel[modelKey];
                const pct = Math.round((cost / maxModelSpend) * 100);

                return (
                  <div key={modelKey} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                      <span style={{ color: '#fff', display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span>{meta.icon}</span>
                        <strong style={{ fontWeight: 600 }}>{meta.name}</strong>
                        <span style={{ color: 'var(--muted)', fontSize: 11 }}>({count} account{count > 1 ? 's' : ''})</span>
                      </span>
                      <strong style={{ color: 'var(--green)' }}>${cost}/mo</strong>
                    </div>
                    <div style={{ height: 6, borderRadius: 99, background: '#1b2344', overflow: 'hidden' }}>
                      <div
                        style={{
                          height: '100%',
                          width: `${pct}%`,
                          borderRadius: 99,
                          background: meta.color || 'var(--purple)',
                          boxShadow: `0 0 10px ${meta.color || 'var(--purple)'}`,
                          transition: 'width .6s ease',
                        }}
                      />
                    </div>
                  </div>
                );
              })}
          </div>
        </div>

        {/* Spend by Gmail Account */}
        <div style={cardBox}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3 style={{ font: "700 15px 'Space Grotesk'", margin: 0, color: '#e7ebff' }}>
              Investment by Gmail Account
            </h3>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#9a4dff' }}>
              {Object.keys(spendByAccount).length} Accounts
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {Object.entries(spendByAccount)
              .sort(([, a], [, b]) => b - a)
              .map(([account, cost]) => {
                const count = countByAccount[account];
                const pct = Math.round((cost / maxAccountSpend) * 100);

                return (
                  <div key={account} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                      <span style={{ color: '#d7def4', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {account}
                        <span style={{ color: 'var(--muted)', fontSize: 11, marginLeft: 6 }}>({count} model{count > 1 ? 's' : ''})</span>
                      </span>
                      <strong style={{ color: 'var(--green)' }}>${cost}/mo</strong>
                    </div>
                    <div style={{ height: 6, borderRadius: 99, background: '#1b2344', overflow: 'hidden' }}>
                      <div
                        style={{
                          height: '100%',
                          width: `${pct}%`,
                          borderRadius: 99,
                          background: 'linear-gradient(90deg, #9a4dff, #29c8e8)',
                          boxShadow: '0 0 10px rgba(154,77,255,.6)',
                          transition: 'width .6s ease',
                        }}
                      />
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
};
