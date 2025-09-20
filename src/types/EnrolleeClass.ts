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
