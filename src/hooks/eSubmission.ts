// hooks/useEnrolleeSubmission.ts
import { useState } from 'react';
import { type UseFormReset } from 'react-hook-form';
import { EService } from '../services/eService';
import type { EnrolleeFormData, EnrolleeResponse } from '../types/Enrollee1';
// import { EService } from '../services/enrolleeService';
// import { EnrolleeFormData, EnrolleeResponse } from '../types/enrollee';

export const useESubmission = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<EnrolleeResponse | null>(null);

  const submitEnrollee = async (
    formData: EnrolleeFormData,
    reset?: UseFormReset<EnrolleeFormData>
  ): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await EService.createEnrollee(formData);
      setData(response);
      
      // Reset form on successful submission if reset function provided
      if (reset) {
        reset();
      }
      
      return true;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to create enrollee';
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    submitEnrollee,
    isLoading,
    error,
    data,
    resetError: () => setError(null),
    resetData: () => setData(null),
  };
};