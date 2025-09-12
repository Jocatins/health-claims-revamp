import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { environment } from "../../utils/environment";
import type { TariffListResponse, TariffQueryArgs } from "../../types/Tariff";

// Helper to build query string from args
const buildQuery = (args: TariffQueryArgs) => {
  const params = new URLSearchParams();
  if (args.pageNumber) params.set("PageNumber", String(args.pageNumber));
  if (args.pageSize) params.set("PageSize", String(args.pageSize));
  if (args.sortedBy) params.set("SortedBy", args.sortedBy);
  if (args.sortDirection) params.set("SortDirection", args.sortDirection);
  const qs = params.toString();
  return qs ? `?${qs}` : "";
};

export const tariffApiSlice = createApi({
  reducerPath: "tariffApi",
  baseQuery: fetchBaseQuery({
    baseUrl: environment.apiUrl,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) headers.set("Authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ["Tariff"],
  endpoints: (builder) => ({
    getTariffs: builder.query<TariffListResponse, TariffQueryArgs>({
      query: (args) => `/tariff/providers/${args.providerId}/hmo/${args.hmoId}${buildQuery(args)}`,
      providesTags: ["Tariff"],
    }),
  }),
});

export const { useGetTariffsQuery } = tariffApiSlice;
