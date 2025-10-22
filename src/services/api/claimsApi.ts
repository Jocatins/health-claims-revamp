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
import axiosInstance from '../../config/axiosInstance';

// Claim detail type based on provided schema
export interface ClaimAttachment {
  id: string; hmoId: string; filePath: string; fileName: string; contentType: string;
  createdBy: string; modifiedBy?: string; createdDate: string; modifiedDate?: string;
  isActive: boolean; entityId: string; entityType: string; propertyType: string;
}

export interface ClaimDetailData {
  id: string; isActive: boolean; serviceRendered: string; enrolleeName: string; patientEnrolleeNumber: string;
  providerId: string; hmoId: string; enrolleeEmail: string; enrolleePhoneNumber: string; claimType: string;
  quantity: number; price: number; discount: number; amount: number; diagnosis: string; approvalCode: string;
  referralHospital: string; nhisno: string; serviceDate: string; attachments: ClaimAttachment[]; createdDate: string;
  claimStatus: string; planTypeName: string; planTypeId: string; providerName: string;
}

export interface ClaimDetailResponse { data: ClaimDetailData; message: string; isSuccess: boolean; }

// Fetch all claims with query params
export const fetchClaims = async (params: {
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
  // const merged = { PageNumber: 1, PageSize: 100, ...params};
  const merged = {  ...params};
  const res = await axiosInstance.get(`/claims/all-claims`, { params: merged});
  return res.data; // expect backend returns { data: Claim[] } or array
};

// Fetch claim details (assuming endpoint, update if needed)
export const fetchClaimDetails = async (id: string) => {
  const res = await axiosInstance.get(`/claims/${id}`);
  return res.data;
};

// New endpoint using query param id /claims?id=
export const getClaimById = async (id: string) => {
  const res = await axiosInstance.get<ClaimDetailResponse>(`/claims`, { params: { id } });
  return res.data;
};

// Assumed endpoint: list claims for an enrollee using enrolleeId query param (adjust if backend differs)
export interface ClaimListResponse { data: ClaimDetailData[]; message: string; isSuccess: boolean; }
export const getClaimsByEnrollee = async (enrolleeId: string) => {
  const res = await axiosInstance.get<ClaimListResponse>('/claims', { params: { enrolleeId } });
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

// New strongly typed create-claims payload based on provided schema
export interface CreateClaimItem {
  serviceRendered: string;
  enrolleeName: string;
  patientEnrolleeNumber: string; // enrolleeIdNumber
  providerId: string;
  hmoId: string;
  enrolleeEmail: string;
  enrolleePhoneNumber: string;
  claimType: string; // e.g. InpatientCare
  quantity: number;
  price: number;
  discount: number;
  amount: number;
  diagnosis: string;
  approvalCode: string;
  referralHospital: string;
  nhisno: string;
  serviceDate: string; // ISO date
  attachments: string[]; // file paths or base64 ids
}

export interface CreateClaimsPayload {
  claimItems: CreateClaimItem[];
  hmoId: string;
  claimDate: string; // ISO
  claimName: string;
  providerId: string;
}

export const createClaims = async (payload: CreateClaimsPayload) => {
  const res = await axiosInstance.post('/claims/create-claims', payload);
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
