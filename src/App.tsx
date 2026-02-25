import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './presentation/pages/Dashboard';
import Home from './presentation/pages/Home';
import { Committees } from './presentation/pages/Committees';
import { CommitteeDetail } from './presentation/pages/CommitteeDetail';
import { AuthProvider } from './presentation/context/AuthContext';
import { Layout } from './presentation/components/Layout';
import { useAuth } from './presentation/hooks/useAuth';
import Login from './presentation/pages/Login';
import type { ReactNode } from 'react';

/** Route-level permission guard: checks if the user has canRead for the given menuKey */
const PermissionGate = ({ menuKey, children }: { menuKey: string; children: ReactNode }) => {
  const { user } = useAuth();
  const permissions = user?.permissions || [];
  const hasAccess = permissions.some(p => p.menuKey === menuKey && p.canRead);

  if (!hasAccess) {
    return <Navigate to="/home" replace />;
  }

  return <>{children}</>;
};

const ProtectedRoutes = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <Layout>
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/committees" element={
          <PermissionGate menuKey="/committees">
            <Committees />
          </PermissionGate>
        } />
        <Route path="/committees/:id" element={
          <PermissionGate menuKey="/committees">
            <CommitteeDetail />
          </PermissionGate>
        } />
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </Layout>
  );
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/*" element={<ProtectedRoutes />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

