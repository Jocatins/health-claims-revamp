import { createAsyncThunk } from '@reduxjs/toolkit';
import type { Authorization, AuthorizationResponse, AuthorizationParams } from '../../types/authorization';
import axiosInstance from '../../config/axiosInstance';


export const fetchAuthorizations = createAsyncThunk<
  AuthorizationResponse,
  AuthorizationParams,
  { rejectValue: string }
>('authorizations/fetchAll', async (params, { rejectWithValue }) => {
  try {
    const queryParams: Record<string, string> = {
      providerId: params.providerId,
      hmoId: params.hmoId,
    };
    
    // Add optional params if they exist
    if (params.startDate) queryParams.startDate = params.startDate;
    if (params.endDate) queryParams.endDate = params.endDate;
    if (params.enrolleeNumber) queryParams.enrolleNumber = params.enrolleeNumber;
    if (params.authorizationNumber) queryParams.authorizationNumber = params.authorizationNumber;

    const response = await axiosInstance.get<AuthorizationResponse>('/authorizations', {
      params: queryParams
    });

    return response.data;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || 
      error.message || 
      'Failed to fetch authorizations'
    );
  }
});

export const fetchAuthorizationById = createAsyncThunk<
  Authorization,
  { id: string; providerId: string; hmoId: string },
  { rejectValue: string }
>('authorizations/fetchById', async ({ id, providerId, hmoId }, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get<Authorization>(`/authorizations/${id}`, {
      params: {
        providerId,
        hmoId
      }
    });

    return response.data;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || 
      error.message || 
      'Failed to fetch authorization'
    );
  }
});