import React, { useState, useEffect } from 'react';
import { Subscription } from '../types';
import { MODEL_CONFIGS } from '../constants/models';
import {
  formatDateDisplay,
  formatExactDateTime,
  getDaysUntil,
  getSessionCountdown,
  getCycleProgress,
  getSubscriptionStatus,
} from '../utils/dateUtils';

interface SubscriptionCardProps {
  subscription: Subscription;
  onEdit: (sub: Subscription) => void;
  onDelete: (id: string) => void;
  onTriggerSessionReset: (sub: Subscription, hours: number) => void;
  onClearSessionReset: (id: string) => void;
  onOpenExactTimeModal?: (sub: Subscription) => void;
}

export const SubscriptionCard: React.FC<SubscriptionCardProps> = ({
  subscription: sub,
  onEdit,
  onDelete,
  onTriggerSessionReset,
  onClearSessionReset,
  onOpenExactTimeModal,
}) => {
  const [, setTick] = useState(0);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setTick(n => n + 1), 1000);
    return () => clearInterval(t);
  }, []);

  const meta       = MODEL_CONFIGS[sub.model] || MODEL_CONFIGS.custom;
  const status     = getSubscriptionStatus(sub);
  const daysLeft   = getDaysUntil(sub.renewalDate);
  const cyclePct   = getCycleProgress(sub.startedDate, sub.renewalDate);
  const session    = getSessionCountdown(sub.sessionResetAt);

  /* ----- badge ----- */
  const badge = () => {
    if (session.isLocked) return { text: 'ϟ Rate Limit\nCooldown', style: { color: '#ffc95a', border: '1px solid rgba(251,184,62,.3)', background: 'rgba(91,65,26,.25)' } };
    if (daysLeft < 0)  return { text: `◷ Expired ${Math.abs(daysLeft)}d ago`, style: { color: '#ff8ba1', border: '1px solid rgba(239,91,121,.3)', background: 'rgba(132,30,60,.22)' } };
    if (daysLeft <= 5) return { text: `◷ Renews in\n${daysLeft}d`, style: { color: '#ffc95a', border: '1px solid rgba(251,184,62,.3)', background: 'rgba(91,65,26,.25)' } };
    return { text: `✓ Active (${daysLeft}d)`, style: { color: '#4cdbac', border: '1px solid rgba(76,219,172,.3)', background: 'rgba(26,91,65,.22)' } };
  };
  const b = badge();

  /* ----- progress colors ----- */
  const progressGrad = status === 'expired'
    ? 'linear-gradient(90deg, #fd5b5f, #ff4568)'
    : status === 'expiring'
    ? 'linear-gradient(90deg, #ff9a48, #ffd44e)'
    : 'linear-gradient(90deg, #5ecfff, #9b58ff)';
  const progressGlow = status === 'expired'
    ? '0 0 11px rgba(255,91,95,.7)'
    : status === 'expiring'
    ? '0 0 11px rgba(255,181,68,.7)'
    : '0 0 11px rgba(102,113,255,.7)';

  /* top accent colour per model */
  const accentColor = meta.color;

  return (
    <article
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative',
        padding: '24px 22px 24px',
        minHeight: 410,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        border: hovered ? '1px solid rgba(159,114,255,.72)' : '1px solid var(--line)',
        borderTop: `3px solid ${accentColor}`,
        borderRadius: 20,
        background: 'linear-gradient(145deg, rgba(16,25,53,.94), rgba(10,15,34,.96))',
        boxShadow: hovered ? '0 28px 65px rgba(28,15,75,.48)' : 'var(--shadow)',
        overflow: 'hidden',
        transition: 'transform .28s, border-color .28s, box-shadow .28s',
        transform: hovered ? 'translateY(-6px)' : 'none',
        animation: 'rise .7s both',
      }}
    >
      {/* Manga energy ring decoration */}
      <div className="energy-ring" />

      {/* Top glare */}
      <div style={{
        position: 'absolute', top: -65, right: -30,
        width: 175, height: 170, pointerEvents: 'none',
        background: 'radial-gradient(circle, rgba(59,126,255,.18), transparent 68%)',
      }} />

      {/* Top Card Head */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10 }}>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <div
              style={{
                width: 48, height: 48, display: 'grid', placeItems: 'center',
                borderRadius: 15,
                background: `${accentColor}22`,
                border: `1px solid ${accentColor}44`,
                fontSize: 24,
                transition: 'all .3s',
              }}
            >
              {meta.icon}
            </div>
            <div>
              <h3 style={{ font: "700 17px 'Space Grotesk'", margin: 0, color: '#fff' }}>
                {sub.model === 'custom' && sub.customModelName ? sub.customModelName : meta.name}
              </h3>
              <p style={{ marginTop: 4, color: 'var(--muted)', fontSize: 12 }}>{sub.plan}</p>
            </div>
          </div>
          <span style={{ padding: '7px 11px', borderRadius: 10, fontSize: 11, whiteSpace: 'pre-line', textAlign: 'right', fontWeight: 600, ...b.style }}>
            {b.text}
          </span>
        </div>

        {/* Account pill */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 9,
          marginTop: 18, padding: '11px 14px',
          border: '1px solid rgba(131,147,221,.16)',
          borderRadius: 12, background: 'rgba(4,9,25,.55)',
          color: '#d7def4', fontSize: 12,
        }}>
          <i style={{ width: 9, height: 9, borderRadius: '50%', background: sub.accountColor || '#4cdbac', boxShadow: `0 0 10px ${sub.accountColor || '#4cdbac'}`, display: 'inline-block' }} />
          <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: 500 }}>{sub.account}</span>
          {sub.accountTag && (
            <span style={{ marginLeft: 'auto', color: '#a992ff', background: 'rgba(144,75,255,.2)', padding: '4px 8px', borderRadius: 6, fontSize: 10, fontWeight: 600 }}>
              {sub.accountTag}
            </span>
          )}
        </div>

        {/* Live cooldown timer & exact refresh timestamp */}
        {session.isLocked && (
          <div style={{
            marginTop: 18, padding: 14,
            border: '1px solid rgba(255,185,61,.45)',
            borderRadius: 14, background: 'rgba(70,42,27,.4)',
            color: '#ffd760',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <small style={{ display: 'block', color: '#ffd760', fontSize: 11, fontWeight: 600, marginBottom: 3 }}>
                  ◷ Quota Unlocks In:
                </small>
                <span className="countdown" style={{ font: "700 18px 'Space Grotesk'", letterSpacing: '.4px', color: '#fff' }}>
                  {session.formatted}
                </span>
              </div>
              <button
                onClick={() => onClearSessionReset(sub.id)}
                style={{
                  color: '#ffdb6d',
                  fontSize: 11,
                  padding: '4px 8px',
                  borderRadius: 6,
                  background: 'rgba(255,185,61,.18)',
                  border: '1px solid rgba(255,185,61,.3)',
                  cursor: 'pointer',
                  font: 'inherit',
                  fontWeight: 600,
                }}
              >
                Clear Lock
              </button>
            </div>

            {/* Exact Timestamp Display */}
            {sub.sessionResetAt && (
              <div style={{ marginTop: 8, paddingTop: 8, borderTop: '1px solid rgba(255,185,61,.2)', fontSize: 11, color: '#f3cf8a', display: 'flex', alignItems: 'center', gap: 5 }}>
                <span>✦ Refreshes on:</span>
                <strong style={{ color: '#fff', letterSpacing: '.2px' }}>{formatExactDateTime(sub.sessionResetAt)}</strong>
              </div>
            )}
          </div>
        )}

        {/* Key Details Grid */}
        <div style={{ marginTop: 18, display: 'grid', gap: 11, color: 'var(--muted)', fontSize: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>▣ Renewal / Reset Date</span>
            <strong style={{ color: '#e7ebff', fontSize: 12 }}>{formatDateDisplay(sub.renewalDate)}</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>Cost / Billing</span>
            <strong style={{ color: 'var(--green)', fontSize: 12 }}>
              ${sub.cost} <small style={{ color: 'var(--muted)' }}>/{sub.billingCycle}</small>
            </strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>Default Rolling Limit</span>
            <strong style={{ color: '#d9caff', fontSize: 12 }}>
              {sub.sessionDurationHours || meta.defaultSessionHours} Hours
            </strong>
          </div>
        </div>

        {/* Cycle progress bar */}
        <div style={{ marginTop: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, color: 'var(--muted)', fontSize: 11 }}>
            <span>Billing Cycle Progress</span>
            <span style={{ fontWeight: 600, color: '#e7ebff' }}>{cyclePct}% Elapsed</span>
          </div>
          <div style={{ height: 6, overflow: 'hidden', borderRadius: 99, background: '#171e3d' }}>
            <i style={{ display: 'block', height: '100%', borderRadius: 99, width: `${cyclePct}%`, background: progressGrad, boxShadow: progressGlow }} />
          </div>
        </div>

        {/* Notes */}
        {sub.notes && (
          <div style={{ marginTop: 14, color: 'var(--muted)', fontSize: 11, fontStyle: 'italic', background: 'rgba(10,15,34,.5)', padding: '6px 10px', borderRadius: 8, border: '1px solid rgba(131,147,221,.1)' }}>
            "{sub.notes}"
          </div>
        )}
      </div>

      {/* Bottom Action Bar */}
      <div style={{
        marginTop: 20,
        paddingTop: 14,
        borderTop: '1px solid rgba(144,153,220,.1)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 8,
      }}>
        <button
          onClick={() => {
            if (onOpenExactTimeModal) {
              onOpenExactTimeModal(sub);
            } else {
              onTriggerSessionReset(sub, sub.sessionDurationHours || meta.defaultSessionHours);
            }
          }}
          title="Click to set exact refresh time or start limit cooldown"
          style={{
            padding: '8px 12px',
            color: '#ffc95a',
            border: '1px solid rgba(202,146,54,.45)',
            borderRadius: 10,
            background: 'rgba(70,42,27,.35)',
            fontSize: 11,
            fontWeight: 700,
            cursor: 'pointer',
            font: 'inherit',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          <span>⏱</span>
          <span>Set Refresh Time</span>
        </button>

        <div style={{ display: 'flex', gap: 6 }}>
          <button
            onClick={() => onEdit(sub)}
            style={{
              padding: '8px 12px',
              color: '#d7def4',
              border: '1px solid rgba(144,160,232,.2)',
              borderRadius: 10,
              background: 'rgba(24,33,66,.7)',
              fontSize: 11,
              fontWeight: 600,
              cursor: 'pointer',
              font: 'inherit',
            }}
          >
            ✏ Edit
          </button>
          <button
            onClick={() => onDelete(sub.id)}
            style={{
              padding: '8px 11px',
              color: '#ff8ba1',
              border: '1px solid rgba(239,91,121,.25)',
              borderRadius: 10,
              background: 'rgba(132,30,60,.16)',
              fontSize: 11,
              cursor: 'pointer',
              font: 'inherit',
            }}
          >
            🗑
          </button>
        </div>
      </div>
    </article>
  );
};
