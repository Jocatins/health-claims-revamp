export interface NextOfKin {
  fullName: string;
  relationship: string;
  phoneNumber: string;
  homeAddress: string;
  id?: string;
  isActive?: boolean;
  hmoId?: string;
  enrolleeId?: string;
  createdDate?: string;
}

export interface Dependent {
  enrolleeId: string;
  firstName: string;
  lastName: string;
  gender: string;
  dateOfBirth: string;
  id: string;
  photoName?: string;
  isActive: boolean;
  createdDate: string;
}

export interface EnrolleeClass { id: string; name: string; description: string; isActive: boolean; createdDate: string; }
export interface EnrolleeType { id: string; name: string; description: string; isActive: boolean; createdDate: string; }
export interface PlanType { id: string; name: string; description: string; hmoId: string; isActive: boolean; createdDate: string; }

export interface Enrollee {
  id: string;
  firstName: string;
  lastName: string;
  otherName: string;
  phoneNumber: string;
  emailAddress: string;
  enrolleeTypeId: string;
  enrolleeClassId: string;
  dateOfBirth: string;
  fullAddress: string;
  stateOfResidence: string;
  gender: string;
  occupation: string;
  maritalStatus: string;
  ethnicity: string;
  nationality: string;
  corporateId: string;
  planTypeId: string;
  hmoId: string;
  photoName: string;
  enrolleeIdNumber: string;
  createdDate: string;
  isActive: boolean;
  nextOfKin?: NextOfKin;
  dependents: Dependent[];
  enrolleeClass?: EnrolleeClass;
  enrolleeType?: EnrolleeType;
  planType?: PlanType;
}

export interface EnrolleeListResponse { data: Enrollee[]; message: string; isSuccess: boolean; }
export interface EnrolleeDetailResponse { data: Enrollee; message: string; isSuccess: boolean; }

export interface AuthorizationRequestPayload {
  EnrolleeName: string;
  EnrolleeIdNumber: string;
  RequestDate: string; // ISO string
  Diagnosis: string;
  RequestSource: string;
  ReferralLetter?: File | null;
  ProviderId: string;
  HMOid: string; // Note: using provided casing
  RequestStatus: 'Routine' | 'Urgent' | 'Emergency';
  Attachments?: File[];
}

export interface AuthorizationFileMeta {
  id: string;
  filePath: string;
  fileName: string;
  contentType: string;
  createdBy: string;
  modifiedBy?: string;
  createdDate: string;
  modifiedDate?: string;
  isActive: boolean;
  entityId: string;
  entityType: string;
  propertyType: string;
}

export interface AuthorizationData {
  id: string;
  isActive: boolean;
  authorizationNumber: string;
  authorizationStatus: string; // Pending etc.
  enrolleeName: string;
  enrolleeIdNumber: string;
  requestDate: string;
  diagnosis: string;
  requestSource: string;
  referralLetter?: AuthorizationFileMeta;
  providerId: string;
  hmoId: string;
  requestStatus: 'Routine' | 'Urgent' | 'Emergency';
  attachments: AuthorizationFileMeta[];
  createdDate: string;
}

export interface AuthorizationResponse {
  data: AuthorizationData;
  message: string;
  isSuccess: boolean;
}
