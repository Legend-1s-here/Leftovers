import React, { useState } from 'react';
import { Subscription } from '../types';
import { MODEL_CONFIGS } from '../constants/models';

interface QuickSessionResetModalProps {
  isOpen: boolean;
  onClose: () => void;
  subscriptions: Subscription[];
  onTriggerReset: (sub: Subscription, hours: number) => void;
}

export const QuickSessionResetModal: React.FC<QuickSessionResetModalProps> = ({
  isOpen,
  onClose,
  subscriptions,
  onTriggerReset,
}) => {
  const [selectedSubId, setSelectedSubId] = useState<string>(subscriptions[0]?.id || '');
  const [hours, setHours] = useState<number>(5);

  if (!isOpen) return null;

  const selectedSub = subscriptions.find(s => s.id === selectedSubId) || subscriptions[0];

  const handleSelectSub = (sub: Subscription) => {
    setSelectedSubId(sub.id);
    const meta = MODEL_CONFIGS[sub.model] || MODEL_CONFIGS.custom;
    setHours(Math.min(336, sub.sessionDurationHours || meta.defaultSessionHours));
  };

  const handleStart = () => {
    if (!selectedSub) return;
    const clampedHours = Math.min(336, Math.max(1, hours)); // 2 weeks max (336 hours)
    onTriggerReset(selectedSub, clampedHours);
    onClose();
  };

  const formatHoursLabel = (h: number) => {
    if (h >= 24) {
      const days = Math.round(h / 24);
      return `${days} Day${days > 1 ? 's' : ''} (${h}h)`;
    }
    return `${h} Hour${h > 1 ? 's' : ''}`;
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 50,
        display: 'grid',
        placeItems: 'center',
        background: 'rgba(4,5,18,.75)',
        backdropFilter: 'blur(10px)',
        padding: 16,
      }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        style={{
          width: 'min(460px, calc(100% - 24px))',
          padding: 26,
          borderRadius: 22,
          border: '1px solid rgba(255,185,61,.45)',
          background: 'linear-gradient(145deg, #181424, #0e0d19)',
          boxShadow: '0 25px 90px rgba(50,25,10,.6)',
          position: 'relative',
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute', top: 18, right: 18,
            background: 'transparent', border: 0, color: 'var(--muted)',
            fontSize: 20, cursor: 'pointer',
          }}
        >
          ✕
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
          <div
            style={{
              width: 44, height: 44, borderRadius: 14,
              background: 'rgba(255,165,91,.18)',
              border: '1px solid rgba(255,185,61,.35)',
              display: 'grid', placeItems: 'center',
              fontSize: 22, color: '#ffd75e',
            }}
          >
            🔥
          </div>
          <div>
            <h2 style={{ font: "700 18px 'Space Grotesk'", color: '#ffd75e', margin: 0 }}>
              Hit Rate Limit? Start Cooldown
            </h2>
            <p style={{ color: '#c5a46a', fontSize: 12, marginTop: 2 }}>
              Start a live countdown (maximum 2 weeks at most)
            </p>
          </div>
        </div>

        {/* Model Selection List */}
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#aeb8d8', marginBottom: 6 }}>
            Select Active Account &amp; Model
          </label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxHeight: 160, overflowY: 'auto', paddingRight: 4 }}>
            {subscriptions.map(s => {
              const meta = MODEL_CONFIGS[s.model] || MODEL_CONFIGS.custom;
              const isSelected = s.id === (selectedSub?.id || '');
              return (
                <button
                  type="button"
                  key={s.id}
                  onClick={() => handleSelectSub(s)}
                  style={{
                    padding: '8px 12px',
                    borderRadius: 10,
                    border: isSelected ? '1px solid #ffd75e' : '1px solid var(--line)',
                    background: isSelected ? 'rgba(255,185,61,.16)' : 'rgba(5,9,26,.66)',
                    color: isSelected ? '#ffd75e' : '#d7def4',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    fontSize: 12,
                    textAlign: 'left',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span>{meta.icon}</span>
                    <div>
                      <strong style={{ display: 'block', fontSize: 12 }}>{meta.name}</strong>
                      <span style={{ color: 'var(--muted)', fontSize: 11 }}>{s.account}</span>
                    </div>
                  </div>
                  {isSelected && (
                    <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 6px', borderRadius: 6, background: '#ffd75e', color: '#070918' }}>
                      SELECTED
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Cooldown duration presets with max 2 weeks limit */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: '#aeb8d8' }}>
              Cooldown Window Duration
            </label>
            <span style={{ fontSize: 11, color: '#ffd75e', fontWeight: 600 }}>
              Max: 2 Weeks (336h)
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
            {[
              { h: 1, label: '1 Hour (AGY)' },
              { h: 3, label: '3 Hours (Codex)' },
              { h: 5, label: '5 Hours (Claude)' },
              { h: 24, label: '1 Day (24h)' },
              { h: 168, label: '1 Week (7d)' },
              { h: 336, label: '2 Weeks Max (14d)' },
            ].map(({ h, label }) => (
              <button
                type="button"
                key={h}
                onClick={() => setHours(h)}
                style={{
                  padding: '8px 4px',
                  borderRadius: 10,
                  border: hours === h ? '1px solid #ffd75e' : '1px solid var(--line)',
                  background: hours === h ? '#ffd75e' : '#080d23',
                  color: hours === h ? '#070918' : 'var(--muted)',
                  fontWeight: hours === h ? 700 : 500,
                  fontSize: 11,
                  cursor: 'pointer',
                  textAlign: 'center',
                  fontFamily: 'inherit',
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
          <button
            onClick={onClose}
            style={{
              padding: '9px 16px', borderRadius: 12,
              background: 'rgba(141,158,225,.12)', color: 'var(--muted)',
              fontSize: 13, border: 0, cursor: 'pointer',
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleStart}
            style={{
              padding: '9px 20px', borderRadius: 12,
              background: 'linear-gradient(135deg, #ffd75e, #ff9e54)',
              color: '#070918', fontWeight: 700, fontSize: 13,
              border: 0, cursor: 'pointer',
              boxShadow: '0 6px 20px rgba(255,158,84,.35)',
            }}
          >
            ⚡ Start {formatHoursLabel(hours)}
          </button>
        </div>
      </div>
    </div>
  );
};
