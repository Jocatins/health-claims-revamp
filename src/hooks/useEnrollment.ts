// hooks/useEnrollment.ts
import { useState, useCallback } from 'react'; 
import type { EnrolleeFormData, ApiResponse, EnrolleeModel } from '../types/enrollment';
import { enrolleeService } from '../services/enrolleeService';


interface UseEnrollmentReturn {
  enroll: (data: EnrolleeFormData) => Promise<ApiResponse<EnrolleeModel>>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  addNextOfKin: (enrolleeId: string, data: EnrolleeFormData['nextOfKinCreate']) => Promise<ApiResponse<any>>;
  isLoading: boolean;
  error: string | null;
  isSuccess: boolean;
  reset: () => void;
}

export const useEnrollment = (): UseEnrollmentReturn => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const enroll = useCallback(async (data: EnrolleeFormData): Promise<ApiResponse<EnrolleeModel>> => {
    setIsLoading(true);
    setError(null);
    setIsSuccess(false);

    try {
      const formData = enrolleeService.createEnrolleeFormData(data);
      const response = await enrolleeService.createEnrollee(formData);
      setIsSuccess(true);
      return response.data; // Return the actual ApiResponse<EnrolleeModel>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'An unexpected error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addNextOfKin = useCallback(async (
    enrolleeId: string,
    data: EnrolleeFormData['nextOfKinCreate']
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): Promise<ApiResponse<any>> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await enrolleeApiService.addEnrolleeNextOfKin(enrolleeId, data);
      return response.data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'An unexpected error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setError(null);
    setIsSuccess(false);
    setIsLoading(false);
  }, []);

  return {
    enroll,
    addNextOfKin,
    isLoading,
    error,
    isSuccess,
    reset,
  };
};