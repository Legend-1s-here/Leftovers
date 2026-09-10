import React, { useState, useEffect } from 'react';
import { Subscription } from '../types';
import { MODEL_CONFIGS } from '../constants/models';
import { formatExactDateTime, parseFlexibleDateTime, getSessionCountdown } from '../utils/dateUtils';

interface QuickSessionResetModalProps {
  isOpen: boolean;
  onClose: () => void;
  subscriptions: Subscription[];
  onTriggerReset: (sub: Subscription, hoursOrDate: number | Date | string) => void;
  initialSubscription?: Subscription | null;
}

export const QuickSessionResetModal: React.FC<QuickSessionResetModalProps> = ({
  isOpen,
  onClose,
  subscriptions,
  onTriggerReset,
  initialSubscription,
}) => {
  const [selectedSubId, setSelectedSubId] = useState<string>(
    initialSubscription?.id || subscriptions[0]?.id || ''
  );
  const [tab, setTab] = useState<'presets' | 'manual'>('manual');
  const [hours, setHours] = useState<number>(5);
  const [manualInput, setManualInput] = useState<string>('');

  useEffect(() => {
    if (initialSubscription) {
      setSelectedSubId(initialSubscription.id);
      if (initialSubscription.sessionResetAt) {
        setManualInput(formatExactDateTime(initialSubscription.sessionResetAt));
      } else {
        const d = new Date();
        d.setHours(d.getHours() + (initialSubscription.sessionDurationHours || 5));
        setManualInput(formatExactDateTime(d.toISOString()));
      }
    } else if (subscriptions.length > 0 && !selectedSubId) {
      setSelectedSubId(subscriptions[0].id);
      const d = new Date();
      d.setHours(d.getHours() + 5);
      setManualInput(formatExactDateTime(d.toISOString()));
    }
  }, [initialSubscription, subscriptions, isOpen]);

  if (!isOpen) return null;

  const selectedSub = subscriptions.find(s => s.id === selectedSubId) || subscriptions[0];

  const handleSelectSub = (sub: Subscription) => {
    setSelectedSubId(sub.id);
    const meta = MODEL_CONFIGS[sub.model] || MODEL_CONFIGS.custom;
    const defHours = Math.min(336, sub.sessionDurationHours || meta.defaultSessionHours);
    setHours(defHours);
    const d = new Date();
    d.setHours(d.getHours() + defHours);
    setManualInput(formatExactDateTime(d.toISOString()));
  };

  const handleStartPreset = () => {
    if (!selectedSub) return;
    const clampedHours = Math.min(336, Math.max(1, hours));
    onTriggerReset(selectedSub, clampedHours);
    onClose();
  };

  const handleStartManual = () => {
    if (!selectedSub) return;
    const parsed = parseFlexibleDateTime(manualInput.trim());
    if (parsed) {
      onTriggerReset(selectedSub, parsed);
      onClose();
    } else {
      alert('Please enter a valid date and time (e.g. 9/11/2026, 2:01:07 AM)');
    }
  };

  const parsedPreview = parseFlexibleDateTime(manualInput.trim());
  const previewCountdown = parsedPreview ? getSessionCountdown(parsedPreview.toISOString()) : null;

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '11px 14px',
    borderRadius: 12,
    border: '1px solid rgba(255,185,61,.35)',
    background: '#080d23',
    color: '#fff',
    font: "14px 'Space Grotesk', monospace",
    outline: 'none',
    boxSizing: 'border-box',
    letterSpacing: '.3px',
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 50,
        display: 'grid',
        placeItems: 'center',
        background: 'rgba(4,5,18,.78)',
        backdropFilter: 'blur(10px)',
        padding: 16,
      }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        style={{
          width: 'min(520px, calc(100% - 24px))',
          padding: 28,
          borderRadius: 24,
          border: '1px solid rgba(255,185,61,.45)',
          background: 'linear-gradient(145deg, #181424, #0e0d19)',
          boxShadow: '0 25px 90px rgba(50,25,10,.65)',
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

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <div
            style={{
              width: 46, height: 46, borderRadius: 15,
              background: 'rgba(255,165,91,.18)',
              border: '1px solid rgba(255,185,61,.35)',
              display: 'grid', placeItems: 'center',
              fontSize: 24, color: '#ffd75e',
            }}
          >
            ⏱
          </div>
          <div>
            <h2 style={{ font: "700 19px 'Space Grotesk'", color: '#ffd75e', margin: 0 }}>
              Set Quota Refresh Time
            </h2>
            <p style={{ color: '#c5a46a', fontSize: 12, marginTop: 2 }}>
              Input exact date &amp; time or choose a rolling cooldown window
            </p>
          </div>
        </div>

        {/* Model Selection List */}
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#aeb8d8', marginBottom: 6 }}>
            Select AI Account &amp; Model
          </label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxHeight: 130, overflowY: 'auto', paddingRight: 4 }}>
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

        {/* Tab Switcher */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 16, background: 'rgba(5,9,26,.6)', padding: 4, borderRadius: 12, border: '1px solid var(--line)' }}>
          <button
            type="button"
            onClick={() => setTab('manual')}
            style={{
              flex: 1,
              padding: '8px',
              borderRadius: 9,
              border: tab === 'manual' ? '1px solid rgba(255,185,61,.4)' : '1px solid transparent',
              background: tab === 'manual' ? 'rgba(255,185,61,.18)' : 'transparent',
              color: tab === 'manual' ? '#ffd75e' : 'var(--muted)',
              fontSize: 12,
              fontWeight: 700,
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            📅 Exact Date &amp; Time Input
          </button>
          <button
            type="button"
            onClick={() => setTab('presets')}
            style={{
              flex: 1,
              padding: '8px',
              borderRadius: 9,
              border: tab === 'presets' ? '1px solid rgba(255,185,61,.4)' : '1px solid transparent',
              background: tab === 'presets' ? 'rgba(255,185,61,.18)' : 'transparent',
              color: tab === 'presets' ? '#ffd75e' : 'var(--muted)',
              fontSize: 12,
              fontWeight: 700,
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            ⚡ Quick Hours Presets
          </button>
        </div>

        {/* Tab Content: Manual Date & Time */}
        {tab === 'manual' && (
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#aeb8d8', marginBottom: 6 }}>
              Enter Refresh Date &amp; Time (e.g. <span style={{ color: '#ffd75e' }}>9/11/2026, 2:01:07 AM</span>)
            </label>
            <input
              type="text"
              placeholder="e.g. 9/11/2026, 2:01:07 AM"
              value={manualInput}
              onChange={e => setManualInput(e.target.value)}
              style={inputStyle}
            />

            {/* Quick helper offsets */}
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 10 }}>
              {[
                { label: '+1h (Antigravity)', fn: () => { const d = new Date(); d.setHours(d.getHours() + 1); setManualInput(formatExactDateTime(d.toISOString())); } },
                { label: '+3h (Codex)', fn: () => { const d = new Date(); d.setHours(d.getHours() + 3); setManualInput(formatExactDateTime(d.toISOString())); } },
                { label: '+5h (Claude)', fn: () => { const d = new Date(); d.setHours(d.getHours() + 5); setManualInput(formatExactDateTime(d.toISOString())); } },
                { label: 'Tomorrow 2:01:07 AM', fn: () => { const d = new Date(); d.setDate(d.getDate() + 1); d.setHours(2, 1, 7, 0); setManualInput(formatExactDateTime(d.toISOString())); } },
                { label: '+7 Days', fn: () => { const d = new Date(); d.setDate(d.getDate() + 7); setManualInput(formatExactDateTime(d.toISOString())); } },
                { label: '+14 Days (Max)', fn: () => { const d = new Date(); d.setDate(d.getDate() + 14); setManualInput(formatExactDateTime(d.toISOString())); } },
              ].map(({ label, fn }) => (
                <button
                  type="button"
                  key={label}
                  onClick={fn}
                  style={{
                    fontSize: 11,
                    padding: '4px 9px',
                    borderRadius: 8,
                    background: 'rgba(255,185,61,.14)',
                    border: '1px solid rgba(255,185,61,.3)',
                    color: '#ffd75e',
                    cursor: 'pointer',
                    fontWeight: 600,
                  }}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Live Parsing Preview */}
            <div style={{ marginTop: 14, padding: 12, borderRadius: 12, background: 'rgba(255,185,61,.1)', border: '1px solid rgba(255,185,61,.25)' }}>
              {parsedPreview ? (
                <div style={{ fontSize: 12, color: '#f3cf8a' }}>
                  <div>✦ Refreshes on: <strong style={{ color: '#fff' }}>{formatExactDateTime(parsedPreview.toISOString())}</strong></div>
                  <div style={{ marginTop: 4, color: '#4cdbac', fontWeight: 600 }}>
                    ⏱ Countdown: {previewCountdown?.isLocked ? previewCountdown.formatted : 'Time reached!'}
                  </div>
                </div>
              ) : (
                <div style={{ fontSize: 12, color: '#ff8ba1' }}>
                  ⚠️ Invalid format. Try: <strong>9/11/2026, 2:01:07 AM</strong>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab Content: Presets */}
        {tab === 'presets' && (
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
                  onClick={() => {
                    setHours(h);
                    const d = new Date();
                    d.setHours(d.getHours() + h);
                    setManualInput(formatExactDateTime(d.toISOString()));
                  }}
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
        )}

        {/* Action Buttons */}
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
            onClick={tab === 'manual' ? handleStartManual : handleStartPreset}
            style={{
              padding: '9px 20px', borderRadius: 12,
              background: 'linear-gradient(135deg, #ffd75e, #ff9e54)',
              color: '#070918', fontWeight: 700, fontSize: 13,
              border: 0, cursor: 'pointer',
              boxShadow: '0 6px 20px rgba(255,158,84,.35)',
            }}
          >
            ⚡ Set Refresh Time
          </button>
        </div>
      </div>
    </div>
  );
};
