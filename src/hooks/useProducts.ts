import type { SerializedError } from "@reduxjs/toolkit";
import { useGetProductsQuery } from "../services/slices/productsSlice";
import type { Product } from "../types/Product";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";


interface UseProductsReturn {
  products: Product[] | undefined;
  isLoading: boolean;
 error: FetchBaseQueryError | SerializedError | undefined;
  isError: boolean;
  isEmpty: boolean;
  errorMessage: string;
}

export const useProducts = (): UseProductsReturn => {
  const { data: products, isLoading, error, isError } = useGetProductsQuery();
  
  const getErrorMessage = (): string => {
    if (!error) return '';
    
    if ('status' in error) {
      return `Error ${error.status}: ${JSON.stringify(error.data)}`;
    }
    
    if ('message' in error) {
      return error.message || 'Unknown error occurred';
    }
    
    return 'An error occurred while fetching products';
  };

  return {
    products,
    isLoading,
    error,
    isError,
    isEmpty: !products || products.length === 0,
    errorMessage: getErrorMessage()
  };
};