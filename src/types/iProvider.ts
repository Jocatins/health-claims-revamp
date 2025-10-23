export interface Contact {
  name: string;
  designation: string;
  email: string;
  phoneNumber: string;
}

export interface ProviderEntity {
  id: string;
  hmoId: string;
  isActive: boolean;
  createdDate: string;
  hospitalName: string;
  email: string;
  hospitalAdress: string;
  phoneNumber: string;
  bankName: string;
  accountNumber: string;
  bankCode: string;
  accountName: string;
  accountType: string;
  bankVeririfationNumber: string;
  stateLicenseNumber: string;
  licenseExpiryDate: string;
  geoLocation: string;
  contacts: Contact[];
}

export interface ProviderApiResponse {
  data: ProviderEntity[];
  message?: string;
  status?: string;
}

export interface CreateProviderRequest {
  hmoId: string;
  hospitalName: string;
  email: string;
  hospitalAdress: string;
  phoneNumber: string;
  bankName: string;
  accountNumber: string;
  bankCode: string;
  accountName: string;
  accountType: string;
  bankVeririfationNumber: string;
  stateLicenseNumber: string;
  licenseExpiryDate: string;
  geoLocation: string;
  contacts: Omit<Contact, 'id'>[];
}

export interface ProviderState {
  providers: ProviderEntity[];
  loading: boolean;
  error: string | null;
  creating: boolean;
  createError: string | null;
}