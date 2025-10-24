// import { useState } from 'react';
// import type { EnrollmentFormData } from '../types/iEnrollmentForm';
// import { submitEnrollment, type EnrollmentResponse } from '../services/api/iEnrollmentApi';


// interface UseEnrollmentSubmission {
//   submitEnrollment: (data: EnrollmentFormData) => Promise<EnrollmentResponse>;
//   isLoading: boolean;
//   error: string | null;
//   isSuccess: boolean;
//   reset: () => void;
// }

// export const useEnrollmentSubmission = (): UseEnrollmentSubmission => {
//   const [isLoading, setIsLoading] = useState<boolean>(false);
//   const [error, setError] = useState<string | null>(null);
//   const [isSuccess, setIsSuccess] = useState<boolean>(false);

//   const handleSubmit = async (data: EnrollmentFormData): Promise<EnrollmentResponse> => {
//     setIsLoading(true);
//     setError(null);
//     setIsSuccess(false);

//     try {
//       const response = await submitEnrollment(data);
//       setIsSuccess(true);
//       return response;
//     } catch (err) {
//       const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
//       setError(errorMessage);
//       throw err; // Re-throw to let the form handle it
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const reset = () => {
//     setError(null);
//     setIsSuccess(false);
//     setIsLoading(false);
//   };

//   return {
//     submitEnrollment: handleSubmit,
//     isLoading,
//     error,
//     isSuccess,
//     reset,
//   };
// };