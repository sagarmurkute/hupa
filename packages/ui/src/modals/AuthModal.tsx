import React, { useState } from 'react';
import { useAuthStore } from '@hupa/state';
import { authClient } from '@hupa/auth';
import {
  X,
  Lock,
  Mail,
  User,
  ShieldCheck,
  LogOut,
  AlertCircle,
  Database,
  CheckCircle2,
} from 'lucide-react';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    setAuthModalOpen,
    authModalTab,
    setAuthModalTab,
    user,
    checkSession,
    signOutUser,
  } = useAuthStore();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isAuthModalOpen) return null;

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Please enter both email and password.');
      return;
    }

    try {
      setLoading(true);
      setErrorMsg(null);
      const res = await authClient.signIn.email({
        email,
        password,
      });

      if (res.error) {
        setErrorMsg(res.error.message || 'Invalid email or password.');
      } else {
        await checkSession();
        setSuccessMsg('Successfully signed in!');
        setTimeout(() => {
          setSuccessMsg(null);
          setAuthModalOpen(false);
        }, 800);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setErrorMsg('Please fill in all required fields.');
      return;
    }
    if (password.length < 8) {
      setErrorMsg('Password must be at least 8 characters long.');
      return;
    }

    try {
      setLoading(true);
      setErrorMsg(null);
      const res = await authClient.signUp.email({
        name,
        email,
        password,
      });

      if (res.error) {
        setErrorMsg(res.error.message || 'Failed to create account.');
      } else {
        await checkSession();
        setSuccessMsg('Account created successfully!');
        setTimeout(() => {
          setSuccessMsg(null);
          setAuthModalOpen(false);
        }, 800);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to register.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={() => setAuthModalOpen(false)}>
      <div
        className="modal-dialog"
        style={{ width: '420px', padding: '0', overflow: 'hidden' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: '14px 16px',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: 'var(--surface-subtle)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldCheck size={16} color="var(--accent-indigo)" />
            <span style={{ fontSize: '12.5px', fontWeight: 600 }}>
              {user ? 'Developer Account' : authModalTab === 'signup' ? 'Create HUPA Account' : 'Sign In to HUPA'}
            </span>
          </div>
          <button
            onClick={() => setAuthModalOpen(false)}
            className="hupa-btn ghost icon-only"
            style={{ width: '22px', height: '22px' }}
          >
            <X size={14} />
          </button>
        </div>

        {/* Tab switcher if not logged in */}
        {!user && (
          <div
            style={{
              display: 'flex',
              borderBottom: '1px solid var(--border-subtle)',
              backgroundColor: '#ffffff',
              padding: '0 16px',
            }}
          >
            <button
              onClick={() => {
                setAuthModalTab('signin');
                setErrorMsg(null);
              }}
              style={{
                flex: 1,
                padding: '8px 0',
                border: 'none',
                background: 'none',
                fontSize: '11.5px',
                fontWeight: authModalTab === 'signin' ? 600 : 500,
                color: authModalTab === 'signin' ? 'var(--text-primary)' : 'var(--text-secondary)',
                borderBottom: `2px solid ${authModalTab === 'signin' ? '#0f172a' : 'transparent'}`,
                cursor: 'pointer',
              }}
            >
              Sign In
            </button>
            <button
              onClick={() => {
                setAuthModalTab('signup');
                setErrorMsg(null);
              }}
              style={{
                flex: 1,
                padding: '8px 0',
                border: 'none',
                background: 'none',
                fontSize: '11.5px',
                fontWeight: authModalTab === 'signup' ? 600 : 500,
                color: authModalTab === 'signup' ? 'var(--text-primary)' : 'var(--text-secondary)',
                borderBottom: `2px solid ${authModalTab === 'signup' ? '#0f172a' : 'transparent'}`,
                cursor: 'pointer',
              }}
            >
              Create Account
            </button>
          </div>
        )}

        {/* Body Content */}
        <div style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* LOGGED IN ACCOUNT VIEW */}
          {user ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px',
                  backgroundColor: 'var(--surface-subtle)',
                  borderRadius: '8px',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--accent-indigo)',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: '14px',
                  }}
                >
                  {user.name ? user.name[0].toUpperCase() : 'U'}
                </div>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {user.name}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
                    {user.email}
                  </div>
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '11.5px',
                  color: 'var(--text-secondary)',
                  padding: '4px 6px',
                }}
              >
                <Database size={13} color="var(--accent-indigo)" />
                <span>Connected to <strong>Supabase PostgreSQL</strong></span>
              </div>

              <div style={{ paddingTop: '8px', display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                <button
                  onClick={() => setAuthModalOpen(false)}
                  className="hupa-btn"
                >
                  Close
                </button>
                <button
                  onClick={signOutUser}
                  className="hupa-btn danger"
                  style={{ gap: '6px' }}
                >
                  <LogOut size={13} /> Sign Out
                </button>
              </div>
            </div>
          ) : authModalTab === 'signin' ? (
            /* SIGN IN FORM */
            <form onSubmit={handleSignIn} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '10.5px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                  Email Address
                </label>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    height: '32px',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '6px',
                    padding: '0 10px',
                    backgroundColor: '#ffffff',
                  }}
                >
                  <Mail size={13} color="var(--text-muted)" />
                  <input
                    type="email"
                    required
                    placeholder="developer@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{
                      border: 'none',
                      outline: 'none',
                      fontSize: '12px',
                      color: 'var(--text-primary)',
                      flex: 1,
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '10.5px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                  Password
                </label>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    height: '32px',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '6px',
                    padding: '0 10px',
                    backgroundColor: '#ffffff',
                  }}
                >
                  <Lock size={13} color="var(--text-muted)" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{
                      border: 'none',
                      outline: 'none',
                      fontSize: '12px',
                      color: 'var(--text-primary)',
                      flex: 1,
                    }}
                  />
                </div>
              </div>

              {errorMsg && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#e11d48', fontSize: '11px' }}>
                  <AlertCircle size={13} /> {errorMsg}
                </div>
              )}

              {successMsg && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#059669', fontSize: '11px' }}>
                  <CheckCircle2 size={13} /> {successMsg}
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '6px' }}>
                <button
                  type="button"
                  onClick={() => setAuthModalOpen(false)}
                  className="hupa-btn"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="hupa-btn primary"
                  disabled={loading}
                  style={{ minWidth: '80px', justifyContent: 'center' }}
                >
                  {loading ? 'Signing in...' : 'Sign In'}
                </button>
              </div>
            </form>
          ) : (
            /* SIGN UP FORM */
            <form onSubmit={handleSignUp} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '10.5px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                  Full Name
                </label>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    height: '32px',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '6px',
                    padding: '0 10px',
                    backgroundColor: '#ffffff',
                  }}
                >
                  <User size={13} color="var(--text-muted)" />
                  <input
                    type="text"
                    required
                    placeholder="Sagar Murkute"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={{
                      border: 'none',
                      outline: 'none',
                      fontSize: '12px',
                      color: 'var(--text-primary)',
                      flex: 1,
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '10.5px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                  Email Address
                </label>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    height: '32px',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '6px',
                    padding: '0 10px',
                    backgroundColor: '#ffffff',
                  }}
                >
                  <Mail size={13} color="var(--text-muted)" />
                  <input
                    type="email"
                    required
                    placeholder="developer@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{
                      border: 'none',
                      outline: 'none',
                      fontSize: '12px',
                      color: 'var(--text-primary)',
                      flex: 1,
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '10.5px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                  Password (min 8 characters)
                </label>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    height: '32px',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '6px',
                    padding: '0 10px',
                    backgroundColor: '#ffffff',
                  }}
                >
                  <Lock size={13} color="var(--text-muted)" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{
                      border: 'none',
                      outline: 'none',
                      fontSize: '12px',
                      color: 'var(--text-primary)',
                      flex: 1,
                    }}
                  />
                </div>
              </div>

              {errorMsg && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#e11d48', fontSize: '11px' }}>
                  <AlertCircle size={13} /> {errorMsg}
                </div>
              )}

              {successMsg && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#059669', fontSize: '11px' }}>
                  <CheckCircle2 size={13} /> {successMsg}
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '6px' }}>
                <button
                  type="button"
                  onClick={() => setAuthModalOpen(false)}
                  className="hupa-btn"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="hupa-btn primary"
                  disabled={loading}
                  style={{ minWidth: '100px', justifyContent: 'center' }}
                >
                  {loading ? 'Creating...' : 'Create Account'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
