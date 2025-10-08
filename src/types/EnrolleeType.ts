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

export  interface EnrolleeTypeState {
  data: IEnrolleeType[];
  loading: boolean;
  error: string | null;
  message: string;
  isSuccess: boolean;
}