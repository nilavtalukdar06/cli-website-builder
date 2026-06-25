import { apiClient } from "../api/client";
import type { ApiResponse } from "../types/auth";

export const BillingService = {
  async createCheckoutSession(): Promise<ApiResponse<{ sessionUrl: string }>> {
    const response =
      await apiClient.post<ApiResponse<{ sessionUrl: string }>>(
        "/billing/checkout",
      );
    return response.data;
  },

  async createPortalSession(): Promise<ApiResponse<{ portalUrl: string }>> {
    const response =
      await apiClient.post<ApiResponse<{ portalUrl: string }>>(
        "/billing/portal",
      );
    return response.data;
  },
};
