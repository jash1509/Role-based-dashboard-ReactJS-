import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { authAPI } from '../services/api';
import { tokenStorage, isTokenExpired } from '../services/token';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true); // initial hydration
  const [loginError, setLoginError] = useState(null);
  const expiryTimerRef = useRef(null);

  /* ── Logout (memoised so it can be used in effects) ── */
  const logout = useCallback(async () => {
    clearTimeout(expiryTimerRef.current);
    await authAPI.logout();
    tokenStorage.clear();
    setUser(null);
    setToken(null);
    setLoginError(null);
  }, []);

  /* ── Schedule auto-logout on token expiry ── */
  const scheduleExpiry = useCallback(() => {
    clearTimeout(expiryTimerRef.current);
    const expiry = tokenStorage.getExpiry();
    if (!expiry) return;
    const delay = expiry - Date.now();
    if (delay <= 0) { logout(); return; }
    expiryTimerRef.current = setTimeout(() => {
      logout();
      window.dispatchEvent(new CustomEvent('auth:expired'));
    }, delay);
  }, [logout]);

  /* ── Hydrate from storage on mount ── */
  useEffect(() => {
    const storedToken = tokenStorage.getToken();
    const storedUser = tokenStorage.getUser();

    if (storedToken && storedUser && !isTokenExpired()) {
      setToken(storedToken);
      setUser(storedUser);
      scheduleExpiry();
    } else if (storedToken) {
      // Token present but expired — clean up
      tokenStorage.clear();
    }
    setLoading(false);
  }, [scheduleExpiry]);

  /* ── Listen for 401 Unauthorized from API interceptor ── */
  useEffect(() => {
    const handle401 = () => logout();
    window.addEventListener('auth:unauthorized', handle401);
    return () => window.removeEventListener('auth:unauthorized', handle401);
  }, [logout]);

  /* ── Login ── */
  const login = useCallback(async (email, password) => {
    setLoginError(null);
    try {
      const data = await authAPI.login(email, password);
      const authToken = data.token;

      // Build user object with ROLE from API response
      const userObj = {
        id: 2,
        email,
        first_name: data.first_name || email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1),
        last_name: data.last_name || '',
        role: data.role || 'user',
        joinedAt: new Date().toISOString(),
      };

      tokenStorage.save(authToken, userObj);
      setToken(authToken);
      setUser(userObj);
      scheduleExpiry();
      return { success: true, role: userObj.role };
    } catch (err) {
      const message =
        err.response?.data?.error ||
        err.response?.data?.message ||
        (err.response?.status === 400 ? 'Invalid credentials. Please try again.' : null) ||
        (err.response?.status === 401 ? 'Unauthorized. Check your credentials.' : null) ||
        (err.code === 'ECONNABORTED' ? 'Request timed out. Check your connection.' : null) ||
        'Something went wrong. Please try again later.';
      setLoginError(message);
      return { success: false, error: message };
    }
  }, [scheduleExpiry]);

  /* ── Clear login error ── */
  const clearError = useCallback(() => setLoginError(null), []);

  const value = {
    user,
    token,
    loading,
    loginError,
    isAuthenticated: !!token && !!user,
    login,
    logout,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within <AuthProvider>');
  return ctx;
}
