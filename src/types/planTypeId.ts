interface PlanTypeId {
  name: string;
  description: string;
}

interface MemberType {
  name: string;
  description: string;
}

export interface PlanTypeData {
  planTypeId: string;
  memberTypeId: string;
  amount: number;
  discount: number;
  referralNumber: string;
  benefits: string;
  billingFrequency: string;
  id: string;
  isActive: boolean;
  planType: PlanTypeId;
  memberType: MemberType;
  createdDate: string;
}

export interface PlanTypeResponse {
  data: PlanTypeData;
  message: string;
  isSuccess: boolean;
}