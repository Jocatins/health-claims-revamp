import axiosInstance from "./axiosInstance";
import type { LoginCredentials, LoginResponse } from "../../types/api";
import { formatApiError } from "../../utils/errorFormatter";

class AuthAPI {

  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      // Use relative path so shared axiosInstance baseURL applies cleanly
      const response = await axiosInstance.post<LoginResponse>(
        '/auths',
        credentials,
        { headers: { "Content-Type": "application/json" } }
      );

      return response.data;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {

        throw new Error(formatApiError(error));
      // if (error.response) {
      //   throw new Error(error.response.data.message || "Login failed");
      // } else if (error.request) {
      //   throw new Error("Network error. Please check your connection.");
      // } else {
      //   throw new Error("An unexpected error occurred");
      // }

    }
  }
}

export const authAPI = new AuthAPI();
