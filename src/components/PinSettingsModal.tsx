import React, { useState, useEffect } from 'react';
import { pinService } from '../services/pinService';

interface PinSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onToast: (msg: string) => void;
}

export const PinSettingsModal: React.FC<PinSettingsModalProps> = ({
  isOpen,
  onClose,
  onToast,
}) => {
  const [isPinConfigured, setIsPinConfigured] = useState(false);
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setIsPinConfigured(pinService.isPinSet());
      setNewPin('');
      setConfirmPin('');
      setError('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSavePin = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPin.length !== 4) {
      setError('PIN must be exactly 4 digits');
      return;
    }
    if (newPin !== confirmPin) {
      setError('PINs do not match');
      return;
    }

    const success = pinService.setPin(newPin);
    if (success) {
      onToast('🔐 4-Digit PIN enabled for 1-click device unlock!');
      onClose();
    } else {
      setError('Failed to save PIN');
    }
  };

  const handleRemovePin = () => {
    if (confirm('Disable 4-digit PIN lock on this device?')) {
      pinService.removePin();
      onToast('PIN lock disabled on this device');
      onClose();
    }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '12px 16px',
    borderRadius: 12,
    border: '1px solid var(--line)',
    background: '#080d23',
    color: '#fff',
    fontSize: 16,
    letterSpacing: '6px',
    textAlign: 'center',
    outline: 'none',
    boxSizing: 'border-box',
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
          width: 'min(440px, calc(100% - 24px))',
          padding: '28px 26px',
          borderRadius: 22,
          border: '1px solid rgba(154, 77, 255, 0.45)',
          background: 'linear-gradient(145deg, #131938, #0b0f24)',
          boxShadow: '0 25px 90px rgba(40, 14, 97, 0.65)',
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
              background: 'rgba(154, 77, 255, 0.18)',
              border: '1px solid rgba(154, 77, 255, 0.4)',
              display: 'grid', placeItems: 'center',
              fontSize: 22, color: '#d9caff',
            }}
          >
            🔐
          </div>
          <div>
            <h2 style={{ font: "700 18px 'Space Grotesk'", color: '#fff', margin: 0 }}>
              Device PIN Lock
            </h2>
            <p style={{ color: 'var(--muted)', fontSize: 12, marginTop: 2 }}>
              Quick 1-click unlock on your trusted computer
            </p>
          </div>
        </div>

        <form onSubmit={handleSavePin} style={{ display: 'grid', gap: 14 }}>
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#aeb8d8', marginBottom: 6 }}>
              {isPinConfigured ? 'Enter New 4-Digit PIN' : 'Create 4-Digit PIN'}
            </label>
            <input
              type="password"
              inputMode="numeric"
              maxLength={4}
              placeholder="••••"
              value={newPin}
              onChange={e => {
                const val = e.target.value.replace(/\D/g, '').slice(0, 4);
                setNewPin(val);
                setError('');
              }}
              style={inputStyle}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#aeb8d8', marginBottom: 6 }}>
              Confirm 4-Digit PIN
            </label>
            <input
              type="password"
              inputMode="numeric"
              maxLength={4}
              placeholder="••••"
              value={confirmPin}
              onChange={e => {
                const val = e.target.value.replace(/\D/g, '').slice(0, 4);
                setConfirmPin(val);
                setError('');
              }}
              style={inputStyle}
            />
          </div>

          {error && (
            <div style={{ color: '#ff5d78', fontSize: 12, fontWeight: 600 }}>
              ⚠️ {error}
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
            {isPinConfigured ? (
              <button
                type="button"
                onClick={handleRemovePin}
                style={{
                  padding: '9px 14px',
                  borderRadius: 10,
                  background: 'rgba(255, 93, 120, 0.15)',
                  border: '1px solid rgba(255, 93, 120, 0.3)',
                  color: '#ff8ba1',
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Disable PIN
              </button>
            ) : <div />}

            <div style={{ display: 'flex', gap: 8 }}>
              <button
                type="button"
                onClick={onClose}
                style={{
                  padding: '9px 16px',
                  borderRadius: 12,
                  background: 'rgba(141,158,225,.12)',
                  color: 'var(--muted)',
                  fontSize: 13,
                  border: 0,
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                style={{
                  padding: '9px 20px',
                  borderRadius: 12,
                  background: 'linear-gradient(135deg, #993dff, #6328dc)',
                  boxShadow: '0 8px 24px rgba(111,41,228,.35)',
                  color: '#fff',
                  fontWeight: 700,
                  fontSize: 13,
                  border: 0,
                  cursor: 'pointer',
                }}
              >
                Save PIN
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
