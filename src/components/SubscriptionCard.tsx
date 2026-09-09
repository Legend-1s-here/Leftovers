import React, { useState, useEffect } from 'react';
import { Subscription } from '../types';
import { MODEL_CONFIGS } from '../constants/models';
import {
  formatDateDisplay,
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
}

export const SubscriptionCard: React.FC<SubscriptionCardProps> = ({
  subscription: sub,
  onEdit,
  onDelete,
  onTriggerSessionReset,
  onClearSessionReset,
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
  const progressClass = status === 'expired' ? '' : status === 'expiring' ? 'orange' : 'blue';
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
        padding: 19,
        minHeight: 345,
        border: hovered ? '1px solid rgba(159,114,255,.72)' : '1px solid var(--line)',
        borderTop: `2px solid ${accentColor}`,
        borderRadius: 17,
        background: 'linear-gradient(145deg, rgba(16,25,53,.92), rgba(10,15,34,.93))',
        boxShadow: hovered ? '0 24px 55px rgba(28,15,75,.42)' : 'var(--shadow)',
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
        width: 155, height: 150, pointerEvents: 'none',
        background: 'radial-gradient(circle, rgba(59,126,255,.16), transparent 68%)',
      }} />

      {/* "// QUOTA LINK" manga text */}
      <span style={{
        position: 'absolute', right: 15, bottom: 11,
        color: 'rgba(162,181,255,.27)', font: "9px 'Space Grotesk'",
        letterSpacing: '1.4px', transform: 'skew(-15deg)', pointerEvents: 'none',
      }}>// QUOTA LINK</span>

      {/* Card head */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10 }}>
        <div style={{ display: 'flex', gap: 11, alignItems: 'center' }}>
          <div
            style={{
              width: 43, height: 43, display: 'grid', placeItems: 'center',
              borderRadius: 13,
              background: `${accentColor}22`,
              border: `1px solid ${accentColor}44`,
              fontSize: 22,
              transition: 'all .3s',
            }}
          >
            {meta.icon}
          </div>
          <div>
            <h3 style={{ font: "700 16px 'Space Grotesk'", margin: 0 }}>
              {sub.model === 'custom' && sub.customModelName ? sub.customModelName : meta.name}
            </h3>
            <p style={{ marginTop: 3, color: 'var(--muted)', fontSize: 11 }}>{sub.plan}</p>
          </div>
        </div>
        <span style={{ padding: '7px 10px', borderRadius: 10, fontSize: 11, whiteSpace: 'pre-line', textAlign: 'right', ...b.style }}>
          {b.text}
        </span>
      </div>

      {/* Account pill */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        marginTop: 17, padding: '10px 12px',
        border: '1px solid rgba(131,147,221,.14)',
        borderRadius: 11, background: 'rgba(4,9,25,.44)',
        color: '#d7def4', fontSize: 12,
      }}>
        <i style={{ width: 8, height: 8, borderRadius: '50%', background: sub.accountColor || '#4cdbac', boxShadow: `0 0 9px ${sub.accountColor || '#4cdbac'}`, display: 'inline-block' }} />
        <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{sub.account}</span>
        {sub.accountTag && (
          <span style={{ marginLeft: 'auto', color: '#a992ff', background: 'rgba(144,75,255,.2)', padding: '4px 7px', borderRadius: 6, fontSize: 10 }}>
            {sub.accountTag}
          </span>
        )}
      </div>

      {/* Live cooldown timer (if rate-locked) */}
      {session.isLocked && (
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          marginTop: 18, padding: 13,
          border: '1px solid rgba(255,185,61,.38)',
          borderRadius: 13, background: 'rgba(70,42,27,.35)',
          color: '#ffd760',
        }}>
          <div>
            <small style={{ display: 'block', color: '#c5a46a', fontSize: 10, marginBottom: 3 }}>◷ Quota Unlocks In:</small>
            <span className="countdown" style={{ font: "700 17px 'Space Grotesk'", letterSpacing: '.4px' }}>{session.formatted}</span>
          </div>
          <button
            onClick={() => onClearSessionReset(sub.id)}
            style={{ color: '#ffdb6d', fontSize: 11, textDecoration: 'underline', background: 'transparent', border: 0, cursor: 'pointer', font: 'inherit' }}
          >
            Clear Lock
          </button>
        </div>
      )}

      {/* Details */}
      <div style={{ marginTop: 18, display: 'grid', gap: 12, color: 'var(--muted)', fontSize: 12 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
          <span>▣ Renewal / Reset Date</span>
          <strong style={{ color: '#e7ebff', fontSize: 12 }}>{formatDateDisplay(sub.renewalDate)}</strong>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
          <span>Cost / Billing</span>
          <strong style={{ color: 'var(--green)', fontSize: 12 }}>
            ${sub.cost} <small style={{ color: 'var(--muted)' }}>/{sub.billingCycle}</small>
          </strong>
        </div>
      </div>

      {/* Cycle progress bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', margin: '16px 0 7px', color: 'var(--muted)', fontSize: 11 }}>
        <span>Billing Cycle</span><span>{cyclePct}% Elapsed</span>
      </div>
      <div style={{ height: 5, overflow: 'hidden', borderRadius: 99, background: '#1b2344' }}>
        <i style={{ display: 'block', height: '100%', borderRadius: 99, width: `${cyclePct}%`, background: progressGrad, boxShadow: progressGlow }} />
      </div>

      {/* Notes */}
      {sub.notes && (
        <div style={{ marginTop: 12, color: 'var(--muted)', fontSize: 11, fontStyle: 'italic' }}>
          {sub.notes}
        </div>
      )}

      {/* Footer action buttons */}
      <div style={{
        position: 'absolute', bottom: 16, left: 19, right: 19,
        display: 'flex', justifyContent: 'space-between', gap: 8,
      }}>
        <button
          onClick={() => onTriggerSessionReset(sub, sub.sessionDurationHours || meta.defaultSessionHours)}
          style={{
            padding: '7px 10px', color: '#ffc95a',
            border: '1px solid rgba(202,146,54,.4)', borderRadius: 8,
            background: 'rgba(70,42,27,.3)', fontSize: 11, cursor: 'pointer', font: 'inherit',
          }}
        >
          ϟ Hit Limit ({sub.sessionDurationHours || meta.defaultSessionHours}h)
        </button>
        <div style={{ display: 'flex', gap: 6 }}>
          <button
            onClick={() => onEdit(sub)}
            style={{ padding: '7px 10px', color: '#aab4d4', border: '1px solid rgba(144,160,232,.16)', borderRadius: 8, background: 'rgba(24,33,66,.63)', fontSize: 11, cursor: 'pointer', font: 'inherit' }}
          >
            ✏ Edit
          </button>
          <button
            onClick={() => onDelete(sub.id)}
            style={{ padding: '7px 10px', color: '#ff8ba1', border: '1px solid rgba(239,91,121,.2)', borderRadius: 8, background: 'rgba(132,30,60,.12)', fontSize: 11, cursor: 'pointer', font: 'inherit' }}
          >
            🗑
          </button>
        </div>
      </div>
    </article>
  );
};
