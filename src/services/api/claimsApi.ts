export const exportClaimsReport = async (params: {
  ProviderId?: string;
  StartDate?: string;
  EndDate?: string;
  HmoId?: string;
  ClaimStatus?: string;
  IsExcel?: boolean;
}) => {
  const res = await axiosInstance.get(`/reports/claim-reports`, {
    params,
    responseType: 'blob',
  });
  return res.data;
};
import axiosInstance from './axiosInstance';

// Fetch all claims with query params
export const fetchClaims = async (params: {
  ProviderId?: string;
  StartDate?: string;
  EndDate?: string;
  HmoId?: string;
  claimStatus?: string;
  IsExcel?: boolean;
}) => {
  const res = await axiosInstance.get(`/claims/all-claims`, { params });
  return res.data;
};

// Fetch claim details (assuming endpoint, update if needed)
export const fetchClaimDetails = async (id: string) => {
  const res = await axiosInstance.get(`/claims/${id}`);
  return res.data;
};

// Define the type for claim items
type ClaimItem = {
  itemId: string;
  description: string;
  amount: number;
  // Add other relevant fields as needed
};

// Submit single claim
export const submitClaim = async (data: {
  claimItems: ClaimItem[];
  hmoId: string;
  claimDate: string;
  claimName: string;
  providerId: string;
}) => {
  const res = await axiosInstance.post(`/claims/create-claims`, data);
  return res.data;
};

// Batch upload claims
export const batchUploadClaims = async (formData: FormData, params: {
  HMOId: string;
  ClaimDate: string;
  ClaimName: string;
  ProviderId: string;
}) => {
  const res = await axiosInstance.post(`/claims/upload-claims`, formData, { params });
  return res.data;
};
