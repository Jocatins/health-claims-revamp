export interface ClaimResponse {
  data: Claim[];
  message: string;
  isSuccess: boolean;
}

export interface Claim {
  id: string;
  isActive: boolean;
  serviceRendered: string;
  enrolleeName: string;
  patientEnrolleeNumber: string;
  providerId: string;
  hmoId: string;
  enrolleeEmail: string;
  enrolleePhoneNumber: string;
  claimType: string; 
  quantity: number;
  price: number;
  discount: number;
  amount: number;
  diagnosis: string;
  approvalCode: string;
  referralHospital: string;
  nhisno: string;
  serviceDate: string;
  attachments: Attachment[];
  createdDate: string;
  claimStatus: number; 
  planTypeName: string;
  planTypeId: string;
  providerName: string;
}

export interface Attachment {
  id: string;
  hmoId: string;
  filePath: string;
  fileName: string;
  contentType: string;
  createdBy: string;
  modifiedBy: string;
  createdDate: string;
  modifiedDate: string;
  isActive: boolean;
  entityId: string;
  entityType: string; 
  propertyType: string; 
}

export interface ClaimsState {
  claims: Claim[];
  loading: boolean;
  error: string | null;
  success: boolean;
}

// Claim Item

export interface ClaimItem {
  id: string;
  isActive: boolean;
  serviceRendered: string;
  enrolleeName: string;
  patientEnrolleeNumber: string;
  providerId: string;
  hmoId: string;
  enrolleeEmail: string;
  enrolleePhoneNumber: string;
  claimType: string;
  quantity: number;
  price: number;
  discount: number;
  amount: number;
  diagnosis: string;
  approvalCode: string;
  referralHospital: string;
  nhisno: string;
  serviceDate: string;
  attachments: string | null;
  createdDate: string;
  claimStatus: number;
  planTypeName: string | null;
  planTypeId: string;
  providerName: string | null;
}

export interface ClaimDetailsResponse {
  data: ClaimItem[];
  message: string;
  isSuccess: boolean;
}

export interface ClaimDetailsState {
  claimItems: ClaimItem[];
  loading: boolean;
  error: string | null;
}