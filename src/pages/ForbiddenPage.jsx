import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ForbiddenPage() {
  const { user, isAuthenticated } = useAuth();

  return (
    <div className="forbidden-page">
      <div className="bg-orbs" aria-hidden="true">
        <div className="bg-orb bg-orb-1" />
        <div className="bg-orb bg-orb-2" />
      </div>
      <div className="grid-pattern" aria-hidden="true" />

      <div className="forbidden-content">
        <div className="forbidden-icon" aria-hidden="true">
          <svg width="80" height="80" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
          </svg>
        </div>
        <h1 className="forbidden-code">403</h1>
        <h2 className="forbidden-title">Access Forbidden</h2>
        <p className="forbidden-desc">
          {isAuthenticated ? (
            <>
              Your role <span className={`badge ${user?.role === 'admin' ? 'badge-warning' : 'badge-primary'}`} style={{ verticalAlign: 'middle' }}>
                {user?.role || 'unknown'}
              </span> does not have permission to access this page.
            </>
          ) : (
            'You do not have permission to access this page.'
          )}
        </p>
        <div className="forbidden-actions">
          <Link to="/dashboard" className="btn btn-primary">
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <rect x="3" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="14" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" />
            </svg>
            Go to Dashboard
          </Link>
          <Link to="/login" className="btn btn-outline">
            Switch Account
          </Link>
        </div>
      </div>
    </div>
  );
}
