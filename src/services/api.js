import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://reqres.in/api';
const LOGIN_ENDPOINT = import.meta.env.VITE_AUTH_LOGIN_ENDPOINT || '/login';
const LOGOUT_ENDPOINT = import.meta.env.VITE_AUTH_LOGOUT_ENDPOINT || '/logout';
const REQRES_API_KEY = import.meta.env.VITE_REQRES_API_KEY || '';

// ── Create Axios instance ──
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    ...(REQRES_API_KEY ? { 'x-api-key': REQRES_API_KEY } : {}),
  },
  timeout: 10000,
});

// ── Request interceptor — attach JWT Bearer token ──
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response interceptor — handle 401 Unauthorized globally ──
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Check if it's an API Key configuration error rather than user auth expiration
      const errorMsg = (error.response?.data?.error || '').toLowerCase();
      const messageMsg = (error.response?.data?.message || '').toLowerCase();
      const isApiKeyError =
        errorMsg.includes('api_key') ||
        errorMsg.includes('api key') ||
        messageMsg.includes('api_key') ||
        messageMsg.includes('api key') ||
        messageMsg.includes('x-api-key');

      if (!isApiKeyError) {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
        localStorage.removeItem('auth_expiry');
        window.dispatchEvent(new CustomEvent('auth:unauthorized'));
      }
    }
    return Promise.reject(error);
  }
);

// ── Mock login credentials with ROLE assignments ──
const MOCK_USERS = [
  {
    email: 'isha.sharma@reqres.in',
    password: 'cityslicka',
    token: 'mock-jwt-eve-holt-token-abc123',
    role: 'user',
    first_name: 'Isha',
    last_name: 'Sharma',
  },
  {
    email: 'chirag.mehta@reqres.in',
    password: 'pistol',
    token: 'mock-jwt-charles-token-def456',
    role: 'user',
    first_name: 'Chirag',
    last_name: 'Mehta',
  },
  {
    email: 'amit.mehta@roleadmin.dev',
    password: 'admin123',
    token: 'mock-jwt-admin-token-xyz789',
    role: 'admin',
    first_name: 'Amit',
    last_name: 'Mehta',
  },
];

// Mapping to convert reqres.in API users to Indian names and emails
const USER_MAPPINGS = {
  'george.bluth@reqres.in': {
    first_name: 'Gaurav',
    last_name: 'Bhardwaj',
    email: 'gaurav.bhardwaj@reqres.in'
  },
  'janet.weaver@reqres.in': {
    first_name: 'Jyoti',
    last_name: 'Verma',
    email: 'jyoti.verma@reqres.in'
  },
  'emma.wong@reqres.in': {
    first_name: 'Jash',
    last_name: 'Barot',
    email: 'jash.barot@reqres.in'
  },
  'eve.holt@reqres.in': {
    first_name: 'Isha',
    last_name: 'Sharma',
    email: 'isha.sharma@reqres.in'
  },
  'charles.morris@reqres.in': {
    first_name: 'Chirag',
    last_name: 'Mehta',
    email: 'chirag.mehta@reqres.in'
  },
  'tracey.ramos@reqres.in': {
    first_name: 'Tanvi',
    last_name: 'Roy',
    email: 'tanvi.roy@reqres.in'
  },
  'admin@roleadmin.dev': {
    first_name: 'Amit',
    last_name: 'Mehta',
    email: 'amit.mehta@roleadmin.dev'
  }
};

const REVERSE_EMAIL_MAPPINGS = {
  'gaurav.bhardwaj@reqres.in': 'george.bluth@reqres.in',
  'jyoti.verma@reqres.in': 'janet.weaver@reqres.in',
  'jash.barot@reqres.in': 'emma.wong@reqres.in',
  'isha.sharma@reqres.in': 'eve.holt@reqres.in',
  'chirag.mehta@reqres.in': 'charles.morris@reqres.in',
  'tanvi.roy@reqres.in': 'tracey.ramos@reqres.in',
  'amit.mehta@roleadmin.dev': 'admin@roleadmin.dev',
};

function transformUser(user) {
  if (!user) return user;
  const key = user.email?.toLowerCase();
  const mapping = USER_MAPPINGS[key];
  if (mapping) {
    return {
      ...user,
      first_name: mapping.first_name,
      last_name: mapping.last_name,
      email: mapping.email,
    };
  }
  return user;
}

/**
 * Try reqres.in login first; fall back to mock if the API returns
 * an error about a missing/invalid API key (400/401/403).
 */
