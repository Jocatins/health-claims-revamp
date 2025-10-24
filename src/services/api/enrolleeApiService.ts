// import { aInstance } from '../../config/a-Instance';
// import type { ApiResponse, EnrolleeModel, NextOfKinCreate } from '../../types/enrolleeForm';
// import type { EnrollmentFormData } from '../../types/iEnrollmentForm';
// import { transformFormDataToEnrollmentRequest } from '../../utils/enrollmentTransformer';

// import { formatApiError } from '../../utils/errorFormatter';

// export class EnrolleeApiService {
//   private static instance: EnrolleeApiService;

//   public static getInstance(): EnrolleeApiService {
//     if (!EnrolleeApiService.instance) {
//       EnrolleeApiService.instance = new EnrolleeApiService();
//     }
//     return EnrolleeApiService.instance;
//   }


//   private async _addEnrollee(data: EnrollmentFormData): Promise<ApiResponse<EnrolleeModel>> {

//     const formData = transformFormDataToEnrollmentRequest(data);


//     console.log(' FormData entries:');
//     for (const [key, value] of formData.entries()) {
//       console.log(`${key}:`, value);
//     }
//     const response = await aInstance.post<ApiResponse<EnrolleeModel>>(
//       '/enrollees',
//       formData,
//       {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//       }
//     );
//     return response.data;
//   }
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   private async _addEnrolleeNextOfKin(enrolleeId: string, data: NextOfKinCreate): Promise<ApiResponse<any>> {
//     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//     const response = await aInstance.post<ApiResponse<any>>(
//       `enrollees/${enrolleeId}/next-of-kin`,
//       data
//     );
//     return response.data;
//   }

//   public async addEnrollee(data: EnrollmentFormData): Promise<ApiResponse<EnrolleeModel>> {
//     try {
//       const response = await this._addEnrollee(data);

//       if (response.isSuccess) {
//         console.log('Enrollment created successfully:', response.data);
//         return response;
//       } else {
//         throw new Error(response.message || 'Failed to create enrollment');
//       }
//       // eslint-disable-next-line @typescript-eslint/no-explicit-any
//     } catch (error: any) {
//       console.error('Error creating enrollment:', error);
//       const errorMessage = formatApiError(error);
//       throw new Error(errorMessage);
//     }
//   }


//   public async addEnrolleeNextOfKin(
//     enrolleeId: string,
//     fullName: string,
//     relationship: string,
//     phoneNumber: string,
//     homeAddress: string
//     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   ): Promise<ApiResponse<any>> {
//     try {
//       const data: NextOfKinCreate = {
//         enrolleeId,
//         fullName,
//         relationship,
//         phoneNumber,
//         homeAddress
//       };

//       const response = await this._addEnrolleeNextOfKin(enrolleeId, data);

//       if (response.isSuccess) {
//         console.log('✅ Next of kin added successfully');
//         return response;
//       } else {
//         throw new Error(response.message || 'Failed to add next of kin');
//       }
//       // eslint-disable-next-line @typescript-eslint/no-explicit-any
//     } catch (error: any) {
//       console.error('Error adding next of kin:', error);
//       const errorMessage = formatApiError(error);
//       throw new Error(errorMessage);
//     }
//   }
// }

// export const enrolleeApiService = EnrolleeApiService.getInstance();