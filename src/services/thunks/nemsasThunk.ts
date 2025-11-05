import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../config/axiosInstance';
import type { Claim, ClaimResponse } from '../../types/claims';
import type { RootState } from '../store/store';

// GET NEMSAS Claims thunk
export const fetchNemsasClaims = createAsyncThunk(
  "nemsas/fetchNemsasClaims",
  async (params: { 
    ProviderId: string;
    NEMSASId?: string; // constant id required by backend
    StartDate?: string; // ISO date-time
    EndDate?: string;   // ISO date-time
    ClaimStatus?: string; // Pending | Processed | Rejected | Resolved | Approved | Paid
    PageNumber?: number; 
    PageSize?: number;
    SortBy?: string;
  }, { getState }): Promise<Claim[]> => { 
    
    const state = getState() as RootState;

    const providerId = params.ProviderId || state.auth.user?.providerId;
    
    console.log('🔍 fetchNemsasClaims Params:', {
      providerIdFromParams: params.ProviderId,
      providerIdFromState: state.auth.user?.providerId,
      finalProviderId: providerId,
      NEMSASId: params.NEMSASId,
      StartDate: params.StartDate,
      EndDate: params.EndDate,
      ClaimStatus: params.ClaimStatus,
    });

    if (!providerId) {
      throw new Error('No ProviderId available');
    }

    const requestParams = {
      ProviderId: providerId,
      NEMSASId: params.NEMSASId,
      StartDate: params.StartDate,
      EndDate: params.EndDate,
      ClaimStatus: params.ClaimStatus,
      PageNumber: params.PageNumber || 1,
      PageSize: params.PageSize || 10,
      SortBy: params.SortBy || 'createdDate',
    };
    
    console.log('🚀 NEMSAS API Call Params:', requestParams);
    
    const response = await axiosInstance.get<ClaimResponse>("/nemsas-claims/all-claims", { 
      params: requestParams 
    });
    
    console.log('📊 NEMSAS API Response:', {
      status: response.status,
      data: response.data,
      dataType: typeof response.data,
      hasData: !!response.data?.data,
      claims: response.data?.data || []
    });

    // Check if the response has the expected structure
    if (response.data && response.data.data) {
      return response.data.data; // Return the claims array
    } else if (Array.isArray(response.data)) {
      return response.data; // Return if it's already an array
    } else {
      console.warn('⚠️ Unexpected NEMSAS response structure:', response.data);
      return []; // Return empty array as fallback
    }
  }
);

// GET NEMSAS Claims by patient number
export const fetchNemsasClaimsByPatient = createAsyncThunk(
  'nemsas/fetchNemsasClaimsByPatient',
  async ({ patientNumber, ProviderId }: { patientNumber: string; ProviderId: string }, { getState }): Promise<Claim[]> => {
    const state = getState() as RootState;
    const providerId = ProviderId || state.auth.user?.providerId;

    if (!providerId) {
      throw new Error('No ProviderId available for patient-specific fetch');
    }
    if (!patientNumber) {
      throw new Error('No patientNumber provided');
    }

    console.log('🔍 fetchNemsasClaimsByPatient Params:', { patientNumber, providerId });

    const response = await axiosInstance.get<ClaimResponse>(`/nemsas-claims/${patientNumber}/${providerId}/patient`);
    console.log('📊 NEMSAS Patient API Response:', {
      status: response.status,
      data: response.data,
      hasData: !!response.data?.data,
      count: response.data?.data?.length
    });

    if (response.data && response.data.data) {
      return response.data.data;
    } else if (Array.isArray(response.data)) {
      return response.data;
    }
    return [];
  }
);