import { Navigate, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import ComingSoon from './pages/ComingSoon';
import { RequesterDashboard, DonorDashboard, AdminDashboard } from './pages/Dashboard';

const guarded = (role) => (
  <ProtectedRoute allowedRoles={[role]}>
    <Layout />
  </ProtectedRoute>
);

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route path="/requester" element={guarded('REQUESTER')}>
        <Route path="dashboard" element={<RequesterDashboard />} />
        <Route path="*" element={<ComingSoon />} />
      </Route>

      <Route path="/donor" element={guarded('DONOR')}>
        <Route path="dashboard" element={<DonorDashboard />} />
        <Route path="*" element={<ComingSoon />} />
      </Route>

      <Route path="/admin" element={guarded('ADMIN')}>
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="*" element={<ComingSoon />} />
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}