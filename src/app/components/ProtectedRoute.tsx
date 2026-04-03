import { ReactNode } from 'react';
import { Navigate } from 'react-router';
import { useAuth, UserRole } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: UserRole[];
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user, isAuthenticated } = useAuth();

  // Si no está autenticado, redirigir al login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Si hay roles permitidos y el usuario no tiene un rol permitido, redirigir
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    // Redirigir a la página correspondiente al rol del usuario
    const roleRoutes: Record<UserRole, string> = {
      cliente: '/',
      admin: '/admin',
      repartidor: '/repartidor',
    };
    return <Navigate to={roleRoutes[user.role]} replace />;
  }

  return <>{children}</>;
}
