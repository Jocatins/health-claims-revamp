
export interface CorporateFormData {
  corporateType: string;
  corporateCatgory: string;
  companyName: string;
  email: string;
  phoneNumber: string;
  officeAddress: string;
  enrolleeClassId: string;
}

export interface CorporateFormResponse {
    id: string;
    data: CorporateFormData[];
    message: string;
    isSuccess: boolean;
}