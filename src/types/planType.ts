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