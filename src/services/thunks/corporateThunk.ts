import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../config/axiosInstance";
import type { CorporateEntity, CorporateApiResponse } from "../../types/iCorporate";


export const createCorporate = createAsyncThunk(
  "corporate/createCorporate",
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async (corporateData: any): Promise<CorporateEntity> => { 
    const response = await axiosInstance.post<CorporateEntity>("/corporates", corporateData, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  }
);


export const fetchCorporateEntities = createAsyncThunk(
  "corporate/fetchCorporate",
  async (): Promise<CorporateEntity[]> => {
    const response = await axiosInstance.get<CorporateApiResponse>("/corporates");
    return response.data.data; 
  }
);
