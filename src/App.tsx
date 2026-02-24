import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './presentation/pages/Dashboard';
import Home from './presentation/pages/Home';
import { Committees } from './presentation/pages/Committees';
import { AuthProvider } from './presentation/context/AuthContext';
import { Layout } from './presentation/components/Layout';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/home" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/committees" element={<Committees />} />
            <Route path="*" element={<Navigate to="/home" replace />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
