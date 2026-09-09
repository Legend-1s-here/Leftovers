import React, { useState } from 'react';
import { supabase } from '../lib/supabase';

interface AuthViewProps {
  onSuccess?: () => void;
}

export const AuthView: React.FC<AuthViewProps> = ({ onSuccess }) => {
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setInfoMessage(null);
    setLoading(true);

    try {
      if (mode === 'signup') {
        if (password !== confirmPassword) {
          setErrorMessage('Passwords do not match');
          setLoading(false);
          return;
        }
        if (password.length < 6) {
          setErrorMessage('Password must be at least 6 characters');
          setLoading(false);
          return;
        }

        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });

        if (error) throw error;

        if (data.session) {
          setInfoMessage('Account created successfully!');
          if (onSuccess) onSuccess();
        } else {
          setInfoMessage('Confirmation email sent! Please check your inbox (or log in directly if confirmation is disabled).');
        }
      } else if (mode === 'login') {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;
        if (onSuccess) onSuccess();
      } else if (mode === 'forgot') {
        const { error } = await supabase.auth.resetPasswordForEmail(email);
        if (error) throw error;
        setInfoMessage('Password reset link sent to your email.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Authentication error occurred');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '12px 16px',
    borderRadius: 12,
    border: '1px solid var(--line)',
    background: '#080d23',
    color: '#fff',
    font: 'inherit',
    fontSize: 13,
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color .2s',
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
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px 16px',
        position: 'relative',
        zIndex: 10,
      }}
    >
      <div
        style={{
          width: 'min(460px, 100%)',
          padding: '36px 32px',
          borderRadius: 24,
          border: '1px solid rgba(167,98,255,.45)',
          background: 'linear-gradient(145deg, rgba(17,23,53,.92), rgba(10,14,34,.95))',
          boxShadow: '0 25px 100px rgba(40,14,97,.75)',
          backdropFilter: 'blur(16px)',
          position: 'relative',
        }}
      >
        {/* Brand Orb */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: 28 }}>
          <div
            className="brand-orb"
            style={{
              width: 56,
              height: 56,
              display: 'grid',
              placeItems: 'center',
              border: '1px solid #a950ff',
              borderRadius: 20,
              fontSize: 28,
              background: 'linear-gradient(145deg, rgba(144,67,255,.35), rgba(25,210,231,.12))',
              boxShadow: '0 0 32px rgba(155,74,255,.45)',
              marginBottom: 16,
              position: 'relative',
            }}
          >
            ✧
          </div>
          <h1 style={{ font: "700 24px 'Space Grotesk'", color: '#fff', margin: 0, letterSpacing: '-.5px' }}>
            {mode === 'login' ? 'Welcome to QuotaVerse' : mode === 'signup' ? 'Create Your QuotaVerse Account' : 'Reset Password'}
          </h1>
          <p style={{ marginTop: 6, color: 'var(--muted)', fontSize: 13 }}>
            {mode === 'login'
              ? 'Log in to sync your AI model limits and subscriptions'
              : mode === 'signup'
              ? 'Join QuotaVerse for private cloud-synced quota tracking'
              : 'Enter your email to receive a password reset link'}
          </p>
        </div>

        {/* Error / Info Alerts */}
        {errorMessage && (
          <div
            style={{
              padding: '10px 14px',
              borderRadius: 12,
              background: 'rgba(255,93,120,.15)',
              border: '1px solid rgba(255,93,120,.35)',
              color: '#ff8ba1',
              fontSize: 12,
              marginBottom: 18,
            }}
          >
            ⚠️ {errorMessage}
          </div>
        )}

        {infoMessage && (
          <div
            style={{
              padding: '10px 14px',
              borderRadius: 12,
              background: 'rgba(76,219,172,.15)',
              border: '1px solid rgba(76,219,172,.35)',
              color: '#4cdbac',
              fontSize: 12,
              marginBottom: 18,
            }}
          >
            ✓ {infoMessage}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 16 }}>
          <div>
            <label style={labelStyle}>Email Address</label>
            <input
              type="email"
              required
              placeholder="you@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              style={inputStyle}
            />
          </div>

          {mode !== 'forgot' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label style={labelStyle}>Password</label>
                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={() => { setMode('forgot'); setErrorMessage(null); setInfoMessage(null); }}
                    style={{ background: 'none', border: 0, color: '#c79aff', fontSize: 11, cursor: 'pointer', padding: 0 }}
                  >
                    Forgot?
                  </button>
                )}
              </div>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                style={inputStyle}
              />
            </div>
          )}

          {mode === 'signup' && (
            <div>
              <label style={labelStyle}>Confirm Password</label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                style={inputStyle}
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: 6,
              padding: '12px',
              borderRadius: 14,
              background: 'linear-gradient(135deg, #993dff, #6328dc)',
              boxShadow: '0 10px 28px rgba(111,41,228,.4)',
              color: '#fff',
              fontSize: 14,
              fontWeight: 700,
              border: 0,
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              fontFamily: 'inherit',
              transition: 'all .2s',
            }}
          >
            {loading ? 'Processing...' : mode === 'login' ? 'Sign In ✦' : mode === 'signup' ? 'Create Account ✧' : 'Send Reset Link'}
          </button>
        </form>

        {/* Mode Switcher Footer */}
        <div style={{ marginTop: 24, paddingTop: 18, borderTop: '1px solid var(--line)', textAlign: 'center', fontSize: 12, color: 'var(--muted)' }}>
          {mode === 'login' ? (
            <span>
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => { setMode('signup'); setErrorMessage(null); setInfoMessage(null); }}
                style={{ background: 'none', border: 0, color: '#d9caff', fontWeight: 700, cursor: 'pointer', textDecoration: 'underline' }}
              >
                Sign Up
              </button>
            </span>
          ) : (
            <span>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => { setMode('login'); setErrorMessage(null); setInfoMessage(null); }}
                style={{ background: 'none', border: 0, color: '#d9caff', fontWeight: 700, cursor: 'pointer', textDecoration: 'underline' }}
              >
                Sign In
              </button>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
