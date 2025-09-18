
export interface Country {
  id: string;
  isActive: boolean;
  alpha2: string;
  name: string;
  createdDate: string;
}

export interface State {
  id: string;
  isActive: boolean;
  countryId: string;
  name: string;
  createdDate: string;
}

export interface ApiResponse<T> {
  data: T;
  message: string;
  isSuccess: boolean;
}