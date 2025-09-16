export interface Tariff {
  service: string;
  descriptions: string;
  code: string;
  price: number;
  providerId: string;
  id: string;
  isActive: boolean;
  createdDate: string; // ISO date
}

export interface TariffListResponse {
  data: Tariff[];
  message: string;
  isSuccess: boolean;
}

export interface TariffQueryArgs {
  providerId: string;
  hmoId: string;
  pageNumber?: number;
  pageSize?: number;
  sortedBy?: string;
  sortDirection?: 'Asc' | 'Des';
}
