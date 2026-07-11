import { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { formatRemainingTime } from '../services/token';

/* ── SVG Icons ── */
const IconDashboard = () => (
  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <rect x="3" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="14" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" />
  </svg>
);

const IconUsers = () => (
  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
  </svg>
);

const IconProducts = () => (
  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
    <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
    <line x1="12" y1="22.08" x2="12" y2="12" />
  </svg>
);

const IconProfile = () => (
  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <circle cx="12" cy="8" r="4" />
    <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
  </svg>
);

const IconOrders = () => (
  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" />
    <rect x="9" y="3" width="6" height="4" rx="1" />
    <path d="M9 14l2 2 4-4" />
  </svg>
);

const IconMenu = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

const IconClose = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

/* ── Navigation config per role ── */
const NAV_ITEMS = {
  admin: [
    { to: '/dashboard', label: 'Dashboard', Icon: IconDashboard },
    { to: '/manage-users', label: 'Manage Users', Icon: IconUsers },
    { to: '/manage-products', label: 'Manage Products', Icon: IconProducts },
  ],
  user: [
    { to: '/dashboard', label: 'Dashboard', Icon: IconDashboard },
    { to: '/profile', label: 'Profile', Icon: IconProfile },
    { to: '/orders', label: 'My Orders', Icon: IconOrders },
  ],
};

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState(formatRemainingTime());
  const [loggingOut, setLoggingOut] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Update token countdown every second
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(formatRemainingTime());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setSidebarOpen(false);
  }, []);

  const handleLogout = async () => {
    setLoggingOut(true);
    await logout();
    navigate('/login');
  };

  const role = user?.role || 'user';
  const navItems = NAV_ITEMS[role] || NAV_ITEMS.user;

  const initials = user
    ? `${user.first_name?.[0] || ''}${user.last_name?.[0] || user.first_name?.[1] || ''}`.toUpperCase()
    : '?';

  return (
    <div className="dashboard-layout">
      {/* Sidebar Overlay (mobile) */}
      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* ── Sidebar ── */}
      <aside className={`sidebar ${sidebarOpen ? 'sidebar-open' : ''}`} aria-label="Main navigation">
        <div className="sidebar-header">
          <div className="sidebar-brand">
            <div className="sidebar-logo" aria-hidden="true">RG</div>
            <span className="sidebar-title">RoleGuard</span>
          </div>
          <button
            className="sidebar-close-btn"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            <IconClose />
          </button>
        </div>

        {/* Role Badge */}
        <div className="sidebar-role">
          <div className={`role-badge role-badge-${role}`}>
            {role === 'admin' ? '🛡️' : '👤'} {role.charAt(0).toUpperCase() + role.slice(1)}
          </div>
        </div>

        {/* Nav Links */}
        <nav className="sidebar-nav" role="navigation">
          {navItems.map(({ to, label, Icon }) => (
            <NavLink
              key={to}
              to={to}
              id={`nav-${to.replace('/', '')}`}
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              onClick={() => setSidebarOpen(false)}
            >
              <Icon />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="sidebar-footer">
          <div className="sidebar-user-info">
            <div className="avatar avatar-sm" aria-hidden="true">{initials}</div>
            <div className="sidebar-user-details">
              <span className="sidebar-user-name">{user?.first_name || 'User'} {user?.last_name || ''}</span>
              <span className="sidebar-user-email">{user?.email || ''}</span>
            </div>
          </div>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <div className="dashboard-main">
        {/* Header */}
        <header className="dashboard-header">
          <button
            className="sidebar-toggle"
            onClick={() => setSidebarOpen((o) => !o)}
            aria-label="Toggle sidebar"
          >
            <IconMenu />
          </button>

          <div className="header-spacer" />

          {/* Token countdown */}
          <div className="token-indicator" title="JWT session expiry" aria-label={`Session expires in ${timeLeft}`}>
            <div className="token-dot" aria-hidden="true" />
            <span>{timeLeft}</span>
          </div>

          {/* User chip */}
          <div className="header-user" aria-label="Logged in user">
            <div className="avatar avatar-sm" aria-hidden="true">{initials}</div>
            <span className="header-user-name">{user?.first_name || 'User'}</span>
            <span className={`badge ${role === 'admin' ? 'badge-warning' : 'badge-primary'}`}>
              {role}
            </span>
          </div>

          {/* Logout */}
          <button
            id="btn-logout"
            className="btn btn-outline btn-sm"
            onClick={handleLogout}
            disabled={loggingOut}
            aria-label="Logout"
          >
            {loggingOut ? (
              <div className="btn-spinner" aria-hidden="true" />
            ) : (
              <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
            )}
            Logout
          </button>
        </header>

        {/* Background */}
        <div className="bg-orbs" aria-hidden="true" style={{ opacity: 0.5 }}>
          <div className="bg-orb bg-orb-1" style={{ opacity: 0.12 }} />
          <div className="bg-orb bg-orb-2" style={{ opacity: 0.08 }} />
        </div>
        <div className="grid-pattern" aria-hidden="true" />

        {/* Page Content */}
        <main className="dashboard-content" role="main">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
