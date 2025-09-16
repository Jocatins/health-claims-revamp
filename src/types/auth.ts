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
  // Some backends put token at root, others nest inside data
  data: AuthUser & { token?: string; accessToken?: string };
  token?: string; // optional root token
  accessToken?: string; // alternative naming
  message: string;
  isSuccess: boolean;
}
