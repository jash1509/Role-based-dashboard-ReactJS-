import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { tokenStorage, isTokenExpired } from '../services/token';

/**
 * ProtectedRoute — wraps routes that require authentication.
 * Redirects to /login with the attempted path stored in state,
 * so the user can be redirected back after a successful login.
 *
 * Also checks localStorage as a fallback — after login, React state
 * may not have committed yet when navigation fires, so we trust
 * localStorage to prevent a premature redirect.
 */
export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  // Still hydrating from storage — show nothing
  if (loading) return null;

  if (!isAuthenticated) {
    // Fallback: check localStorage directly (handles state propagation delay)
    const storedToken = tokenStorage.getToken();
    const storedUser = tokenStorage.getUser();
    if (storedToken && storedUser && !isTokenExpired()) {
      // Valid credentials in storage — context will catch up on next render
      return children;
    }

    return (
      <Navigate
        to="/login"
        state={{ from: location.pathname }}
        replace
      />
    );
  }

  return children;
}
