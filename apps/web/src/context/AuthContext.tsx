import React, { createContext, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "../store/useAuthStore";
import { AuthService } from "../services/auth.service";
import type { User, LoginCredentials } from "../types/auth";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const {
    user,
    isLoading: storeLoading,
    setUser,
    setIsLoading,
    logout: clearStore,
  } = useAuthStore();
  const queryClient = useQueryClient();

  const {
    data,
    isLoading: queryLoading,
    refetch,
    isError,
  } = useQuery({
    queryKey: ["session"],
    queryFn: AuthService.getMe,
    retry: false,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (!queryLoading) {
      if (data?.success && data?.data?.user) {
        setUser(data.data.user);
      } else {
        setUser(null);
      }
    }
  }, [data, queryLoading, setUser, isError]);

  const loginMutation = useMutation({
    mutationFn: AuthService.login,
    onSuccess: async (res) => {
      if (res.success && res.data.user) {
        setUser(res.data.user);
        queryClient.setQueryData(["session"], res);
      }
    },
  });

  const logoutMutation = useMutation({
    mutationFn: AuthService.logout,
    onSuccess: async () => {
      clearStore();
      queryClient.setQueryData(["session"], null);
      await queryClient.invalidateQueries({ queryKey: ["session"] });
    },
  });

  const login = async (credentials: LoginCredentials) => {
    await loginMutation.mutateAsync(credentials);
  };

  const logout = async () => {
    await logoutMutation.mutateAsync();
  };

  const refreshSession = async () => {
    setIsLoading(true);
    const result = await refetch();
    if (result.data?.success && result.data.data.user) {
      setUser(result.data.data.user);
    } else {
      setUser(null);
    }
  };

  const loading =
    queryLoading ||
    storeLoading ||
    loginMutation.isPending ||
    logoutMutation.isPending;

  return (
    <AuthContext.Provider
      value={{ user, loading, login, logout, refreshSession }}
    >
      {children}
    </AuthContext.Provider>
  );
};
