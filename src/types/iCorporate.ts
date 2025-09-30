export interface CorporateEntity {
  id: string;
  enrolleeIdNumber: string | null;
  hmoId: string;
  isActive: boolean;
  createdDate: string;
  enrolleeClass: {
    id: string;
    isActive: boolean;
    createdDate: string;
    name: string;
    description: string;
  };
  corporateType: string;
  corporateCatgory: string; 
  companyName: string;
  email: string;
  phoneNumber: string;
  officeAddress: string;
  enrolleeClassId: string;
}

export interface CorporateApiResponse {
  data: CorporateEntity[]; 
}


export interface CorporateState {
  corporates: CorporateEntity[]; 

}