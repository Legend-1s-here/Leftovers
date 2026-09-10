import React, { useState, useEffect } from 'react';
import { BackupSnapshot, snapshotService } from '../services/snapshotService';
import { Subscription } from '../types';
import { MODEL_CONFIGS } from '../constants/models';

interface SnapshotsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentSubscriptions: Subscription[];
  onRestore: (subs: Subscription[], snapshot: BackupSnapshot) => void;
  onToast: (msg: string) => void;
}

export const SnapshotsModal: React.FC<SnapshotsModalProps> = ({
  isOpen,
  onClose,
  currentSubscriptions,
  onRestore,
  onToast,
}) => {
  const [snapshots, setSnapshots] = useState<BackupSnapshot[]>([]);

  useEffect(() => {
    if (isOpen) {
      setSnapshots(snapshotService.getSnapshots());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCreateManual = async () => {
    const snap = await snapshotService.createSnapshot(
      currentSubscriptions,
      'Manual backup snapshot'
    );
    setSnapshots(snapshotService.getSnapshots());
    onToast(`📸 Snapshot created (${snap.itemCount} subscriptions)`);
  };

  const handleRestoreClick = (snap: BackupSnapshot) => {
    if (
      confirm(
        `Restore snapshot from ${new Date(snap.createdAt).toLocaleString()} (${snap.itemCount} subscriptions)? Current items will be replaced.`
      )
    ) {
      onRestore(snap.subscriptions, snap);
      onToast(`↺ Restored snapshot with ${snap.itemCount} subscriptions!`);
      onClose();
    }
  };

  const handleDeleteSnap = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = snapshotService.deleteSnapshot(id);
    setSnapshots(updated);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 90,
        display: 'grid',
        placeItems: 'center',
        background: 'rgba(4,5,18,.82)',
        backdropFilter: 'blur(12px)',
        padding: 16,
      }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        style={{
          width: 'min(560px, calc(100% - 24px))',
          maxHeight: '85vh',
          overflowY: 'auto',
          padding: '28px 26px',
          borderRadius: 24,
          border: '1px solid rgba(76, 219, 172, 0.4)',
          background: 'linear-gradient(145deg, #0e1a24, #081017)',
          boxShadow: '0 25px 90px rgba(10, 35, 30, 0.7)',
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

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: 44, height: 44, borderRadius: 14,
                background: 'rgba(76, 219, 172, 0.18)',
                border: '1px solid rgba(76, 219, 172, 0.4)',
                display: 'grid', placeItems: 'center',
                fontSize: 22, color: '#4cdbac',
              }}
            >
              ☁
            </div>
            <div>
              <h2 style={{ font: "700 18px 'Space Grotesk'", color: '#fff', margin: 0 }}>
                Cloud Backup Snapshots
              </h2>
              <p style={{ color: '#88d8be', fontSize: 12, marginTop: 2 }}>
                Auto-saved history of your configurations
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleCreateManual}
            style={{
              padding: '7px 13px',
              borderRadius: 10,
              background: 'rgba(76, 219, 172, 0.2)',
              border: '1px solid rgba(76, 219, 172, 0.4)',
              color: '#4cdbac',
              fontSize: 12,
              fontWeight: 700,
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            📸 Snapshot Now
          </button>
        </div>

        {snapshots.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--muted)', fontSize: 13 }}>
            <div>✧</div>
            <p style={{ marginTop: 8 }}>No backup snapshots saved yet.</p>
            <p style={{ fontSize: 11, color: 'var(--muted)', marginTop: 4 }}>
              Snapshots are automatically created whenever you add, edit, or delete subscriptions.
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {snapshots.map(snap => {
              const date = new Date(snap.createdAt);
              return (
                <div
                  key={snap.id}
                  style={{
                    padding: '14px 16px',
                    borderRadius: 14,
                    border: '1px solid rgba(76, 219, 172, 0.2)',
                    background: 'rgba(5, 15, 20, 0.65)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 12,
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <strong style={{ color: '#e6fff7', fontSize: 13 }}>
                        {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} at {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </strong>
                      <span
                        style={{
                          fontSize: 10,
                          fontWeight: 700,
                          padding: '2px 7px',
                          borderRadius: 6,
                          background: 'rgba(76, 219, 172, 0.18)',
                          color: '#4cdbac',
                        }}
                      >
                        {snap.itemCount} Subscriptions
                      </span>
                    </div>

                    <div style={{ color: '#8faea6', fontSize: 11, marginTop: 4 }}>
                      {snap.reason} • Est. Spend: ${snap.totalMonthlySpend}/mo
                    </div>

                    {/* Model Icons list preview */}
                    <div style={{ display: 'flex', gap: 5, marginTop: 8 }}>
                      {Array.from(new Set(snap.subscriptions.map(s => s.model))).map(m => {
                        const meta = MODEL_CONFIGS[m] || MODEL_CONFIGS.custom;
                        return (
                          <span
                            key={m}
                            title={meta.name}
                            style={{
                              fontSize: 14,
                              width: 24,
                              height: 24,
                              borderRadius: 6,
                              background: 'rgba(255,255,255,.05)',
                              display: 'inline-grid',
                              placeItems: 'center',
                            }}
                          >
                            {meta.icon}
                          </span>
                        );
                      })}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <button
                      type="button"
                      onClick={() => handleRestoreClick(snap)}
                      style={{
                        padding: '7px 14px',
                        borderRadius: 10,
                        background: 'linear-gradient(135deg, #4cdbac, #10b981)',
                        color: '#04100c',
                        fontWeight: 700,
                        fontSize: 12,
                        border: 0,
                        cursor: 'pointer',
                      }}
                    >
                      ↺ Restore
                    </button>
                    <button
                      type="button"
                      onClick={e => handleDeleteSnap(snap.id, e)}
                      title="Delete snapshot"
                      style={{
                        padding: '6px 10px',
                        borderRadius: 8,
                        background: 'rgba(255,93,120,.12)',
                        border: '1px solid rgba(255,93,120,.25)',
                        color: '#ff8ba1',
                        fontSize: 12,
                        cursor: 'pointer',
                      }}
                    >
                      🗑
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