async function loginWithFallback(email, password) {
  // Check mock credentials first to get the role
  const mock = MOCK_USERS.find(
    (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
  );

  const apiEmail = REVERSE_EMAIL_MAPPINGS[email.toLowerCase()] || email;

  try {
    const response = await apiClient.post(LOGIN_ENDPOINT, { email: apiEmail, password });
    // If API succeeded, attach mock role info
    return {
      ...response.data,
      role: mock?.role || 'user',
      first_name: mock?.first_name || email.split('@')[0],
      last_name: mock?.last_name || '',
    };
  } catch (err) {
    const status = err.response?.status;
    const errMsg = (err.response?.data?.error || '').toLowerCase();

    const isMissingKey =
      errMsg.includes('missing') ||
      errMsg.includes('api key') ||
      errMsg.includes('api_key') ||
      status === 403;

    if (isMissingKey || !err.response) {
      if (mock) {
        return {
          token: mock.token,
          role: mock.role,
          first_name: mock.first_name,
          last_name: mock.last_name,
          _mock: true,
        };
      }
      const apiError = new Error('Invalid credentials.');
      apiError.response = { status: 400, data: { error: 'Invalid credentials.' } };
      throw apiError;
    }

    throw err;
  }
}

/* ── Mock data: Users list (for Admin → Manage Users) ── */
const MOCK_USERS_LIST = [
  { id: 1, email: 'gaurav.bhardwaj@reqres.in', first_name: 'Gaurav', last_name: 'Bhardwaj', avatar: 'https://reqres.in/img/faces/1-image.jpg', role: 'user', status: 'active' },
  { id: 2, email: 'jyoti.verma@reqres.in', first_name: 'Jyoti', last_name: 'Verma', avatar: 'https://reqres.in/img/faces/2-image.jpg', role: 'user', status: 'active' },
  { id: 3, email: 'jash.barot@reqres.in', first_name: 'Jash', last_name: 'Barot', avatar: 'https://reqres.in/img/faces/3-image.jpg', role: 'admin', status: 'active' },
  { id: 4, email: 'isha.sharma@reqres.in', first_name: 'Isha', last_name: 'Sharma', avatar: 'https://reqres.in/img/faces/4-image.jpg', role: 'user', status: 'active' },
  { id: 5, email: 'chirag.mehta@reqres.in', first_name: 'Chirag', last_name: 'Mehta', avatar: 'https://reqres.in/img/faces/5-image.jpg', role: 'user', status: 'inactive' },
  { id: 6, email: 'tanvi.roy@reqres.in', first_name: 'Tanvi', last_name: 'Roy', avatar: 'https://reqres.in/img/faces/6-image.jpg', role: 'user', status: 'active' },
];

/* ── Mock data: Products list (for Admin → Manage Products) ── */
const MOCK_PRODUCTS = [
  { id: 1, name: 'Jaipur Blue Pottery', color: '#98B2D1', year: 2000, pantone: '15-4020', price: 2489.17, stock: 142 },
  { id: 2, name: 'Kashmiri Kesar (Saffron)', color: '#C74375', year: 2001, pantone: '17-2031', price: 4149.17, stock: 87 },
  { id: 3, name: 'Banarasi Silk Saree', color: '#BF1932', year: 2002, pantone: '19-1664', price: 2863.50, stock: 231 },
  { id: 4, name: 'Darjeeling Tea Blend', color: '#7BC4C4', year: 2003, pantone: '14-4811', price: 1659.17, stock: 56 },
  { id: 5, name: 'Mysore Sandalwood Handcrafted', color: '#E2583E', year: 2004, pantone: '17-1456', price: 5394.17, stock: 12 },
  { id: 6, name: 'Kerala Coir Artifact', color: '#53B0AE', year: 2005, pantone: '15-5217', price: 7469.17, stock: 198 },
];

/* ── Mock data: Orders list (for User → My Orders) ── */
const MOCK_ORDERS = [
  { id: 'ORD-2024-001', product: 'Jaipur Blue Pottery', quantity: 2, total: 4978.34, status: 'delivered', date: '2024-12-15' },
  { id: 'ORD-2024-002', product: 'Kashmiri Kesar (Saffron)', quantity: 1, total: 4149.17, status: 'shipped', date: '2024-12-20' },
  { id: 'ORD-2025-003', product: 'Darjeeling Tea Blend', quantity: 3, total: 4977.51, status: 'processing', date: '2025-01-05' },
  { id: 'ORD-2025-004', product: 'Kerala Coir Artifact', quantity: 1, total: 7469.17, status: 'delivered', date: '2025-01-12' },
  { id: 'ORD-2025-005', product: 'Mysore Sandalwood Handcrafted', quantity: 2, total: 10788.34, status: 'pending', date: '2025-02-01' },
];

/* ── Auth API ── */
export const authAPI = {
  login: (email, password) => loginWithFallback(email, password),

  logout: async () => {
    try {
      await apiClient.post(LOGOUT_ENDPOINT);
    } catch {
      // Silent — reqres.in has no real logout; token cleared client-side
    }
  },

  getProfile: async (userId = 2) => {
    try {
      const response = await apiClient.get(`/users/${userId}`);
      if (response.data && response.data.data) {
        response.data.data = transformUser(response.data.data);
      }
      return response.data;
    } catch (err) {
      const status = err.response?.status;
      if (status === 403 || status === 401 || !err.response) {
        const mockUser = MOCK_USERS_LIST.find((u) => u.id === userId) || MOCK_USERS_LIST[1];
        return {
          data: {
            id: mockUser.id,
            email: mockUser.email,
            first_name: mockUser.first_name,
            last_name: mockUser.last_name,
            avatar: mockUser.avatar,
          },
        };
      }
      throw err;
    }
  },

  getUsers: async () => {
    try {
      const response = await apiClient.get('/users?page=1');
      if (response.data && Array.isArray(response.data.data)) {
        response.data.data = response.data.data.map(transformUser);
      }
      return response.data;
    } catch {
      return { data: MOCK_USERS_LIST, total: MOCK_USERS_LIST.length };
    }
  },

  getProducts: async () => {
    // reqres.in doesn't have products — use mock data
    return { data: MOCK_PRODUCTS, total: MOCK_PRODUCTS.length };
  },

  getOrders: async () => {
    // Mock data for user orders
    return { data: MOCK_ORDERS, total: MOCK_ORDERS.length };
  },
};

export { MOCK_USERS_LIST, MOCK_PRODUCTS, MOCK_ORDERS };
export default apiClient;
