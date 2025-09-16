import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from '../api/baseQuery';
import type { ProviderListResponse } from '../../types/Provider';

export const providerApiSlice = createApi({
  reducerPath: 'providerApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Provider'],
  endpoints: (builder) => ({
    getProviders: builder.query<ProviderListResponse, void>({
      query: () => '/providers',
      providesTags: ['Provider']
    })
  })
});

export const { useGetProvidersQuery } = providerApiSlice;
