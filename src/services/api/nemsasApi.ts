import axiosInstance from '../../config/axiosInstance';

// Fetch all NEMSAS claims with query params
export const fetchNemsasClaims = async (params: {
  ProviderId?: string;
  StartDate?: string;
  EndDate?: string;
  HmoId?: string;
  id?: string;
  claimStatus?: string;
  IsExcel?: boolean;
  PageNumber?: number;
  PageSize?: number;
} = {}) => {
  const merged = { ...params };
  const res = await axiosInstance.get(`/nemsas-claims/all-claims`, { params: merged });
  return res.data;
};

export const exportNemsasClaimsReport = async (params: {
  ProviderId?: string;
  StartDate?: string;
  EndDate?: string;
  HmoId?: string;
  ClaimStatus?: string;
  IsExcel?: boolean;
}) => {
  const res = await axiosInstance.get(`/reports/nemsas-claim-reports`, {
    params,
    responseType: 'blob',
  });
  return res.data;
};

// Types for creating a NEMSAS claim
export interface NemsasClaimItemRequest {
  id: string; // client-generated UUID
  name: string;
  amount: number;
  claimStatus: string | number; // backend may return numeric codes; requests may send string
  claimType: string; // e.g. 'InpatientCare' | 'OutpatientCare'
  quantity: number;
}

export interface CreateNemsasClaimRequest {
  nemsasId: string; // Assuming same as providerId unless specified otherwise
  providerId: string;
  claimName: string;
  claimDate: string; // ISO string
  patientName: string;
  patientNumber: string;
  phoneNumber: string;
  serviceDate: string; // ISO string
  serviceType: string; // Encounter type backend value
  claimItems: NemsasClaimItemRequest[];
}

// Create a single NEMSAS claim
export const createNemsasClaim = async (payload: CreateNemsasClaimRequest) => {
  const res = await axiosInstance.post(`/nemsas-claims`, payload);
  return res.data;
};

// Fetch claims by patient number and providerId
export const fetchNemsasClaimsByPatient = async (patientNumber: string, providerId: string) => {
  const res = await axiosInstance.get(`/nemsas-claims/${patientNumber}/${providerId}/patient`);
  return res.data; // Expect same { data, message, isSuccess } shape
};

// Fetch single NEMSAS claim by id
export const fetchNemsasClaimById = async (id: string) => {
  const res = await axiosInstance.get(`/nemsas-claims/${id}`);
  return res.data; // { data, message, isSuccess }
};

// Update NEMSAS claim by id (PUT)
export interface UpdateNemsasClaimRequest {
  nemsasId: string;
  providerId: string;
  claimName: string;
  claimDate: string;
  patientName: string;
  patientNumber: string;
  phoneNumber: string;
  serviceDate: string;
  serviceType: string;
  claimItems: NemsasClaimItemRequest[];
  id: string; // claim id
}

export const updateNemsasClaim = async (id: string, payload: UpdateNemsasClaimRequest) => {
  const res = await axiosInstance.put(`/nemsas-claims/${id}`, payload);
  return res.data;
};