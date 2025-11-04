
export interface ReferralLetter {
  id: string;
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

export interface Attachment {
  id: string;
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

export interface Authorization {
  id: string;
  isActive: boolean;
  authorizationNumber: string;
  authorizationStatus: 'Pending' | string;
  enrolleeName: string;
  enrolleeIdNumber: string;
  requestDate: string;
  diagnosis: string;
  requestSource: string;
  referralLetter: ReferralLetter;
  providerId: string;
  hmoId: string;
  requestStatus: 'Routine' | string;
  attachments: Attachment[];
  createdDate: string;
}

export interface AuthorizationResponse {
  data: Authorization[];
  message: string;
  isSuccess: boolean;
}

export interface AuthorizationParams {
  providerId: string;
  hmoId: string;
  startDate?: string;
  endDate?: string;
  enrolleeNumber?: string;
  authorizationNumber?: string;
}