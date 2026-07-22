import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import UserManagement from './pages/UserManagement';
import Analytics from './pages/Analytics';
import SosAlerts from './pages/SosAlerts';
import DangerZones from './pages/DangerZones';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import './index.css';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
}

function AdminLayout({ children, title }: { children: React.ReactNode; title: string }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <div style={{ flex: 1, marginLeft: '240px' }}>
        <Header title={title} />
        {children}
      </div>
    </div>
  );
}

function AppRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/dashboard" /> : <LoginPage />}
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <AdminLayout title="Dashboard">
              <Dashboard />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/users"
        element={
          <ProtectedRoute>
            <AdminLayout title="User Management">
              <UserManagement />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/analytics"
        element={
          <ProtectedRoute>
            <AdminLayout title="Analytics">
              <Analytics />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/sos-alerts"
        element={
          <ProtectedRoute>
            <AdminLayout title="SOS Alerts">
              <SosAlerts />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/danger-zones"
        element={
          <ProtectedRoute>
            <AdminLayout title="Danger Zones">
              <DangerZones />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/dashboard" />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}
