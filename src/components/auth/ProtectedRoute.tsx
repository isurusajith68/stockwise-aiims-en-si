import { ReactNode, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { useAuthMe } from "@/hooks/auth/useAuth";
import { LoadingScreen } from "../ui/loading-screen";

interface ProtectedRouteProps {
  children: ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const location = useLocation();
  const { user, isLoading, setLoading, setUser, setError } = useAuthStore();

  const { data, isError, error, isLoading: isAuthLoading } = useAuthMe(user);

  useEffect(() => {
    if (isAuthLoading) {
      setLoading(true);
    }

    if (isError) {
      setError(error?.message || "Authentication failed");
      setLoading(false);
    } else if (data) {
      setUser(data.data);
      setLoading(false);
    }
  }, [data, isError, error, isAuthLoading, setLoading, setUser, setError]);

  if (isLoading || isAuthLoading) {
    return <LoadingScreen />;
  }

  if (!user) {
    return <Navigate to="/" state={{ from: location.pathname }} replace />;
  }

  return <>{children}</>;
};

export const ProtectedRouteWithRedirect = ({
  children,
}: ProtectedRouteProps) => {
  const location = useLocation();
  const { user, isLoading, setLoading, setUser, setError } = useAuthStore();

  const { data, isError, error, isLoading: isAuthLoading } = useAuthMe(user);

  useEffect(() => {
    if (isAuthLoading) {
      setLoading(true);
    }

    if (isError) {
      setError(error?.message || "Authentication failed");
      setLoading(false);
    } else if (data) {
      setUser(data.data);
      setLoading(false);
    }
  }, [data, isError, error, isAuthLoading, setLoading, setUser, setError]);

  if (isLoading || isAuthLoading) {
    return <LoadingScreen />;
  }

  if (user) {
    return (
      <Navigate to="/dashboard" state={{ from: location.pathname }} replace />
    );
  }

  return <>{children}</>;
};
