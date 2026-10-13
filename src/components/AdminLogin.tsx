import React, { useState } from 'react';
import { School, ShieldCheck, LogIn, Lock, Mail, AlertCircle, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { apiClient, User } from '../api';

interface AdminLoginProps {
  onLoginSuccess: (user: User) => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('admin@ekalvi.edu.my');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      try {
        const res = await apiClient.login(email, password);
        if (res.user.role !== 'ADMIN') {
          throw new Error('Access Denied: This portal requires School Administrator credentials.');
        }
        apiClient.setToken(res.token);
        apiClient.setUser(res.user);
        onLoginSuccess(res.user);
      } catch (apiErr: any) {
        // If API server error or offline, allow demo admin if credentials match
        if (email === 'admin@ekalvi.edu.my' && password === 'password123') {
          const demoAdmin: User = {
            id: 'admin-001',
            name: 'Thiru. Shanmugam (Guru Besar)',
            email: 'admin@ekalvi.edu.my',
            role: 'ADMIN',
            phone: '+60123456789',
          };
          apiClient.setToken('demo_admin_jwt_token_2026');
          apiClient.setUser(demoAdmin);
          onLoginSuccess(demoAdmin);
        } else {
          throw apiErr;
        }
      }
    } catch (err: any) {
      setError(err.message || 'Invalid administrator credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoAdmin = () => {
    setEmail('admin@ekalvi.edu.my');
    setPassword('password123');
    setError(null);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #2b0811 0%, #4d101e 50%, #1e1b4b 100%)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '24px',
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <div style={{
        maxWidth: 440,
        width: '100%',
        background: '#ffffff',
        borderRadius: 18,
        boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
        overflow: 'hidden',
        border: '1px solid rgba(212, 175, 55, 0.4)'
      }}>
        {/* Header Banner */}
        <div style={{
          background: 'linear-gradient(135deg, #4d101e 0%, #6b1d2f 100%)',
          color: '#ffffff',
          padding: '28px 24px',
          textAlign: 'center',
          position: 'relative',
          borderBottom: '3px solid #d4af37'
        }}>
          <div style={{
            width: 56,
            height: 56,
            borderRadius: 14,
            background: '#d4af37',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 14px auto',
            boxShadow: '0 4px 14px rgba(212, 175, 55, 0.4)'
          }}>
            <School size={30} color="#4d101e" />
          </div>
          <h1 style={{ fontSize: 20, fontWeight: 800, margin: '0 0 4px 0', color: '#fef08a' }}>
            eKalvi School Admin Portal
          </h1>
          <p style={{ fontSize: 12, margin: 0, color: '#e2e8f0', opacity: 0.9 }}>
            Sekolah Jenis Kebangsaan Tamil (SJKT) • Pentadbiran Sekolah
          </p>
        </div>

        {/* Form Body */}
        <div style={{ padding: '28px 26px' }}>
          {error && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              background: '#fef2f2',
              border: '1px solid #fecaca',
              color: '#b91c1c',
              padding: '10px 14px',
              borderRadius: 10,
              fontSize: 12,
              marginBottom: 18
            }}>
              <AlertCircle size={18} style={{ flexShrink: 0 }} />
              <div>{error}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#334155', marginBottom: 6 }}>
                Official Admin Email
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} color="#94a3b8" style={{ position: 'absolute', left: 12, top: 12 }} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@ekalvi.edu.my"
                  style={{
                    width: '100%',
                    padding: '10px 12px 10px 38px',
                    borderRadius: 10,
                    border: '1px solid #cbd5e1',
                    fontSize: 13,
                    boxSizing: 'border-box',
                    outline: 'none',
                    transition: 'border 0.2s'
                  }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#334155', marginBottom: 6 }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} color="#94a3b8" style={{ position: 'absolute', left: 12, top: 12 }} />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  style={{
                    width: '100%',
                    padding: '10px 12px 10px 38px',
                    borderRadius: 10,
                    border: '1px solid #cbd5e1',
                    fontSize: 13,
                    boxSizing: 'border-box',
                    outline: 'none',
                    transition: 'border 0.2s'
                  }}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                marginTop: 6,
                background: 'linear-gradient(135deg, #4d101e 0%, #6b1d2f 100%)',
                color: '#ffffff',
                border: 'none',
                padding: '12px',
                borderRadius: 10,
                fontSize: 14,
                fontWeight: 700,
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                boxShadow: '0 4px 12px rgba(77, 16, 30, 0.35)',
                transition: 'opacity 0.2s'
              }}
            >
              {loading ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <LogIn size={18} />
                  <span>Log In to School Admin</span>
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Shortcut */}
          <div style={{ marginTop: 22, paddingTop: 18, borderTop: '1px solid #f1f5f9' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 8, textAlign: 'center' }}>
              Quick Demo Access
            </div>
            <button
              type="button"
              onClick={fillDemoAdmin}
              style={{
                width: '100%',
                background: '#f8fafc',
                border: '1px dashed #cbd5e1',
                padding: '10px',
                borderRadius: 8,
                fontSize: 12,
                color: '#475569',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6
              }}
            >
              <CheckCircle2 size={15} color="#16a34a" />
              <span>Use Guru Besar Demo (admin@ekalvi.edu.my)</span>
            </button>
          </div>

          {/* Back Link */}
          <div style={{ marginTop: 18, textAlign: 'center' }}>
            <a
              href="https://www-uat.ekalvi.my/#portals"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                color: '#64748b',
                textDecoration: 'none',
                fontSize: 12,
                fontWeight: 500
              }}
            >
              <ArrowLeft size={14} />
              <span>Back to eKalvi Portals Directory</span>
            </a>
          </div>
        </div>
      </div>

      <div style={{ marginTop: 20, fontSize: 11, color: 'rgba(255,255,255,0.7)', textAlign: 'center' }}>
        eKalvi SJK(T) Digital Textbook & School Management Platform • 2026/2027
      </div>
    </div>
  );
};
