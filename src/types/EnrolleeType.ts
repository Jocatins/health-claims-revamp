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
