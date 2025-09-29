import type { AxiosResponse } from "axios";
import type { CorporateFormData, CorporateFormResponse } from "../types/iCorporate";
import axiosInstance from "../config/axiosInstance";


export const corporateService = {
  createCorporate: async (data: CorporateFormData): Promise<AxiosResponse<CorporateFormResponse>> => {
    return await axiosInstance.post<CorporateFormResponse>('/corporates', data);
  },
};