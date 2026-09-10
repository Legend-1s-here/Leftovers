import React from 'react';
import { FilterState, Subscription } from '../types';
import { MODEL_CONFIGS } from '../constants/models';

interface AccountFilterBarProps {
  filters: FilterState;
  onFilterChange: (f: FilterState) => void;
  subscriptions: Subscription[];
}

const chip = (selected: boolean): React.CSSProperties => ({
  padding: '7px 12px',
  color: selected ? '#f4eaff' : '#b9c3e3',
  border: selected ? '1px solid rgba(161,91,255,.42)' : '1px solid transparent',
  borderRadius: 9,
  background: selected ? 'rgba(131,61,255,.22)' : 'transparent',
  fontSize: 12,
  cursor: 'pointer',
  font: 'inherit',
  transition: 'all .2s',
});

const dot = (color: string): React.CSSProperties => ({
  display: 'inline-block', width: 8, height: 8,
  marginRight: 7, borderRadius: '50%',
  background: color, boxShadow: `0 0 8px ${color}`,
});

export const AccountFilterBar: React.FC<AccountFilterBarProps> = ({
  filters, onFilterChange, subscriptions,
}) => {
  const accounts = Array.from(new Set(subscriptions.map(s => s.account))).sort();
  const models   = Array.from(new Set(subscriptions.map(s => s.model)));

  const toolbarBox: React.CSSProperties = {
    padding: 18,
    border: '1px solid var(--line)',
    borderRadius: 'var(--radius)',
    background: 'rgba(14,20,43,.76)',
    boxShadow: 'var(--shadow)',
    marginBottom: 25,
  };

  return (
    <div style={toolbarBox}>
      {/* Search + sort row */}
      <div style={{ display: 'flex', gap: 12 }}>
        <label style={{
          display: 'flex', alignItems: 'center', gap: 10, flex: 1,
          padding: '0 15px', height: 38,
          border: '1px solid rgba(141,157,238,.2)',
          borderRadius: 12,
          background: 'rgba(5,9,26,.66)',
          color: 'var(--muted)',
        }}>
          ⌕
          <input
            value={filters.search}
            onChange={e => onFilterChange({ ...filters, search: e.target.value })}
            placeholder="Search by Gmail account, plan, notes, or model..."
            style={{
              width: '100%', border: 0, outline: 0,
              background: 'transparent', color: 'var(--text)',
              font: 'inherit', fontSize: 13,
            }}
          />
        </label>
        <select
          value={filters.sortBy}
          onChange={e => onFilterChange({ ...filters, sortBy: e.target.value as any })}
          style={{
            height: 38, padding: '0 13px', color: '#ffd75e',
            border: '1px solid rgba(255,185,61,.35)', borderRadius: 12,
            background: '#0b112a', font: 'inherit', fontSize: 13,
            cursor: 'pointer', fontWeight: 600,
          }}
        >
          <option value="limit_reset">⚡ Sort: Limit Remaining &amp; Reset Time</option>
          <option value="renewal">⇅  Sort: Renewal Date</option>
          <option value="account">Sort: Account</option>
          <option value="model">Sort: Model</option>
          <option value="cost">Sort: Cost</option>
        </select>
      </div>

      {/* Filter row */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap',
        marginTop: 16, paddingTop: 14,
        borderTop: '1px solid rgba(141,157,238,.1)',
        color: 'var(--muted)', fontSize: 12,
      }}>
        <span style={{ marginRight: 2 }}>✉ Accounts:</span>

        <button style={chip(!filters.account)} onClick={() => onFilterChange({ ...filters, account: '' })}>
          All ({subscriptions.length})
        </button>
        {accounts.map(acc => {
          const tag = subscriptions.find(s => s.account === acc)?.accountTag;
          const count = subscriptions.filter(s => s.account === acc).length;
          return (
            <button
              key={acc}
              style={chip(filters.account === acc)}
              onClick={() => onFilterChange({ ...filters, account: filters.account === acc ? '' : acc })}
            >
              {acc}{tag ? ` (${tag})` : ''} &nbsp;{count}
            </button>
          );
        })}

        <span style={{ marginLeft: 4, marginRight: 2 }}>⌁ Status:</span>
        <button style={chip(filters.status === 'all')} onClick={() => onFilterChange({ ...filters, status: 'all' })}>All</button>
        <button style={chip(filters.status === 'active')} onClick={() => onFilterChange({ ...filters, status: 'active' })}>
          <i style={dot('var(--green)')} />Active
        </button>
        <button style={chip(filters.status === 'expiring')} onClick={() => onFilterChange({ ...filters, status: 'expiring' })}>
          <i style={dot('var(--yellow)')} />Expiring (&lt;5d)
        </button>
        <button style={chip(filters.status === 'expired')} onClick={() => onFilterChange({ ...filters, status: 'expired' })}>
          <i style={dot('var(--red)')} />Expired
        </button>
        <button style={chip(filters.status === 'session_locked')} onClick={() => onFilterChange({ ...filters, status: 'session_locked' })}>
          🔥 Rate Locked
        </button>

        {/* Model filter */}
        <div style={{ display: 'flex', gap: 15, marginLeft: 'auto', flexWrap: 'wrap' }}>
          <button style={{ cursor: 'pointer', background: 'none', border: 0, font: 'inherit', color: !filters.model ? '#e6d7ff' : 'var(--muted)', textDecoration: !filters.model ? 'underline' : 'none', fontSize: 12 }}
            onClick={() => onFilterChange({ ...filters, model: '' })}>All Models</button>
          {models.map(m => {
            const cfg = MODEL_CONFIGS[m as keyof typeof MODEL_CONFIGS] || MODEL_CONFIGS.custom;
            return (
              <button
                key={m}
                style={{ cursor: 'pointer', background: 'none', border: 0, font: 'inherit', color: filters.model === m ? '#e6d7ff' : 'var(--muted)', fontSize: 12 }}
                onClick={() => onFilterChange({ ...filters, model: filters.model === m ? '' : m })}
              >
                {cfg.icon} {cfg.name}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
