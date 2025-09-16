import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { environment } from '../../utils/environment';
import { logout } from '../slices/authSlice';

// Wrap fetchBaseQuery to catch 401 responses from RTK Query endpoints
export const baseQueryWithAuth = fetchBaseQuery({
  baseUrl: environment.apiUrl,
  prepareHeaders: (headers) => {
    const token = localStorage.getItem('token');
    if (token) headers.set('Authorization', `Bearer ${token}`);
    return headers;
  },
});

export const baseQueryWithReauth: typeof baseQueryWithAuth = async (args, api, extraOptions) => {
  const result = await baseQueryWithAuth(args, api, extraOptions);
  if (result.error && result.error.status === 401) {
    // Clear auth state & redirect
    api.dispatch(logout());
    // Avoid multiple rapid redirects
    if (window.location.pathname !== '/login') {
      window.location.href = '/login';
    }
  }
  return result;
};
