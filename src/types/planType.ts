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
