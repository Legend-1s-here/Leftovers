import React, { useRef } from 'react';
import { ViewMode } from '../types';
import { User } from '@supabase/supabase-js';

interface HeaderProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  onOpenAddModal: () => void;
  onOpenQuickResetModal: () => void;
  onExportJSON: () => void;
  onExportCSV: () => void;
  onImportJSON: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onResetData: () => void;
  activeCount: number;
  totalCount: number;
  user: User | null;
  onSignOut: () => void;
  onOpenAuth: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  viewMode,
  onViewModeChange,
  onOpenAddModal,
  onOpenQuickResetModal,
  onExportJSON,
  onExportCSV,
  onImportJSON,
  onResetData,
  activeCount,
  totalCount,
  user,
  onSignOut,
  onOpenAuth,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const tabs: { key: ViewMode; icon: string; label: string }[] = [
    { key: 'cards',     icon: '▦', label: 'Subscription Cards' },
    { key: 'accounts',  icon: '♧', label: 'Grouped by Gmail'  },
    { key: 'calendar',  icon: '▣', label: '30-Day Timeline'   },
    { key: 'analytics', icon: '◴', label: 'Spend & Analytics' },
  ];

  return (
    <header style={{ borderBottom: '1px solid rgba(144,153,220,.12)', background: 'rgba(7,9,24,.82)', backdropFilter: 'blur(14px)', position: 'sticky', top: 0, zIndex: 40 }}>
      <div style={{ width: 'min(1480px, calc(100% - 42px))', margin: '0 auto', padding: '20px 0 0' }}>

        {/* Top bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 24, paddingBottom: 18, borderBottom: '1px solid rgba(144,153,220,.08)' }}>

          {/* Brand */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 15 }}>
            <div className="brand-orb" style={{
              width: 49, height: 49,
              display: 'grid', placeItems: 'center',
              border: '1px solid #a950ff',
              borderRadius: 17,
              fontSize: 25,
              background: 'linear-gradient(145deg, rgba(144,67,255,.3), rgba(25,210,231,.08))',
              boxShadow: '0 0 28px rgba(155,74,255,.38), inset 0 0 16px rgba(169,86,255,.16)',
              animation: 'float 4s ease-in-out infinite',
              position: 'relative',
            }}>
              ✧
            </div>
            <div>
              <h1 style={{ font: '700 21px Space Grotesk', letterSpacing: '-.6px', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                AI Quota &amp; Subscriptions
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: 7,
                  padding: '5px 9px', marginLeft: 4,
                  color: '#d9caff',
                  background: 'rgba(130,69,255,.2)',
                  border: '1px solid rgba(159,100,255,.38)',
                  borderRadius: 9, fontSize: 11,
                }}>
                  {activeCount} Active / {totalCount} Total
                </span>
              </h1>
              <p style={{ marginTop: 3, color: 'var(--muted)', fontSize: 13 }}>
                Track quotas &amp; expiry across Antigravity, Claude, Codex, Gemini &amp; custom accounts
              </p>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 6, color: '#ffd76d', font: '10px Space Grotesk', letterSpacing: '1.3px', textTransform: 'uppercase' }}>
                <i style={{ width: 5, height: 5, borderRadius: '50%', background: '#ff557e', boxShadow: '0 0 10px #ff557e', display: 'inline-block', animation: 'starBlink 1.2s infinite' }} />
                Power up your AI arsenal
              </span>
            </div>
          </div>

          {/* Actions & User Profile */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 11, flexWrap: 'wrap' }}>
            {user ? (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '7px 12px',
                  borderRadius: 12,
                  background: 'rgba(154,77,255,.14)',
                  border: '1px solid rgba(154,77,255,.32)',
                  fontSize: 12,
                }}
              >
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#4cdbac', boxShadow: '0 0 8px #4cdbac' }} />
                <span style={{ color: '#d9caff', fontWeight: 600 }}>{user.email}</span>
                <button
                  onClick={onSignOut}
                  title="Sign out of QuotaVerse"
                  style={{
                    marginLeft: 6,
                    padding: '3px 8px',
                    borderRadius: 6,
                    background: 'rgba(255,93,120,.15)',
                    border: '1px solid rgba(255,93,120,.3)',
                    color: '#ff8ba1',
                    fontSize: 10,
                    cursor: 'pointer',
                    fontWeight: 700,
                  }}
                >
                  Log Out
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 7,
                  padding: '9px 15px',
                  borderRadius: 12,
                  background: 'rgba(154,77,255,.18)',
                  border: '1px solid rgba(154,77,255,.4)',
                  color: '#e6d7ff',
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  transition: 'all .2s',
                }}
              >
                <span>👤</span>
                <span>Sign In / Cloud Sync</span>
              </button>
            )}

            <button
              onClick={onOpenQuickResetModal}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 9,
                padding: '11px 17px', borderRadius: 13,
                fontWeight: 700, fontSize: 13, cursor: 'pointer',
                background: 'rgba(88,64,28,.3)',
                border: '1px solid rgba(202,146,54,.5)',
                color: '#ffd657',
                font: 'inherit',
              }}
            >
              ◷ &nbsp;Hit Limit? Start Cooldown
            </button>

            <button
              onClick={onOpenAddModal}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 9,
                padding: '11px 17px', borderRadius: 13,
                fontWeight: 700, fontSize: 13, cursor: 'pointer',
                background: 'linear-gradient(135deg, #993dff, #6328dc)',
                boxShadow: '0 10px 26px rgba(111,41,228,.33)',
                border: 0,
                color: '#fff',
                font: 'inherit',
                position: 'relative', overflow: 'hidden',
              }}
            >
              ＋ &nbsp;Add Subscription
            </button>

            <div style={{ display: 'flex', gap: 3, padding: 6, border: '1px solid var(--line)', background: 'rgba(20,28,57,.72)', borderRadius: 13 }}>
              {[
                { icon: '⇩', title: 'Export JSON', fn: onExportJSON },
                { icon: '▤',  title: 'Export CSV',  fn: onExportCSV  },
                { icon: '⇧', title: 'Import JSON', fn: () => fileInputRef.current?.click() },
                { icon: '↻', title: 'Reset data',  fn: onResetData   },
              ].map(({ icon, title, fn }) => (
                <button
                  key={title}
                  onClick={fn}
                  title={title}
                  style={{
                    width: 32, height: 30, color: '#abb5da',
                    background: 'transparent', borderRadius: 9,
                    fontSize: 16, cursor: 'pointer',
                    border: 0, font: 'inherit',
                    transition: 'color .2s, background .2s',
                  }}
                  onMouseEnter={e => { (e.target as HTMLButtonElement).style.color = 'white'; (e.target as HTMLButtonElement).style.background = 'rgba(141,102,255,.16)'; }}
                  onMouseLeave={e => { (e.target as HTMLButtonElement).style.color = '#abb5da'; (e.target as HTMLButtonElement).style.background = 'transparent'; }}
                >
                  {icon}
                </button>
              ))}
              <input type="file" ref={fileInputRef} onChange={onImportJSON} accept=".json" style={{ display: 'none' }} />
            </div>
          </div>
        </div>

        {/* Tab navigation */}
        <nav style={{ display: 'flex', gap: 8, padding: '14px 0 0' }}>
          {tabs.map(({ key, icon, label }) => (
            <button
              key={key}
              onClick={() => onViewModeChange(key)}
              style={{
                padding: '9px 15px',
                borderRadius: 10,
                background: viewMode === key ? 'rgba(140,70,255,.18)' : 'transparent',
                color: viewMode === key ? '#e6d7ff' : 'var(--muted)',
                fontSize: 13,
                border: viewMode === key ? '1px solid rgba(155,83,255,.42)' : '1px solid transparent',
                boxShadow: viewMode === key ? 'inset 0 0 16px rgba(127,65,255,.13)' : 'none',
                cursor: 'pointer',
                font: 'inherit',
                transition: 'all .2s',
              }}
            >
              {icon} &nbsp; {label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
};
