import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './context/AuthContext';
import ErrorBoundary from './components/ErrorBoundary';
import ProtectedRoute from './components/ProtectedRoute';
import GuestRoute from './components/GuestRoute';
import RoleRoute from './components/RoleRoute';
import DashboardLayout from './components/DashboardLayout';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ManageUsersPage from './pages/ManageUsersPage';
import ManageProductsPage from './pages/ManageProductsPage';
import ProfilePage from './pages/ProfilePage';
import OrdersPage from './pages/OrdersPage';
import ForbiddenPage from './pages/ForbiddenPage';
import NotFoundPage from './pages/NotFoundPage';

/* Loading Screen shown during initial auth hydration */
function LoadingScreen() {
  return (
    <div className="loading-screen" role="status" aria-label="Loading application">
      <div className="loading-logo" aria-hidden="true">🛡️</div>
      <div className="loading-spinner" aria-hidden="true" />
      <p className="loading-text">Initialising RoleGuard…</p>
    </div>
  );
}

/* Inner router — needs access to AuthContext */
function AppRoutes() {
  const { loading } = useAuth();

  if (loading) return <LoadingScreen />;

  return (
    <Routes>
      {/* Root → redirect to dashboard */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      {/* Guest-only routes */}
      <Route
        path="/login"
        element={
          <GuestRoute>
            <LoginPage />
          </GuestRoute>
        }
      />

      {/* Authenticated routes with Dashboard Layout */}
      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        {/* Dashboard — accessible to both admin and user */}
        <Route path="/dashboard" element={<DashboardPage />} />

        {/* Admin-only routes */}
        <Route
          path="/manage-users"
          element={
            <RoleRoute allowedRoles={['admin']}>
              <ManageUsersPage />
            </RoleRoute>
          }
        />
        <Route
          path="/manage-products"
          element={
            <RoleRoute allowedRoles={['admin']}>
              <ManageProductsPage />
            </RoleRoute>
          }
        />

        {/* User-only routes */}
        <Route
          path="/profile"
          element={
            <RoleRoute allowedRoles={['user']}>
              <ProfilePage />
            </RoleRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <RoleRoute allowedRoles={['user']}>
              <OrdersPage />
            </RoleRoute>
          }
        />
      </Route>

      {/* Forbidden */}
      <Route path="/forbidden" element={<ForbiddenPage />} />

      {/* 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
