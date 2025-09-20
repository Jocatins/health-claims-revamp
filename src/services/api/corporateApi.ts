import axiosInstance from '../../config/axiosInstance';
import type { ICorporateEnrollee, ICorporateEnrolleeResponse } from '../../types/Corporate';
import { formatApiError } from '../../utils/errorFormatter';

export const fetchCorporates = async (): Promise<ICorporateEnrollee[]> => {
  try {
    const response = await axiosInstance.get<ICorporateEnrolleeResponse>("/corporates");
    return response.data.data;
  } catch (error: unknown) {
    const message = formatApiError(error);
    console.error("Error fetching corporates:", message);
    throw new Error(message);
  }
};
