import { Navigate } from 'react-router-dom';
import { useAuth, dashboardPath } from '../context/AuthContext';

export default function ProtectedRoute({ allowedRoles, children }) {
  const { token, user } = useAuth();
  if (!token || !user) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to={dashboardPath(user.role)} replace />;
  }
  return children;
}