import { useAuth } from '../context/AuthContext';

const ADMIN_STATS = [
  { id: 'users', icon: '👥', iconBg: 'rgba(99,102,241,0.15)', label: 'Total Users', value: '6', change: '+2 this week', positive: true },
  { id: 'products', icon: '📦', iconBg: 'rgba(6,182,212,0.12)', label: 'Products', value: '6', change: 'All in stock', positive: true },
  { id: 'orders', icon: '📋', iconBg: 'rgba(16,185,129,0.12)', label: 'Total Orders', value: '5', change: '+3 today', positive: true },
  { id: 'revenue', icon: '💰', iconBg: 'rgba(245,158,11,0.12)', label: 'Revenue', value: '₹32,362.53', change: '+12% this month', positive: true },
];

const USER_STATS = [
  { id: 'orders', icon: '📦', iconBg: 'rgba(99,102,241,0.15)', label: 'My Orders', value: '5', change: '2 delivered', positive: true },
  { id: 'spent', icon: '💳', iconBg: 'rgba(6,182,212,0.12)', label: 'Total Spent', value: '₹32,362.53', change: 'Lifetime', positive: true },
  { id: 'wishlist', icon: '❤️', iconBg: 'rgba(239,68,68,0.12)', label: 'Wishlist', value: '3', change: 'Items saved', positive: true },
  { id: 'rewards', icon: '⭐', iconBg: 'rgba(245,158,11,0.12)', label: 'Reward Points', value: '1,240', change: '+120 this month', positive: true },
];

const ADMIN_ACTIVITIES = [
  { id: 1, color: '#6366f1', text: 'New user "Tanvi Roy" registered', time: '2m ago' },
  { id: 2, color: '#06b6d4', text: 'Product "Kerala Coir Artifact" stock updated', time: '15m ago' },
  { id: 3, color: '#10b981', text: 'Order ORD-2025-005 marked as processing', time: '1h ago' },
  { id: 4, color: '#f59e0b', text: 'User "Chirag Mehta" deactivated', time: '3h ago' },
  { id: 5, color: '#8b5cf6', text: 'System backup completed successfully', time: '6h ago' },
];

const USER_ACTIVITIES = [
  { id: 1, color: '#6366f1', text: 'Order ORD-2025-004 delivered successfully', time: '2d ago' },
  { id: 2, color: '#06b6d4', text: 'Added "Darjeeling Tea Blend" to wishlist', time: '3d ago' },
  { id: 3, color: '#10b981', text: 'Payment of ₹7,469.17 processed', time: '5d ago' },
  { id: 4, color: '#f59e0b', text: 'Profile information updated', time: '1w ago' },
  { id: 5, color: '#8b5cf6', text: 'Earned 120 reward points', time: '1w ago' },
];

export default function DashboardPage() {
  const { user } = useAuth();
  const role = user?.role || 'user';
  const isAdmin = role === 'admin';

  const stats = isAdmin ? ADMIN_STATS : USER_STATS;
  const activities = isAdmin ? ADMIN_ACTIVITIES : USER_ACTIVITIES;

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div id="dashboard-page">
      {/* Page Header */}
      <header className="page-header">
        <p className="page-greeting">{greeting()},</p>
        <h1 className="page-title">
          Welcome back, <span>{user?.first_name || 'User'}</span> 👋
        </h1>
        <p style={{ color: 'var(--clr-text-400)', fontSize: '0.9rem', marginTop: '4px' }}>
          You are logged in as{' '}
          <span className={`badge ${isAdmin ? 'badge-warning' : 'badge-primary'}`} style={{ verticalAlign: 'middle' }}>
            {role}
          </span>
        </p>
      </header>

      {/* Stats */}
      <section aria-label="Dashboard statistics">
        <div className="stats-grid">
          {stats.map((stat) => (
            <article className="stat-card" key={stat.id} aria-label={`${stat.label}: ${stat.value}`}>
              <div
                className="stat-icon"
                style={{ background: stat.iconBg }}
                aria-hidden="true"
              >
                {stat.icon}
              </div>
              <div className="stat-value">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
              <div className={`stat-change ${stat.positive ? 'positive' : 'negative'}`}>
                {stat.positive ? '↑' : '↓'} {stat.change}
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Activity + Quick Actions */}
      <div className="dashboard-grid-2">
        {/* Recent Activity */}
        <section className="content-card" aria-label="Recent activity">
          <h2 className="section-title">
            Recent Activity
            <span className="badge badge-primary" style={{ marginLeft: '10px', verticalAlign: 'middle' }}>
              {isAdmin ? 'System' : 'Personal'}
            </span>
          </h2>
          <div className="activity-list" role="log" aria-live="polite">
            {activities.map((a) => (
              <div className="activity-item" key={a.id}>
                <div
                  className="activity-dot"
                  style={{ background: a.color }}
                  aria-hidden="true"
                />
                <span className="activity-text">{a.text}</span>
                <span className="activity-time">{a.time}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Quick Actions */}
        <section className="content-card" aria-label="Quick actions">
          <h2 className="section-title">Quick Actions</h2>
          <div className="quick-actions">
            {isAdmin ? (
              <>
                <a href="/manage-users" className="quick-action-card">
                  <div className="quick-action-icon" style={{ background: 'rgba(99,102,241,0.15)' }}>👥</div>
                  <div>
                    <div className="quick-action-title">Manage Users</div>
                    <div className="quick-action-desc">View and manage user accounts</div>
                  </div>
                </a>
                <a href="/manage-products" className="quick-action-card">
                  <div className="quick-action-icon" style={{ background: 'rgba(6,182,212,0.12)' }}>📦</div>
                  <div>
                    <div className="quick-action-title">Manage Products</div>
                    <div className="quick-action-desc">Update product catalog</div>
                  </div>
                </a>
              </>
            ) : (
              <>
                <a href="/orders" className="quick-action-card">
                  <div className="quick-action-icon" style={{ background: 'rgba(99,102,241,0.15)' }}>📋</div>
                  <div>
                    <div className="quick-action-title">My Orders</div>
                    <div className="quick-action-desc">Track your recent orders</div>
                  </div>
                </a>
                <a href="/profile" className="quick-action-card">
                  <div className="quick-action-icon" style={{ background: 'rgba(6,182,212,0.12)' }}>👤</div>
                  <div>
                    <div className="quick-action-title">My Profile</div>
                    <div className="quick-action-desc">View and edit your profile</div>
                  </div>
                </a>
              </>
            )}
          </div>
        </section>
      </div>

      {/* Role Info Banner */}
      <section className="role-info-banner" aria-label="Role information">
        <div className="role-info-icon" aria-hidden="true">{isAdmin ? '🛡️' : '👤'}</div>
        <div>
          <div className="role-info-title">
            {isAdmin ? 'Administrator Access' : 'Standard User Access'}
          </div>
          <div className="role-info-desc">
            {isAdmin
              ? 'You have full access to Manage Users and Manage Products. User-only pages (Profile, Orders) are restricted.'
              : 'You have access to your Profile and Orders. Admin pages (Manage Users, Manage Products) are restricted.'}
          </div>
        </div>
      </section>
    </div>
  );
}
