import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/* ── Icon helpers ── */
const IconLock = () => (
  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <rect x="3" y="11" width="18" height="11" rx="2" />
    <path d="M7 11V7a5 5 0 0110 0v4" />
  </svg>
);

const IconMail = () => (
  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="M2 8l10 7 10-7" />
  </svg>
);

const IconEye = ({ open }) => open ? (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
) : (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" />
    <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);

const IconAlert = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);

const IconShield = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

export default function LoginPage() {
  const { login, loginError, clearError, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  // Where to redirect after login
  const from = location.state?.from || '/dashboard';

  // Expired session notice
  const [expiredNotice, setExpiredNotice] = useState(false);
  useEffect(() => {
    const handler = () => setExpiredNotice(true);
    window.addEventListener('auth:expired', handler);
    return () => window.removeEventListener('auth:expired', handler);
  }, []);

  // Clear API error when user starts typing
  useEffect(() => {
    if (loginError) clearError();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [email, password]);

  /* ── Validation ── */
  function validate() {
    const errs = {};
    if (!email.trim()) errs.email = 'Email is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = 'Enter a valid email address.';
    if (!password) errs.password = 'Password is required.';
    else if (password.length < 4) errs.password = 'Password must be at least 4 characters.';
    return errs;
  }

  /* ── Submit ── */
  async function handleSubmit(e) {
    e.preventDefault();
    setExpiredNotice(false);
    const errs = validate();
    if (Object.keys(errs).length) { setFieldErrors(errs); return; }
    setFieldErrors({});
    setSubmitting(true);
    const result = await login(email, password);
    setSubmitting(false);
    if (result.success) navigate(from, { replace: true });
  }

  /* ── Auto-fill demo credentials ── */
  function fillAdmin() {
    setEmail('amit.mehta@roleadmin.dev');
    setPassword('admin123');
    setFieldErrors({});
    clearError();
  }

  function fillUser() {
    setEmail('isha.sharma@reqres.in');
    setPassword('cityslicka');
    setFieldErrors({});
    clearError();
  }

  return (
    <main className="auth-page" id="login-page">
      {/* Background */}
      <div className="bg-orbs" aria-hidden="true">
        <div className="bg-orb bg-orb-1" />
        <div className="bg-orb bg-orb-2" />
        <div className="bg-orb bg-orb-3" />
      </div>
      <div className="grid-pattern" aria-hidden="true" />

      <div className="auth-container" role="main">
        {/* ── Left Sidebar ── */}
        <aside className="auth-sidebar" aria-label="Product info">
          <div className="auth-sidebar-content">
            <div className="auth-logo-wrap">
              <div className="auth-logo-icon" aria-hidden="true">🛡️</div>
              <span className="auth-logo-name">RoleGuard</span>
            </div>

            <h1 className="auth-sidebar-heading">
              Role-based <span>access control</span>
            </h1>
            <p className="auth-sidebar-desc">
              A full-featured role-based dashboard with Admin &amp; User roles,
              protected routes, sidebar navigation, and granular access control.
            </p>

            <div className="auth-features" role="list">
              {[
                { icon: '🛡️', text: 'Role-based access control (RBAC)' },
                { icon: '🔒', text: 'Admin & User route guards' },
                { icon: '📊', text: 'Role-specific dashboard views' },
                { icon: '🚫', text: 'Forbidden page for unauthorized access' },
                { icon: '⚠️', text: 'Error Boundary for UI resilience' },
              ].map((f) => (
                <div className="auth-feature" role="listitem" key={f.text}>
                  <div className="auth-feature-icon" aria-hidden="true">{f.icon}</div>
                  <span>{f.text}</span>
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* ── Right: Form Panel ── */}
        <section className="auth-form-panel" aria-label="Login form">
          <div className="auth-form-header">
            <h2 className="auth-form-title">Welcome back</h2>
            <p className="auth-form-subtitle">
              Sign in to access your{' '}
              <Link to="/dashboard" aria-label="Go to dashboard">role-based dashboard</Link>{' '}
              and protected pages.
            </p>
          </div>

          {/* Expired session notice */}
          {expiredNotice && (
            <div className="alert alert-error" role="alert" style={{ marginBottom: '20px' }}>
              <span className="alert-icon"><IconAlert /></span>
              <span>Your session expired. Please log in again.</span>
            </div>
          )}

          {/* API error */}
          {loginError && (
            <div className="alert alert-error" role="alert" id="login-error-banner" style={{ marginBottom: '20px' }}>
              <span className="alert-icon"><IconAlert /></span>
              <span>{loginError}</span>
            </div>
          )}

          <form
            className="auth-form"
            onSubmit={handleSubmit}
            noValidate
            aria-label="Sign in form"
          >
            {/* Email */}
            <div className="form-group">
              <label className="form-label" htmlFor="login-email">Email address</label>
              <div className="input-wrapper">
                <span className="input-icon"><IconMail /></span>
                <input
                  id="login-email"
                  type="email"
                  className={`form-input${fieldErrors.email ? ' has-error' : ''}`}
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  aria-required="true"
                  aria-describedby={fieldErrors.email ? 'email-error' : undefined}
                  aria-invalid={!!fieldErrors.email}
                />
              </div>
              {fieldErrors.email && (
                <span className="form-error-text" id="email-error" role="alert">
                  <IconAlert /> {fieldErrors.email}
                </span>
              )}
            </div>

            {/* Password */}
            <div className="form-group">
              <label className="form-label" htmlFor="login-password">Password</label>
              <div className="input-wrapper">
                <span className="input-icon"><IconLock /></span>
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  className={`form-input${fieldErrors.password ? ' has-error' : ''}`}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  aria-required="true"
                  aria-describedby={fieldErrors.password ? 'password-error' : undefined}
                  aria-invalid={!!fieldErrors.password}
                  style={{ paddingRight: '44px' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  style={{
                    position: 'absolute',
                    right: '14px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    color: 'var(--clr-text-400)',
                    display: 'flex',
                    cursor: 'pointer',
                  }}
                >
                  <IconEye open={showPassword} />
                </button>
              </div>
              {fieldErrors.password && (
                <span className="form-error-text" id="password-error" role="alert">
                  <IconAlert /> {fieldErrors.password}
                </span>
              )}
            </div>

            {/* Submit */}
            <button
              id="btn-login"
              type="submit"
              className="btn btn-primary btn-full btn-lg"
              disabled={submitting || loading}
              aria-busy={submitting}
            >
              {submitting ? (
                <>
                  <div className="btn-spinner" aria-hidden="true" />
                  Signing in…
                </>
              ) : (
                <>
                  <IconShield />
                  Sign in
                </>
              )}
            </button>

            <div className="form-divider">choose a role to login</div>

            {/* Demo credentials panel */}
            <div className="demo-credentials" role="complementary" aria-label="Demo credentials">
              <strong>🧪 Demo Credentials</strong>
              <div className="demo-credentials-grid">
                {/* Admin */}
                <div className="demo-credential-card demo-credential-admin">
                  <div className="demo-credential-header">
                    <span className="badge badge-warning">Admin</span>
                  </div>
                  <div className="demo-credential-info">
                    <code>amit.mehta@roleadmin.dev</code>
                    <code>admin123</code>
                  </div>
                  <p className="demo-credential-desc">Access Manage Users &amp; Products</p>
                  <button
                    type="button"
                    id="btn-fill-admin"
                    className="btn btn-outline btn-sm btn-full"
                    onClick={fillAdmin}
                  >
                    🛡️ Login as Admin
                  </button>
                </div>

                {/* User */}
                <div className="demo-credential-card demo-credential-user">
                  <div className="demo-credential-header">
                    <span className="badge badge-primary">User</span>
                  </div>
                  <div className="demo-credential-info">
                    <code>isha.sharma@reqres.in</code>
                    <code>cityslicka</code>
                  </div>
                  <p className="demo-credential-desc">Access Profile &amp; My Orders</p>
                  <button
                    type="button"
                    id="btn-fill-user"
                    className="btn btn-outline btn-sm btn-full"
                    onClick={fillUser}
                  >
                    👤 Login as User
                  </button>
                </div>
              </div>
            </div>
          </form>
        </section>
      </div>
    </main>
  );
}
