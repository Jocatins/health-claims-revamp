export interface LoginResponse {
  data: {
    id: string;
    fullName: string;
    emailAddress: string;
    token: string;
    role: string;
    hmoId: string;
    isProvider: boolean;
    providerId: string;
  };
  message: string;
  isSuccess: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthUser {
  id: string;
  fullName: string;
  emailAddress: string;
  token: string;
  role: string;
  hmoId: string;
  isProvider: boolean;
  providerId: string;
}
