import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import { formatRemainingTime } from '../services/token';

export default function ProfilePage() {
  const { user, token } = useAuth();
  const [apiUser, setApiUser] = useState(null);
  const [apiStatus, setApiStatus] = useState('loading');
  const [timeLeft, setTimeLeft] = useState(formatRemainingTime());
  const [showToken, setShowToken] = useState(false);
  const [apiImgFailed, setApiImgFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function fetchUser() {
      try {
        setApiStatus('loading');
        const data = await authAPI.getProfile(2);
        if (!cancelled) {
          setApiUser(data.data);
          setApiStatus('success');
        }
      } catch {
        if (!cancelled) setApiStatus('error');
      }
    }
    fetchUser();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => setTimeLeft(formatRemainingTime()), 1000);
    return () => clearInterval(interval);
  }, []);

  const displayName = `${user?.first_name || ''} ${user?.last_name || ''}`.trim() || 'User';
  const initials = user
    ? `${user.first_name?.[0] || ''}${user.last_name?.[0] || user.first_name?.[1] || ''}`.toUpperCase()
    : '?';

  return (
    <div id="profile-page">
      <header className="page-header">
        <p className="page-greeting">Your Account</p>
        <h1 className="page-title">
          My <span>Profile</span> 👤
        </h1>
      </header>

      {/* Profile Hero */}
      <div className="profile-hero">
        <div className="avatar avatar-xl" aria-hidden="true">{initials}</div>
        <div className="profile-hero-info">
          <h2 className="profile-name">{displayName}</h2>
          <p className="profile-email">{user?.email || 'No email'}</p>
          <div className="profile-meta">
            <span className="badge badge-primary">User</span>
            <span className="badge badge-success">Active</span>
          </div>
        </div>
      </div>

      {/* Info Grid */}
      <div className="content-card">
        <h3 className="profile-section-title">Personal Information</h3>
        <div className="info-grid">
          <div className="info-field">
            <label>First Name</label>
            <div className="info-field-value">{user?.first_name || '—'}</div>
          </div>
          <div className="info-field">
            <label>Last Name</label>
            <div className="info-field-value">{user?.last_name || '—'}</div>
          </div>
          <div className="info-field">
            <label>Email</label>
            <div className="info-field-value">{user?.email || '—'}</div>
          </div>
          <div className="info-field">
            <label>Role</label>
            <div className="info-field-value" style={{ textTransform: 'capitalize' }}>{user?.role || '—'}</div>
          </div>
          <div className="info-field">
            <label>Member Since</label>
            <div className="info-field-value">
              {user?.joinedAt ? new Date(user.joinedAt).toLocaleDateString() : '—'}
            </div>
          </div>
          <div className="info-field">
            <label>Session Expiry</label>
            <div className="info-field-value">{timeLeft}</div>
          </div>
        </div>
      </div>

      {/* Token Info */}
      <div className="content-card">
        <h3 className="profile-section-title">Session Token</h3>
        <div className="token-display" role="region" aria-label="JWT Token">
          <pre style={{ margin: 0, fontSize: '0.75rem', whiteSpace: 'pre-wrap', fontFamily: "'Courier New', monospace" }}>
            {showToken ? token : '•'.repeat(40)}
          </pre>
        </div>
        <button
          className="btn btn-outline btn-sm"
          onClick={() => setShowToken((s) => !s)}
          style={{ marginTop: '12px' }}
        >
          {showToken ? '🙈 Hide Token' : '👁️ Reveal Token'}
        </button>
      </div>

      {/* API User */}
      {apiStatus === 'success' && apiUser && (
        <div className="content-card">
          <h3 className="profile-section-title">
            API Profile Data
            <span className="badge badge-primary" style={{ marginLeft: '10px', verticalAlign: 'middle' }}>reqres.in</span>
          </h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
            {apiImgFailed || !apiUser.avatar ? (
              <div className="avatar" style={{ width: 64, height: 64, fontSize: '1.2rem', fontWeight: 700 }} title={`${apiUser.first_name} ${apiUser.last_name}`}>
                {`${apiUser.first_name?.[0] || ''}${apiUser.last_name?.[0] || apiUser.first_name?.[1] || ''}`.toUpperCase()}
              </div>
            ) : (
              <img
                src={apiUser.avatar}
                alt={`${apiUser.first_name} ${apiUser.last_name}`}
                onError={() => setApiImgFailed(true)}
                style={{ width: 64, height: 64, borderRadius: '50%', border: '2px solid var(--clr-border)', objectFit: 'cover' }}
              />
            )}
            <div>
              <div style={{ fontWeight: 700, color: 'var(--clr-text-100)' }}>
                {apiUser.first_name} {apiUser.last_name}
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--clr-text-400)' }}>{apiUser.email}</div>
            </div>
          </div>
          <div className="token-display">
            <pre style={{ margin: 0, fontSize: '0.72rem', whiteSpace: 'pre-wrap', fontFamily: "'Courier New', monospace" }}>
              {JSON.stringify(apiUser, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
