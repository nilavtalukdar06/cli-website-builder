import { apiClient } from "../api/client";
import type {
  ApiResponse,
  LoginCredentials,
  SignupCredentials,
  User,
} from "../types/auth";

export const AuthService = {
  async signUp(credentials: SignupCredentials): Promise<ApiResponse<User>> {
    const response = await apiClient.post<ApiResponse<User>>(
      "/auth/sign-up",
      credentials,
    );
    return response.data;
  },

  async login(
    credentials: LoginCredentials,
  ): Promise<ApiResponse<{ user: User }>> {
    const response = await apiClient.post<ApiResponse<{ user: User }>>(
      "/auth/login",
      credentials,
    );
    return response.data;
  },

  async logout(): Promise<ApiResponse<Record<string, never>>> {
    const response =
      await apiClient.post<ApiResponse<Record<string, never>>>("/auth/logout");
    return response.data;
  },

  async getMe(): Promise<ApiResponse<{ user: User }>> {
    const response =
      await apiClient.get<ApiResponse<{ user: User }>>("/auth/me");
    return response.data;
  },
};
