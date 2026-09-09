import React, { useState, useEffect } from 'react';
import { Subscription, ModelKey, BillingCycle } from '../types';
import { MODEL_CONFIGS, ACCOUNT_COLORS } from '../constants/models';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (sub: Omit<Subscription, 'id' | 'createdAt' | 'updatedAt'>, editId?: string) => void;
  editingSubscription?: Subscription | null;
  existingAccounts: string[];
  initialAccount?: string;
}

export const SubscriptionModal: React.FC<SubscriptionModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingSubscription,
  existingAccounts,
  initialAccount,
}) => {
  const [account, setAccount] = useState('');
  const [accountTag, setAccountTag] = useState('');
  const [model, setModel] = useState<ModelKey>('antigravity');
  const [customModelName, setCustomModelName] = useState('');
  const [plan, setPlan] = useState('Pro');
  const [cost, setCost] = useState(20);
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('monthly');
  const [startedDate, setStartedDate] = useState('');
  const [renewalDate, setRenewalDate] = useState('');
  const [sessionDurationHours, setSessionDurationHours] = useState(1);
  const [notes, setNotes] = useState('');
  const [autoRenew, setAutoRenew] = useState(true);

  useEffect(() => {
    if (editingSubscription) {
      setAccount(editingSubscription.account);
      setAccountTag(editingSubscription.accountTag || '');
      setModel(editingSubscription.model);
      setCustomModelName(editingSubscription.customModelName || '');
      setPlan(editingSubscription.plan);
      setCost(editingSubscription.cost);
      setBillingCycle(editingSubscription.billingCycle);
      setStartedDate(editingSubscription.startedDate || '');
      setRenewalDate(editingSubscription.renewalDate);
      setSessionDurationHours(editingSubscription.sessionDurationHours || 5);
      setNotes(editingSubscription.notes || '');
      setAutoRenew(editingSubscription.autoRenew);
    } else {
      const today = new Date();
      const nextMonth = new Date(today);
      nextMonth.setMonth(nextMonth.getMonth() + 1);

      setAccount(initialAccount || (existingAccounts[0] || ''));
      setAccountTag('');
      setModel('claude');
      setCustomModelName('');
      setPlan('Pro Tier');
      setCost(20);
      setBillingCycle('monthly');
      setStartedDate(today.toISOString().slice(0, 10));
      setRenewalDate(nextMonth.toISOString().slice(0, 10));
      setSessionDurationHours(5);
      setNotes('');
      setAutoRenew(true);
    }
  }, [editingSubscription, initialAccount, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!account.trim() || !renewalDate) return;

    const accountIndex = Math.abs(
      account.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
    ) % ACCOUNT_COLORS.length;
    const accountColor = ACCOUNT_COLORS[accountIndex];

    onSave(
      {
        account: account.trim(),
        accountTag: accountTag.trim() || undefined,
        accountColor,
        model,
        customModelName: model === 'custom' ? customModelName.trim() : undefined,
        plan: plan.trim() || 'Pro',
        cost: Number(cost) || 0,
        billingCycle,
        startedDate: startedDate || undefined,
        renewalDate,
        sessionDurationHours: Number(sessionDurationHours) || 5,
        notes: notes.trim() || undefined,
        autoRenew,
      },
      editingSubscription ? editingSubscription.id : undefined
    );
    onClose();
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '10px 14px',
    borderRadius: 10,
    border: '1px solid var(--line)',
    background: '#080d23',
    color: '#fff',
    font: 'inherit',
    fontSize: 13,
    outline: 'none',
    boxSizing: 'border-box',
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: 12,
    fontWeight: 600,
    color: '#aeb8d8',
    marginBottom: 6,
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
        overflowY: 'auto',
      }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        style={{
          width: 'min(520px, calc(100% - 24px))',
          padding: 28,
          borderRadius: 22,
          border: '1px solid rgba(167,98,255,.45)',
          background: 'linear-gradient(145deg, #111735, #0a0e22)',
          boxShadow: '0 25px 100px rgba(40,14,97,.65)',
          position: 'relative',
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: 20,
            right: 20,
            background: 'transparent',
            border: 0,
            color: 'var(--muted)',
            fontSize: 20,
            cursor: 'pointer',
            padding: 4,
          }}
        >
          ✕
        </button>

        {/* Modal Header */}
        <div style={{ marginBottom: 20 }}>
          <h2 style={{ font: "700 20px 'Space Grotesk'", color: '#fff', margin: 0 }}>
            {editingSubscription ? 'Edit AI Subscription ✦' : 'Add a new subscription ✦'}
          </h2>
          <p style={{ marginTop: 4, color: 'var(--muted)', fontSize: 13 }}>
            Connect and configure model quota and billing details in QuotaVerse
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 16 }}>
          {/* Account Email */}
          <div>
            <label style={labelStyle}>
              Gmail / Account Email <span style={{ color: '#ff557e' }}>*</span>
            </label>
            <input
              type="email"
              required
              placeholder="e.g. yourname@gmail.com"
              value={account}
              onChange={e => setAccount(e.target.value)}
              style={inputStyle}
            />
            {existingAccounts.length > 0 && !editingSubscription && (
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 6 }}>
                <span style={{ fontSize: 11, color: 'var(--muted)' }}>Quick fill:</span>
                {existingAccounts.map(acc => (
                  <button
                    type="button"
                    key={acc}
                    onClick={() => setAccount(acc)}
                    style={{
                      fontSize: 10,
                      padding: '2px 7px',
                      borderRadius: 6,
                      background: 'rgba(140,70,255,.15)',
                      border: '1px solid rgba(140,70,255,.3)',
                      color: '#d9caff',
                      cursor: 'pointer',
                    }}
                  >
                    {acc}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Tag & Plan */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={labelStyle}>Account Tag</label>
              <input
                type="text"
                placeholder="Work, Personal..."
                value={accountTag}
                onChange={e => setAccountTag(e.target.value)}
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Plan / Tier</label>
              <input
                type="text"
                placeholder="Pro, Team, Max 5x"
                value={plan}
                onChange={e => setPlan(e.target.value)}
                style={inputStyle}
              />
            </div>
          </div>

          {/* Model Selection */}
          <div>
            <label style={labelStyle}>AI Model Platform</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
              {Object.values(MODEL_CONFIGS).map(cfg => {
                const isSelected = model === cfg.key;
                return (
                  <button
                    type="button"
                    key={cfg.key}
                    onClick={() => {
                      setModel(cfg.key);
                      setSessionDurationHours(cfg.defaultSessionHours);
                    }}
                    style={{
                      padding: '8px 6px',
                      borderRadius: 11,
                      border: isSelected ? '1px solid #9a4dff' : '1px solid var(--line)',
                      background: isSelected ? 'rgba(154,77,255,.24)' : '#080d23',
                      color: isSelected ? '#fff' : 'var(--muted)',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 4,
                      fontSize: 11,
                      fontWeight: isSelected ? 700 : 500,
                      fontFamily: 'inherit',
                      transition: 'all .2s',
                    }}
                  >
                    <span style={{ fontSize: 18 }}>{cfg.icon}</span>
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '100%' }}>
                      {cfg.name.split(' ')[0]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {model === 'custom' && (
            <div>
              <label style={labelStyle}>Custom Model Name</label>
              <input
                type="text"
                required
                placeholder="e.g. DeepSeek V3, Mistral Large..."
                value={customModelName}
                onChange={e => setCustomModelName(e.target.value)}
                style={inputStyle}
              />
            </div>
          )}

          {/* Cost, Billing Cycle & Reset Hours */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1.2fr', gap: 10 }}>
            <div>
              <label style={labelStyle}>Cost ($)</label>
              <input
                type="number"
                min="0"
                value={cost}
                onChange={e => setCost(parseFloat(e.target.value) || 0)}
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Billing Cycle</label>
              <select
                value={billingCycle}
                onChange={e => setBillingCycle(e.target.value as BillingCycle)}
                style={{ ...inputStyle, cursor: 'pointer' }}
              >
                <option value="weekly">Weekly (7d)</option>
                <option value="bi-weekly">2 Weeks (14d)</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
                <option value="free">Free</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Limit Reset (Hours, Max 2w)</label>
              <input
                type="number"
                min="1"
                max="336"
                placeholder="Hours (1-336)"
                value={sessionDurationHours}
                onChange={e => setSessionDurationHours(Math.min(336, Math.max(1, parseInt(e.target.value) || 1)))}
                style={inputStyle}
              />
              <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginTop: 6 }}>
                {[
                  { label: '5h', val: 5 },
                  { label: '24h', val: 24 },
                  { label: '7d (168h)', val: 168 },
                  { label: '14d (336h)', val: 336 },
                ].map(({ label, val }) => (
                  <button
                    type="button"
                    key={val}
                    onClick={() => setSessionDurationHours(val)}
                    style={{
                      fontSize: 10,
                      padding: '2px 6px',
                      borderRadius: 6,
                      background: sessionDurationHours === val ? 'rgba(154,77,255,.3)' : 'rgba(140,70,255,.12)',
                      border: sessionDurationHours === val ? '1px solid #9a4dff' : '1px solid rgba(140,70,255,.25)',
                      color: sessionDurationHours === val ? '#fff' : '#d9caff',
                      cursor: 'pointer',
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Renewal Date */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={labelStyle}>Start Date</label>
              <input
                type="date"
                value={startedDate}
                onChange={e => setStartedDate(e.target.value)}
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>
                Renewal Date <span style={{ color: '#ff557e' }}>*</span>
              </label>
              <input
                type="date"
                required
                value={renewalDate}
                onChange={e => setRenewalDate(e.target.value)}
                style={inputStyle}
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label style={labelStyle}>Notes</label>
            <input
              type="text"
              placeholder="e.g. Card details, secondary account..."
              value={notes}
              onChange={e => setNotes(e.target.value)}
              style={inputStyle}
            />
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 8 }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '10px 18px',
                borderRadius: 12,
                background: 'rgba(141,158,225,.12)',
                color: 'var(--muted)',
                fontSize: 13,
                fontWeight: 600,
                border: 0,
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{
                padding: '10px 22px',
                borderRadius: 12,
                background: 'linear-gradient(135deg, #993dff, #6328dc)',
                boxShadow: '0 8px 24px rgba(111,41,228,.35)',
                color: '#fff',
                fontSize: 13,
                fontWeight: 700,
                border: 0,
                cursor: 'pointer',
              }}
            >
              {editingSubscription ? 'Save Changes' : 'Add Subscription'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
