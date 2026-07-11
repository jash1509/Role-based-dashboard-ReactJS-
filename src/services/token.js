/**
 * Token utilities — store, retrieve, validate JWT expiry.
 * Tokens are stored in localStorage for persistence.
 */

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';
const EXPIRY_KEY = 'auth_expiry';

const EXPIRY_HOURS = Number(import.meta.env.VITE_TOKEN_EXPIRY_HOURS) || 1;

/* ── Storage helpers ── */
export const tokenStorage = {
  save(token, user) {
    const expiryMs = Date.now() + EXPIRY_HOURS * 60 * 60 * 1000;
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    localStorage.setItem(EXPIRY_KEY, String(expiryMs));
  },

  getToken() {
    return localStorage.getItem(TOKEN_KEY);
  },

  getUser() {
    try {
      const raw = localStorage.getItem(USER_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },

  getExpiry() {
    const raw = localStorage.getItem(EXPIRY_KEY);
    return raw ? Number(raw) : null;
  },

  clear() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(EXPIRY_KEY);
  },
};

/* ── Expiry check ── */
export function isTokenExpired() {
  const expiry = tokenStorage.getExpiry();
  if (!expiry) return true;
  return Date.now() > expiry;
}

export function getRemainingTime() {
  const expiry = tokenStorage.getExpiry();
  if (!expiry) return 0;
  const remaining = expiry - Date.now();
  return Math.max(0, remaining);
}

export function formatRemainingTime() {
  const ms = getRemainingTime();
  if (ms === 0) return 'Expired';
  const totalSecs = Math.floor(ms / 1000);
  const mins = Math.floor(totalSecs / 60);
  const secs = totalSecs % 60;
  return `${mins}m ${secs}s`;
}
