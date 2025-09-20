import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

const axiosInstance = axios.create({
  baseURL: BASE_URL,
});

// Attach token to every request
axiosInstance.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers = config.headers || {};
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

// Intercept responses to handle 401 errors
axiosInstance.interceptors.response.use(
  response => response,
  error => {
    const status = error?.response?.status || error?.status;
    if (status === 401) {
      // Clear stored auth info
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
