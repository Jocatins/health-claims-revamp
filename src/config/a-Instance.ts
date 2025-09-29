import axios, { type AxiosInstance,type AxiosResponse, AxiosError,type InternalAxiosRequestConfig } from 'axios';
import { SessionManager } from '../utils/sessionManager';
// import { SessionManager } from '../utils/sessionManager';

class AxiosInterceptor {
  private instance: AxiosInstance;

  constructor() {
    this.instance = axios.create({
      baseURL: 'https://insurancestagingapi.healthstation.ng/api/v1',
      timeout: 120000, // 2 minutes
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor
    this.instance.interceptors.request.use(
      async (config: InternalAxiosRequestConfig) => {
        // Show loader if needed
        // onProcessingRequestStart();

        // Add authorization token
        const token = await SessionManager.getAccessToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        console.log('🚀 API Request:', {
          url: config.url,
          method: config.method,
          data: config.data,
        });

        return config;
      },
      (error: AxiosError) => {
        // onProcessingRequestEnds();
        console.error('❌ Request interceptor error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.instance.interceptors.response.use(
      (response: AxiosResponse) => {
        // onProcessingRequestEnds();
        console.log('✅ API Response:', {
          status: response.status,
          data: response.data,
        });
        return response;
      },
      async (error: AxiosError) => {
        // onProcessingRequestEnds();
        
        console.error('❌ Response interceptor error:', {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message,
        });

        // Handle 401 Unauthorized
        if (error.response?.status === 401) {
          console.log('Session expired, redirecting to login...');
          // Redirect to login page
          window.location.href = '/login';
          // Clear session
          await SessionManager.clearSession();
        }

        return Promise.reject(error);
      }
    );
  }

  public getInstance(): AxiosInstance {
    return this.instance;
  }
}

// Create and export the axios instance
export const aInstance = new AxiosInterceptor().getInstance();