
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function AdminRoute() {
  const { currentUser, role, loading } = useAuth();
  if (loading) return <div style={{ padding: 16 }}>Loading...</div>;
  if (!currentUser) return <Navigate to="/login" replace />;
  return role === 'admin' ? <Outlet /> : <Navigate to="/dashboard" replace />;
}
