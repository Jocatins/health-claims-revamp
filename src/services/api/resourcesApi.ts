import type { IGender } from "../../types/resources";
import { formatApiError } from "../../utils/errorFormatter";
import axiosInstance from "./axiosInstance";

const RESOURCES_BASE = "/resources";

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
    const response = await axiosInstance.get<IGender>(`${RESOURCES_BASE}/marital-statuses`);
    return response.data.data;
  } catch (error: unknown) {
    const message = formatApiError(error);
    console.error("Error fetching marital statuses:", message);
    throw new Error(message);
  }
};