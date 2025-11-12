import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../config/axiosInstance';
import type { ProviderEntity, CreateProviderRequest, ProviderApiResponse } from '../../types/iProvider';


export const createProvider = createAsyncThunk(
  "providers/createProvider",
  async (providerData: CreateProviderRequest): Promise<ProviderEntity> => { 
    const response = await axiosInstance.post<ProviderEntity>("/providers", providerData, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  }
);

export const fetchProviders = createAsyncThunk(
  "providers/fetchProviders",
  async (): Promise<ProviderEntity[]> => {
    const response = await axiosInstance.get<ProviderApiResponse>("/providers");
    return response.data.data; 
  }
);

//  Fetch single provider by ID
export const fetchProviderById = createAsyncThunk(
  "providers/fetchProviderById",
  async (providerId: string): Promise<ProviderEntity> => {
    const response = await axiosInstance.get<ProviderEntity>(`/providers/${providerId}`);
    return response.data;
  }
);



export const updateProvider = createAsyncThunk(
  'providers/updateProvider',
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async ({ id, providerData }: { id: string; providerData: any }, { rejectWithValue }) => {
    try {
      // Send the providerData directly, don't wrap it in a data object
      const response = await axiosInstance.put(`/providers/${id}`, providerData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);