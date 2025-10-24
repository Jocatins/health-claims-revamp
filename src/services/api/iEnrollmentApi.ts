// import axiosInstance from "../../config/axiosInstance";
// import type { EnrollmentFormData } from "../../types/iEnrollmentForm";
// import { formatApiError } from "../../utils/errorFormatter";


// export interface EnrollmentResponse {
//    data: {
//     id: string;
//     enrolleeIdNumber: string;
//     firstName: string;
//     lastName: string;
//     otherName: string;
//     phoneNumber: string;
//     emailAddress: "user@example.com",
//     enrolleeTypeId: "3fa85f64-5717-4562-b3fc-2c963f66afa6"
  
//     enrolleeClassId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
//     dateOfBirth: "2025-09-22T13:57:04.577Z",
//     fullAddress: string,
//     stateOfResidence: string,
//     gender: string,
//     occupation: string,
//     maritalStatus: string,
//     ethnicity: string,
//     nationality: string,

//    };
//     message: string;
//   isSuccess: boolean;
// }

// export interface EnrollmentRequest {
//      firstName: string;
//         otherName?: string;
//         lastName: string;
//         gender: string;
//         occupation?: string;
//         maritalStatus?: string;
//         emailAddress: string;
//         dateOfBirth: string;
//         phoneNumber: string;
//         fullAddress: string;
//         nationality: string;
//         stateOfResidence: string;
//         ethnicity?: string;
//         enrolleeTypeId: string;
//         enrolleeClass?: string;
//         corporateId?: string;
//         planTypeId: string;
//         profilePhoto?: string;
  
//     nextOfKin: {
//         fullName: string;
//         relationship: string;
//         phoneNumber: string;
//         homeAddress: string;
//     };
//     planDetails: {
//         MembershipTypeId: string;
//         BillingFrequency: string;
//         Amount: number;
//         Discount?: number;
//         Benefits?: string;
//         ReferralNumber?: string;
//     };
// }

// // Transform form data to API request format
// const transformFormDataToRequest = (data: EnrollmentFormData): EnrollmentRequest => {
//     // Safe date handling
//     let dateOfBirthISO: string = '';


//     if (data.enrollee.basicInfo.dateOfBirth) {
//         try {
//             const date = new Date(data.enrollee.basicInfo.dateOfBirth);
//             if (!isNaN(date.getTime())) {
//                 dateOfBirthISO = date.toISOString();
//             }
//         } catch (error) {
//             console.error('Error parsing date:', error);
//         }
//     }

//     //  mapping functions for IDs - 
//     const mapEnrolleeTypeToId = (type: string): string => {
//         const mapping: Record<string, string> = {
//             'Individual': '1',
//             'Corporate': '2',

//         };
//         return mapping[type] || type;
//     };

//     const mapPlanTypeToId = (type: string): string => {
//         const mapping: Record<string, string> = {
//             'Premium': '1',
//             'Standard': '2',

//         };
//         return mapping[type] || type;
//     };

//     return {
       
//             firstName: data.enrollee.basicInfo.firstName || '',
//             otherName: data.enrollee.basicInfo.otherName || '',
//             lastName: data.enrollee.basicInfo.lastName || '',
//             gender: data.enrollee.basicInfo.gender || '',
//             occupation: data.enrollee.basicInfo.occupation || '',
//             maritalStatus: data.enrollee.basicInfo.maritalStatus || '',
//             emailAddress: data.enrollee.basicInfo.email || '',
//             dateOfBirth: dateOfBirthISO,
//             phoneNumber: data.enrollee.basicInfo.phoneNumber || '',
//             fullAddress: data.enrollee.basicInfo.fullAddress || '',
//             nationality: data.enrollee.basicInfo.country || '',
//             stateOfResidence: data.enrollee.basicInfo.state || '',
//             ethnicity: data.enrollee.basicInfo.ethnicity || '',
//             enrolleeTypeId: mapEnrolleeTypeToId(data.enrollee.basicInfo.enrolleeType || ''),
//             enrolleeClass: data.enrollee.basicInfo.enrolleeClass || '',
//             corporateId: data.enrollee.basicInfo.beneficiary || '',
//             planTypeId: mapPlanTypeToId(data.enrollee.basicInfo.planType || ''),
//             profilePhoto: data.enrollee.basicInfo.profilePhoto?.[0]?.name || '',
      
//         nextOfKin: {
//             fullName: data.enrollee.nextOfKin.fullName || '',
//             relationship: data.enrollee.nextOfKin.relationship || '',
//             phoneNumber: data.enrollee.nextOfKin.phoneNumber || '',
//             homeAddress: data.enrollee.nextOfKin.homeAddress || '',
//         },
//         planDetails: {
//             MembershipTypeId: data.plan.membershipType || '',
//             BillingFrequency: data.plan.billingFrequency || '',
//             Amount: data.plan.amount || 0,
//             Discount: data.plan.discount || 0,
//             Benefits: data.plan.benefits || '',
//             ReferralNumber: data.plan.referralNumber || '',
//         },
//     };
// };

// export const submitEnrollment = async (formData: EnrollmentFormData): Promise<EnrollmentResponse> => {
//     try {
//         const requestData = transformFormDataToRequest(formData);

//         console.log('Submitting enrollment data:', JSON.stringify(requestData, null, 2));

//         const response = await axiosInstance.post<EnrollmentResponse>(
//             '/enrollees',
//             requestData,
//             {
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//             }
//         );

//         if (response.data.isSuccess) {
//             return response.data;
//         } else {
//             throw new Error(response.data.message || 'Failed to submit enrollment');
//         }
//         // eslint-disable-next-line @typescript-eslint/no-explicit-any
//     } catch (error: any) {
//         // Enhanced error logging
//         if (error.response) {
//             console.error('API Error Response:', error.response.data);
//             console.error('API Error Status:', error.response.status);
//             console.error('API Error Headers:', error.response.headers);

//             // If it's a validation error, log the specific field errors
//             if (error.response.data && typeof error.response.data === 'object') {
//                 console.error('Field-specific errors:');
//                 Object.entries(error.response.data).forEach(([field, errors]) => {
//                     console.error(`- ${field}:`, errors);
//                 });
//             }
//         } else if (error.request) {
//             console.error('No response received:', error.request);
//         } else {
//             console.error('Error setting up request:', error.message);
//         }

//         const message = formatApiError(error);
//         console.error('Error submitting enrollment:', message);
//         throw new Error(message);
//     }
// };