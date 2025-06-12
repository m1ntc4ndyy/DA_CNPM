// src/components/ProtectedRoute.tsx
import React, { ReactNode } from 'react';
import { Navigate, useLocation  } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: string | string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
  const { currentUser, loading, hasRole } = useAuth();
  const location = useLocation();
  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (!currentUser) {
    console.log("User not authenticated");
    return <Navigate to={`/login?redirectTo=${encodeURIComponent(location.pathname + location.search)}`} />;
  }

  if (
    requiredRole &&
    (
      (Array.isArray(requiredRole) && !requiredRole.some(role => hasRole(role))) ||
      (!Array.isArray(requiredRole) && !hasRole(requiredRole))
    )
  ) {
    return <Navigate to="/unauthorized" />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;