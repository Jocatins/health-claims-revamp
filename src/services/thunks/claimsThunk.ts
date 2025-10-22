import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../config/axiosInstance';
import type { Claim, ClaimResponse } from '../../types/claims';
import type { RootState } from '../store/store';


// GET Claims thunk
export const fetchClaims = createAsyncThunk(
  "claims/fetchClaims",
  async (params: { 
    ProviderId: string;
    HmoId?: string;
    PageNumber?: number; 
    PageSize?: number;
    SortBy?: string;
  }, { getState }): Promise<Claim[]> => { 
    
  
    const state = getState() as RootState;

    const providerId = params.ProviderId || state.auth.user?.providerId;
    const hmoId = params.HmoId || state.auth.user?.hmoId;
    
    console.log('🔍 fetchClaims Params:', {
      providerIdFromParams: params.ProviderId,
      hmoIdFromParams: params.HmoId,
      providerIdFromState: state.auth.user?.providerId,
      hmoIdFromState: state.auth.user?.hmoId,
      finalProviderId: providerId,
      finalHmoId: hmoId
    });

    if (!providerId) {
      throw new Error('No ProviderId available');
    }

    const requestParams = {
      ProviderId: providerId,
      HmoId: hmoId,
      PageNumber: params.PageNumber || 1,
      PageSize: params.PageSize || 10,
      SortBy: params.SortBy || 'createdDate',
    };
    
    console.log('🚀 API Call Params:', requestParams);
    
    const response = await axiosInstance.get<ClaimResponse>("/claims/all-claims", { 
      params: requestParams 
    });
    
    console.log('✅ API Response:', response.data);
    console.log('📊 Response data.data:', response.data.data);
    
    return response.data.data; 
  }
);

// POST Claim thunk
export const createClaim = createAsyncThunk(
  "claims/createClaim",
  async (claimData: Omit<Claim, 'id' | 'createdDate' | 'attachments' | 'isActive' | 'claimStatus' | 'planTypeName' | 'providerName'>): Promise<Claim> => {
    const response = await axiosInstance.post<Claim>("/claims", claimData, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  }
);

// GET Single Claim thunk
export const fetchClaimById = createAsyncThunk(
  "claims/fetchClaimById",
  async (claimId: string): Promise<Claim> => {
    const response = await axiosInstance.get<Claim>(`/claims/${claimId}`);
    return response.data;
  }
);