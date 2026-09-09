import React, { useEffect, useState } from 'react';
import { Subscription } from '../types';
import { getDaysUntil, getSessionCountdown } from '../utils/dateUtils';
import { MODEL_CONFIGS } from '../constants/models';

interface StatsOverviewProps {
  subscriptions: Subscription[];
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({ subscriptions }) => {
  const [, setTick] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setTick(n => n + 1), 1000);
    return () => clearInterval(t);
  }, []);

  const monthlySpend = subscriptions.reduce((sum, s) => {
    if (s.billingCycle === 'monthly') return sum + s.cost;
    if (s.billingCycle === 'yearly')  return sum + Math.round(s.cost / 12);
    if (s.billingCycle === 'weekly')  return sum + s.cost * 4;
    return sum;
  }, 0);

  const lockedSubs = subscriptions.filter(s => s.sessionResetAt && getSessionCountdown(s.sessionResetAt).isLocked);
  const nearestLocked = lockedSubs.sort((a, b) =>
    new Date(a.sessionResetAt!).getTime() - new Date(b.sessionResetAt!).getTime()
  )[0];

  const expiringCount = subscriptions.filter(s => { const d = getDaysUntil(s.renewalDate); return d >= 0 && d <= 5; }).length;
  const expiredCount  = subscriptions.filter(s => getDaysUntil(s.renewalDate) < 0).length;
  const nearestRenewal = [...subscriptions].sort((a, b) => new Date(a.renewalDate).getTime() - new Date(b.renewalDate).getTime())[0];

  const card = (style: React.CSSProperties) => ({
    minHeight: 140, padding: 18,
    border: '1px solid var(--line)',
    background: 'linear-gradient(140deg, rgba(18,27,56,.86), rgba(11,16,36,.85))',
    borderRadius: 'var(--radius)',
    position: 'relative' as const,
    overflow: 'hidden' as const,
    boxShadow: 'var(--shadow)',
    ...style,
  });

  const iconBox = (color?: string) => ({
    width: 37, height: 37, display: 'grid', placeItems: 'center',
    borderRadius: 12,
    color: color || '#d4a2ff',
    background: 'rgba(131,68,255,.15)',
    border: '1px solid rgba(149,72,255,.3)',
    fontSize: 19,
  });

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 17, margin: '26px 0' }}>

      {/* 1 – Monthly Spend */}
      <article style={card({})}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#aeb8d8', fontSize: 13 }}>
          <span>Monthly AI Spend</span>
          <span style={iconBox()}>$</span>
        </div>
        <div style={{ marginTop: 12, font: '700 24px Space Grotesk', color: 'var(--text)' }}>
          ${monthlySpend} <small style={{ color: 'var(--muted)', font: '400 12px DM Sans' }}>/ month est.</small>
        </div>
        <div style={{ marginTop: 7, color: '#9da7c8', fontSize: 12 }}>
          Across {subscriptions.length} models &amp; accounts
        </div>
      </article>

      {/* 2 – Accounts & Models */}
      <article style={card({})}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#aeb8d8', fontSize: 13 }}>
          <span>Active Accounts &amp; Models</span>
          <span style={iconBox()}>▱</span>
        </div>
        <div style={{ marginTop: 12, font: '700 24px Space Grotesk', color: 'var(--text)' }}>
          {new Set(subscriptions.map(s => s.account)).size}{' '}
          <small style={{ color: 'var(--muted)', font: '400 12px DM Sans' }}>Gmail accounts</small>
        </div>
        <div style={{ marginTop: 7, color: '#9da7c8', fontSize: 12 }}>
          ✧ {subscriptions.length} active subscription slots
        </div>
      </article>

      {/* 3 – Live Cooldown */}
      <article style={card(nearestLocked ? {
        border: '1px solid rgba(255,185,61,.38)',
        background: 'linear-gradient(140deg, rgba(52,29,35,.7), rgba(22,17,37,.84))',
      } : {})}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#aeb8d8', fontSize: 13 }}>
          <span>{nearestLocked ? '🔥 Active Cooldown' : 'Rate Limits Status'}</span>
          <span style={iconBox(nearestLocked ? '#ffd65a' : undefined)}>ϟ</span>
        </div>
        {nearestLocked ? (
          <>
            <div id="statTimer" style={{ marginTop: 12, font: '700 24px Space Grotesk', color: '#ffd65a' }}>
              {getSessionCountdown(nearestLocked.sessionResetAt).formatted}
            </div>
            <div style={{ marginTop: 7, color: '#d2b577', fontSize: 12 }}>
              {MODEL_CONFIGS[nearestLocked.model]?.name} · {nearestLocked.account.split('@')[0]}
            </div>
          </>
        ) : (
          <>
            <div style={{ marginTop: 12, font: '700 24px Space Grotesk', color: 'var(--green)' }}>All Clear</div>
            <div style={{ marginTop: 7, color: '#9da7c8', fontSize: 12 }}>No active message limit locks</div>
          </>
        )}
      </article>

      {/* 4 – Renewal Attention */}
      <article style={card({})}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#aeb8d8', fontSize: 13 }}>
          <span>Renewal Attention</span>
          <span style={iconBox('#ffb160')}>⚠</span>
        </div>
        {expiringCount + expiredCount > 0 ? (
          <>
            <div style={{ marginTop: 12, font: '700 24px Space Grotesk', color: 'var(--orange)' }}>
              {expiringCount + expiredCount}{' '}
              <small style={{ color: 'var(--muted)', font: '400 12px DM Sans' }}>need renewal attention</small>
            </div>
            <div style={{ marginTop: 7, color: '#9da7c8', fontSize: 12 }}>
              {expiredCount} expired
            </div>
          </>
        ) : (
          <>
            <div style={{ marginTop: 12, font: '700 24px Space Grotesk', color: 'var(--green)' }}>
              {nearestRenewal ? `${getDaysUntil(nearestRenewal.renewalDate)}d` : '—'}{' '}
              <small style={{ color: 'var(--muted)', font: '400 12px DM Sans' }}>to next renewal</small>
            </div>
            <div style={{ marginTop: 7, color: '#9da7c8', fontSize: 12 }}>All renewals healthy</div>
          </>
        )}
      </article>
    </div>
  );
};
