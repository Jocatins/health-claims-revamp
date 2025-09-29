
import { type AxiosResponse } from 'axios';
import axiosInstance from '../config/axiosInstance';
import type { ApiResponse, EnrolleeFormData, EnrolleeModel } from '../types/enrollment';

export const enrolleeApiService = {
  // CREATE enrollee - expects FormData as input, returns EnrolleeModel as response
  createEnrollee: async (formData: FormData): Promise<AxiosResponse<ApiResponse<EnrolleeModel>>> => {
    return await axiosInstance.post<ApiResponse<EnrolleeModel>>('/enrollees', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Add next of kin separately
  addEnrolleeNextOfKin: async (
    enrolleeId: string,
    data: {
      fullName: string;
      relationship: string;
      phoneNumber: string;
      homeAddress: string;
    }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): Promise<AxiosResponse<ApiResponse<any>>> => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return await axiosInstance.post<ApiResponse<any>>(
      `/enrollees/${enrolleeId}/next-of-kin`, 
      data
    );
  },

  // Helper function to convert EnrolleeFormData to FormData
  createEnrolleeFormData: (data: EnrolleeFormData): FormData => {
    const formData = new FormData();
    
    // Append all basic fields
    formData.append('firstName', data.firstName);
    formData.append('lastName', data.lastName);
    if (data.otherName) formData.append('otherName', data.otherName);
    formData.append('phoneNumber', data.phoneNumber);
    formData.append('emailAddress', data.emailAddress);
    formData.append('enrolleeTypeId', data.enrolleeTypeId);
    if (data.enrolleeClassId) formData.append('enrolleeClassId', data.enrolleeClassId);
    formData.append('dateOfBirth', data.dateOfBirth);
    formData.append('fullAddress', data.fullAddress);
    formData.append('stateOfResidence', data.stateOfResidence);
    formData.append('gender', data.gender);
    formData.append('occupation', data.occupation);
    formData.append('maritalStatus', data.maritalStatus);
    if (data.ethnicity) formData.append('ethnicity', data.ethnicity);
    formData.append('nationality', data.nationality);
    if (data.corporateId) formData.append('corporateId', data.corporateId);
    formData.append('planTypeId', data.planTypeId);
    
    // Append next of kin as JSON string
    formData.append('nextOfKinCreate', JSON.stringify(data.nextOfKinCreate));
    
    // Append dependents if they exist
    if (data.dependents && data.dependents.length > 0) {
      formData.append('dependents', JSON.stringify(data.dependents));
    }
    
    // Append photo file if exists
    if (data.photo) {
      formData.append('photo', data.photo);
    }
    
    return formData;
  }
};