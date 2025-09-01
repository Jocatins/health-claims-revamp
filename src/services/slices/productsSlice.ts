import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { environment } from "../../utils/environment";
import type { Product } from "../../types/Product";

export const productApiSlice = createApi({
  reducerPath: "productApi",
  baseQuery: fetchBaseQuery({
    baseUrl: environment.apiUrl,

    prepareHeaders: (headers) => {
      // for tokens
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Product"],
  endpoints: (builder) => ({
    // Get all products
    getProducts: builder.query<Product[], void>({
      query: () => "/products",

      providesTags: ["Product"],
    }),

    // Get single product by ID
    getProductById: builder.query<Product, string>({
      query: (id) => `/products/${id}`,
    }),

    // Create a new product
    createProduct: builder.mutation<Product, Partial<Product>>({
      query: (newProduct) => ({
        url: "/products",
        method: "POST",
        body: newProduct,
      }),
      // Invalidates the Product tag to refetch data
      invalidatesTags: ["Product"],
    }),

    // Update product
    updateProduct: builder.mutation<
      Product,
      { id: string; updates: Partial<Product> }
    >({
      query: ({ id, updates }) => ({
        url: `/products/${id}`,
        method: "PUT",
        body: updates,
      }),
      invalidatesTags: ["Product"],
    }),

    // Delete product
    deleteProduct: builder.mutation<void, string>({
      query: (id) => ({
        url: `/products/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Product"],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductByIdQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productApiSlice;
