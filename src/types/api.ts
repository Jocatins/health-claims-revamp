export interface LoginCredentials {
  email: string;
  password: string;
}
export interface AuthUser {
  id: string;
  fullName: string;
  emailAddress: string;
  // token: string;
  role: string;
  hmoId: string;
  isProvider: boolean;
  providerId: string;
}

export interface LoginResponse {
  data: AuthUser;
    token: string;
  message: string;
  isSuccess: boolean;
}
