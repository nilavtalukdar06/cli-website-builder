import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

interface GuestRouteProps {
  children: React.ReactNode;
}

export const GuestRoute: React.FC<GuestRouteProps> = ({ children }) => {
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

  if (user !== null) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};
