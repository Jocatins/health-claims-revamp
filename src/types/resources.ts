export interface IGender {
  data: string[];
  message: string;
  isSuccess: boolean;
}

export interface GenderState {
  data: string[];
  loading: boolean;
  error: string | null;
  message: string;
  isSuccess: boolean;
}

export interface IMaritalStatuses {
  data: string[];
  message: string;
  isSuccess: boolean;
}

export interface MaritalStatusState {
  data: string[];
  loading: boolean;
  error: string | null;
  message: string;
  isSuccess: boolean;
}

export interface IRelationship {
  data: string[];
  message: string;
  isSuccess: boolean;
}

export interface RelationshipState {
  data: string[];
  loading: boolean;
  error: string | null;
  message: string;
  isSuccess: boolean;
}
export interface IEnrolleeType {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  createdDate: string;
}

export interface IEnrolleeTypeResponse {
  data: IEnrolleeType[];
  message: string;
  isSuccess: boolean;
}

export interface EnrolleeTypeState {
  data: IEnrolleeType[];
  loading: boolean;
  error: string | null;
  message: string;
  isSuccess: boolean;
}
export interface IEnrolleeClass {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  createdDate: string;
}

export interface IEnrolleeClassResponse {
  data: IEnrolleeClass[];
  message: string;
  isSuccess: boolean;
}
export interface EnrolleeClassState {
  data: IEnrolleeClass[];
  loading: boolean;
  error: string | null;
  message: string;
  isSuccess: boolean;
}
export interface IPlanType {
  id: string;
  name: string;
  description: string;
  hmoId: string;
  isActive: boolean;
  createdDate: string;
}

export interface IPlanTypeResponse {
  data: IPlanType[];
  message: string;
  isSuccess: boolean;
}

export interface PlanTypeState {
  data: IPlanType[];
  loading: boolean;
  error: string | null;
  message: string;
  isSuccess: boolean;
}
