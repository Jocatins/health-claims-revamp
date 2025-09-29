import { type AxiosResponse } from 'axios';
import type { EnrolleeFormData, EnrolleeResponse } from '../types/Enrollee1';
import axiosInstance from '../config/axiosInstance';


export const enrolleeService = {
  createEnrollee: async (formData: FormData): Promise<AxiosResponse<EnrolleeResponse>> => {
    return await axiosInstance.post<EnrolleeResponse>('/enrollees', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};

// Helper function to convert form data to FormData object
export const createEnrolleeFormData = (data: EnrolleeFormData): FormData => {
  const formData = new FormData();
  
  // Append basic information
  formData.append('firstName', data.firstName);
  formData.append('lastName', data.lastName);
  if (data.otherName) formData.append('otherName', data.otherName);
  formData.append('phoneNumber', data.phoneNumber);
  formData.append('emailAddress', data.emailAddress);
  formData.append('dateOfBirth', data.dateOfBirth);
  formData.append('gender', data.gender);
  
  // Append additional information
  formData.append('fullAddress', data.fullAddress);
  formData.append('stateOfResidence', data.stateOfResidence);
  formData.append('occupation', data.occupation);
  formData.append('maritalStatus', data.maritalStatus);
  formData.append('ethnicity', data.ethnicity);
  formData.append('nationality', data.nationality);
  
  // Append enrollment details
  formData.append('enrolleeTypeId', data.enrolleeTypeId);
  formData.append('enrolleeClassId', data.enrolleeClassId);
  formData.append('planTypeId', data.planTypeId);
  if (data.corporateId) formData.append('corporateId', data.corporateId);
  
  // Append next of kin as JSON string
  formData.append('nextOfKinCreate', JSON.stringify(data.nextOfKin));
  
  // Append dependents as JSON string
  formData.append('dependents', JSON.stringify(data.dependents));
  
  // Append photo file if exists
  if (data.photo) {
    formData.append('photo', data.photo);
  }
  
  // Append dependent photos
  data.dependents.forEach((dependent, index) => {
    if (dependent.photo) {
      formData.append(`dependentPhoto${index}`, dependent.photo);
    }
  });
  
  return formData;
};