import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '../api/baseQuery';
import type { ProviderListResponse } from '../../types/Provider';

// Simple helper to build query string from paging args
const buildProviderQuery = (args?: { pageNumber?: number; pageSize?: number }) => {
  const pageNumber = args?.pageNumber ?? 1;
  const pageSize = args?.pageSize ?? 100; // default per requirement
  return `?pageNumber=${pageNumber}&pageSize=${pageSize}`;
};

export const providerApiSlice = createApi({
  reducerPath: 'providerApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Provider'],
  endpoints: (builder) => ({
    getProviders: builder.query<ProviderListResponse, { pageNumber?: number; pageSize?: number } | void>({
      query: (args) => `/providers${buildProviderQuery(typeof args === 'object' ? args : undefined)}`,
      providesTags: ['Provider']
    })
  })
});

export const { useGetProvidersQuery } = providerApiSlice;
