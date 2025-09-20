export interface EnrolleeClass {
  name: string;
  description: string;
  id: string;
  isActive: boolean;
  createdDate: string; 
}

export interface ICorporateEnrollee {
  corporateType: string;
  corporateCatgory: string;
  companyName: string;
  email: string;
  phoneNumber: string;
  officeAddress: string;
  enrolleeClassId: string;
  id: string;
  enrolleeIdNumber: string;
  hmoId: string;
  isActive: boolean;
  createdDate: string; 
  enrolleeClass: EnrolleeClass;
}

export interface ICorporateEnrolleeResponse {
  data: ICorporateEnrollee[];
  message: string;
  isSuccess: boolean;
}
