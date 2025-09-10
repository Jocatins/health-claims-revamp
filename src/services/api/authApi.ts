import axiosInstance from "./axiosInstance";
import type { LoginCredentials, LoginResponse } from "../../types/api";
import { formatApiError } from "../../utils/errorFormatter";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

class AuthAPI {
  private baseURL: string;

  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
  const response = await axiosInstance.post<LoginResponse>(
        `${this.baseURL}/auths`,
        credentials,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
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
