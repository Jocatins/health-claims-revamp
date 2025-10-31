/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../config/axiosInstance';

import type { Bank, IEnrolleeClass, IEnrolleeClassResponse, IEnrolleeType, IEnrolleeTypeResponse, IGender, IMaritalStatuses, IPlanType, IPlanTypeResponse, IRelationship } from '../../types/resources';
import { formatApiError } from '../../utils/errorFormatter';

const RESOURCES_BASE = "/resources";
const SETTINGS_BASE = "/settings";

// Gender thunks
export const fetchGenders = createAsyncThunk(
  "gender/fetchGenders",
  async (): Promise<string[]> => {
    const response = await axiosInstance.get<IGender>(`${RESOURCES_BASE}/genders`);
    return response.data.data;
  }
);

// Marital Status thunks
export const fetchMaritalStatuses = createAsyncThunk(
  "maritalStatus/fetchMaritalStatuses",
  async (): Promise<string[]> => {
    const response = await axiosInstance.get<IMaritalStatuses>(`${RESOURCES_BASE}/marital-statuses`);
    return response.data.data;
  }
);

// Relationship thunks
export const fetchRelationships = createAsyncThunk(
  "relationship/fetchRelationships",
  async (): Promise<string[]> => {
    const response = await axiosInstance.get<IRelationship>(`${RESOURCES_BASE}/relationships`);
    return response.data.data;
  }
);

// EnrolleeType thunks
export const fetchEnrolleeType = createAsyncThunk(
  "enrolleeType/fetchEnrolleeType",
  async (): Promise<IEnrolleeType[]> => { 
    const response = await axiosInstance.get<IEnrolleeTypeResponse>(
      `${SETTINGS_BASE}/enrollee-type`
    )
    return response.data.data;
  }
);
// EnrolleeClass thunks
export const fetchEnrolleeClass = createAsyncThunk(
  "enrolleeClass/fetchEnrolleeClass",
  async (): Promise<IEnrolleeClass[]> => { 
    const response = await axiosInstance.get<IEnrolleeClassResponse>(
      `${SETTINGS_BASE}/enrollee-class`
    )
    return response.data.data;
  }
);
// PlanType thunks
export const fetchPlanTypes = createAsyncThunk(
  "planType/fetchPlanTypes",
  async (): Promise<IPlanType[]> => { 
    try {
      const response = await axiosInstance.get<IPlanTypeResponse>(
        `${SETTINGS_BASE}/plan-types`
      );

      if (response.data.isSuccess) {
        return response.data.data; // Return the full data array
      } else {
        throw new Error(response.data.message);
      }
    } catch (error: unknown) {
      const message = formatApiError(error);
      console.error("Error fetching planType:", message);
      throw new Error(message);
    }
  }
);

// Create Bank
export const createBank = createAsyncThunk(
  'banks/createBank',
  async (bankData: Omit<Bank, 'id'>, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post<Bank>(`${RESOURCES_BASE}/banks`, bankData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create bank');
    }
  }
);

// Read Banks (Get All)
export const fetchBanks = createAsyncThunk(
  'banks/fetchBanks',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get<{ data: Bank[] }>(`${RESOURCES_BASE}/banks`);
      return response.data.data; // Extract the data array
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch banks');
    }
  }
);

// Read Bank (Get Single)
export const fetchBankById = createAsyncThunk(
  'banks/fetchBankById',
  async (bankId: number, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get<Bank>(`${RESOURCES_BASE}/banks/${bankId}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch bank');
    }
  }
);

// Update Bank
export const updateBank = createAsyncThunk(
  'banks/updateBank',
  async ({ id, ...bankData }: Bank, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put<Bank>(`${RESOURCES_BASE}/banks/${id}`, bankData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update bank');
    }
  }
);