import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-sm font-medium text-muted-foreground animate-pulse">
          Loading...
        </div>
      </div>
    );
  }

  if (user === null) {
    const redirectUrl = encodeURIComponent(window.location.pathname + window.location.search);
    return <Navigate to={`/login?redirect=${redirectUrl}`} replace />;
  }

  return <>{children}</>;
};
