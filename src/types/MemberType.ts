export interface MemberTypesResponse {
  data: MemberTypeItem[];
  message: string;
  isSuccess: boolean;
}

export interface MemberTypeItem {
  planTypeId: string;
  memberTypeId: string;
  amount: number;
  discount: number;
  referralNumber: string;
  benefits: string;
  billingFrequency: string;
  id: string;
  isActive: boolean;
  planType: PlanType;
  memberType: MemberType;
  createdDate: string; 
}

export interface PlanType {
  name: string;
  description: string;
}

export interface MemberType {
  id:string,
  name: string;
  description: string;
}
