import React, { useState, useEffect } from 'react';
import { pinService } from '../services/pinService';

interface PinLockModalProps {
  isOpen: boolean;
  onUnlock: () => void;
  onOpenAuth: () => void;
}

export const PinLockModal: React.FC<PinLockModalProps> = ({
  isOpen,
  onUnlock,
  onOpenAuth,
}) => {
  const [pin, setPin] = useState('');
  const [errorShake, setErrorShake] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (!isOpen) {
      setPin('');
      setErrorMessage('');
      setErrorShake(false);
    }
  }, [isOpen]);

  // Keyboard handler for number keys and backspace
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (/^[0-9]$/.test(e.key)) {
        e.preventDefault();
        handleDigit(e.key);
      } else if (e.key === 'Backspace') {
        e.preventDefault();
        handleBackspace();
      } else if (e.key === 'Escape') {
        setPin('');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, pin]);

  if (!isOpen) return null;

  const handleDigit = (digit: string) => {
    if (pin.length >= 4) return;
    const next = pin + digit;
    setPin(next);

    if (next.length === 4) {
      // Auto verify on 4th digit
      setTimeout(() => {
        if (pinService.verifyPin(next)) {
          onUnlock();
        } else {
          setErrorShake(true);
          setErrorMessage('Incorrect PIN. Try again.');
          setTimeout(() => {
            setPin('');
            setErrorShake(false);
          }, 600);
        }
      }, 150);
    }
  };

  const handleBackspace = () => {
    setPin(prev => prev.slice(0, -1));
    setErrorMessage('');
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        display: 'grid',
        placeItems: 'center',
        background: 'rgba(3, 4, 15, 0.88)',
        backdropFilter: 'blur(20px)',
        padding: 16,
      }}
    >
      <div
        style={{
          width: 'min(380px, calc(100% - 24px))',
          padding: '34px 28px',
          borderRadius: 26,
          border: '1px solid rgba(154, 77, 255, 0.45)',
          background: 'linear-gradient(145deg, #121535, #0a0c20)',
          boxShadow: '0 30px 90px rgba(10, 5, 30, 0.85)',
          textAlign: 'center',
          animation: errorShake ? 'shake .4s ease' : 'rise .3s ease',
        }}
      >
        <div
          style={{
            width: 56,
            height: 56,
            margin: '0 auto 16px',
            borderRadius: 18,
            background: 'rgba(154, 77, 255, 0.18)',
            border: '1px solid rgba(154, 77, 255, 0.4)',
            display: 'grid',
            placeItems: 'center',
            fontSize: 26,
            color: '#d9caff',
          }}
        >
          🔒
        </div>

        <h2 style={{ font: "700 20px 'Space Grotesk'", color: '#fff', margin: 0 }}>
          Fast PIN Unlock
        </h2>
        <p style={{ color: 'var(--muted)', fontSize: 12, marginTop: 4 }}>
          Enter your 4-digit PIN to access QuotaVerse
        </p>

        {/* PIN Indicator Dots */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 14, margin: '24px 0' }}>
          {[0, 1, 2, 3].map(i => {
            const isFilled = i < pin.length;
            return (
              <div
                key={i}
                style={{
                  width: 16,
                  height: 16,
                  borderRadius: '50%',
                  border: isFilled
                    ? '2px solid var(--purple)'
                    : '2px solid rgba(144, 153, 220, 0.25)',
                  background: isFilled ? 'var(--purple)' : 'transparent',
                  boxShadow: isFilled ? '0 0 12px var(--purple)' : 'none',
                  transition: 'all .2s',
                }}
              />
            );
          })}
        </div>

        {errorMessage && (
          <div style={{ color: '#ff5d78', fontSize: 12, marginBottom: 12, fontWeight: 600 }}>
            {errorMessage}
          </div>
        )}

        {/* Numpad */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, maxWidth: 280, margin: '0 auto' }}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => (
            <button
              type="button"
              key={n}
              onClick={() => handleDigit(n.toString())}
              style={{
                height: 52,
                borderRadius: 14,
                border: '1px solid rgba(144, 153, 220, 0.18)',
                background: 'rgba(20, 25, 55, 0.65)',
                color: '#fff',
                font: "700 18px 'Space Grotesk'",
                cursor: 'pointer',
                transition: 'all .15s',
              }}
              onMouseDown={e => e.currentTarget.style.transform = 'scale(0.95)'}
              onMouseUp={e => e.currentTarget.style.transform = 'none'}
            >
              {n}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setPin('')}
            style={{
              height: 52,
              borderRadius: 14,
              border: '1px solid rgba(144, 153, 220, 0.15)',
              background: 'rgba(20, 25, 55, 0.3)',
              color: 'var(--muted)',
              fontSize: 12,
              cursor: 'pointer',
            }}
          >
            Clear
          </button>
          <button
            type="button"
            onClick={() => handleDigit('0')}
            style={{
              height: 52,
              borderRadius: 14,
              border: '1px solid rgba(144, 153, 220, 0.18)',
              background: 'rgba(20, 25, 55, 0.65)',
              color: '#fff',
              font: "700 18px 'Space Grotesk'",
              cursor: 'pointer',
            }}
            onMouseDown={e => e.currentTarget.style.transform = 'scale(0.95)'}
            onMouseUp={e => e.currentTarget.style.transform = 'none'}
          >
            0
          </button>
          <button
            type="button"
            onClick={handleBackspace}
            style={{
              height: 52,
              borderRadius: 14,
              border: '1px solid rgba(144, 153, 220, 0.15)',
              background: 'rgba(20, 25, 55, 0.3)',
              color: 'var(--muted)',
              fontSize: 16,
              cursor: 'pointer',
            }}
          >
            ⌫
          </button>
        </div>

        {/* Forgot PIN / Sign in option */}
        <div style={{ marginTop: 22 }}>
          <button
            type="button"
            onClick={() => {
              pinService.unlock();
              onOpenAuth();
            }}
            style={{
              background: 'none',
              border: 0,
              color: '#a78bfa',
              fontSize: 12,
              cursor: 'pointer',
              textDecoration: 'underline',
              fontFamily: 'inherit',
            }}
          >
            Forgot PIN? Sign in with Email / Password
          </button>
        </div>
      </div>
    </div>
  );
};
