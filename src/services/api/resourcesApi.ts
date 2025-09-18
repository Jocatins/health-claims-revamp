import type { ApiResponse, Country, State } from "../../types/Country";
import type { IGender, IMaritalStatuses, IRelationship } from "../../types/resources";
import { formatApiError } from "../../utils/errorFormatter";
import axiosInstance from "./axiosInstance";

const RESOURCES_BASE = "/resources";
const SETTINGS_BASE = "/settings";

export const fetchGenders = async (): Promise<string[]> => {
  try {
    const response = await axiosInstance.get<IGender>(`${RESOURCES_BASE}/genders`);
    return response.data.data;
  } catch (error: unknown) {
    const message = formatApiError(error);
    console.error("Error fetching genders:", message);
    throw new Error(message);
  }
};

export const fetchMaritalStatus = async (): Promise<string[]> => {
  try {
    const response = await axiosInstance.get<IMaritalStatuses>(`${RESOURCES_BASE}/marital-statuses`);
    return response.data.data;
  } catch (error: unknown) {
    const message = formatApiError(error);
    console.error("Error fetching marital statuses:", message);
    throw new Error(message);
  }
};

export const fetchRelationships = async (): Promise<string[]> => {
  try {
    const response = await axiosInstance.get<IRelationship>(`${RESOURCES_BASE}/relationships`);
    return response.data.data;
  } catch (error: unknown) {
    const message = formatApiError(error);
    console.error("Error Relationships:", message);
    throw new Error(message);
  }
};

export const fetchCountries = async (): Promise<Country[]> => {
  try {
    const response = await axiosInstance.get<ApiResponse<Country[]>>(
      `${RESOURCES_BASE}/countries`
    );

    if (response.data.isSuccess) {
      // console.log(response.data)
      return response.data.data;
    } else {
      throw new Error(response.data.message);
    }
  } catch (error: unknown) {
    const message = formatApiError(error);
    console.error("Error fetching countries:", message);
    throw new Error(message);
  }
};

export const fetchStatesByCountry = async (countryCode: string): Promise<State[]> => {
  try {
    const response = await axiosInstance.get<ApiResponse<State[]>>(
      `${RESOURCES_BASE}/states/country?countryCode=${countryCode}`
    );

    if (response.data.isSuccess) {
      return response.data.data;
    } else {
      throw new Error(response.data.message);
    }
  } catch (error: unknown) {
       const message = formatApiError(error);
    console.error("Error fetching countries:", message);
    throw new Error(message);
  }
};



export const fetchPlanTypes = async (): Promise<string[]> => {
  try {
    const response = await axiosInstance.get<IRelationship>(`${SETTINGS_BASE}/plan-types`);
    return response.data.data;
  } catch (error: unknown) {
    const message = formatApiError(error);
    console.error("Error Plan-types", message);
    throw new Error(message);
  }
};