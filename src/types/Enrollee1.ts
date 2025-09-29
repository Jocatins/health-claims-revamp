// types/enrollee.ts
export interface NextOfKinCreate {
  fullName: string;
  relationship: string;
  phoneNumber: string;
  homeAddress: string;
}

export interface DependentCreate {
  firstName: string;
  lastName: string;
  gender: string;
  dateOfBirth: string;
  photo?: File; 
}

export interface EnrolleeFormData {
  // Basic Information
  firstName: string;
  lastName: string;
  otherName?: string;
  phoneNumber: string;
  emailAddress: string;
  dateOfBirth: string;
  gender: string;
  
  // Additional Information
  fullAddress: string;
  stateOfResidence: string;
  occupation: string;
  maritalStatus: string;
  ethnicity: string;
  nationality: string;
  
  // Enrollment Details
  enrolleeTypeId: string;
  enrolleeClassId: string;
  planTypeId: string;
  corporateId?: string; // Optional for individual enrollees
  
  // Next of Kin
  nextOfKin: NextOfKinCreate;
  
  // Dependents (array)
  dependents: DependentCreate[];
  
  // File uploads
  photo?: File;
}

export interface EnrolleeResponse {
  data: {
    id: string;
    hmoId: string;
    firstName: string;
    lastName: string;
    otherName: string;
    phoneNumber: string;
    emailAddress: string;
    enrolleeTypeId: string;
    enrolleeClassId: string;
    dateOfBirth: string;
    fullAddress: string;
    stateOfResidence: string;
    gender: string;
    occupation: string;
    maritalStatus: string;
    ethnicity: string;
    nationality: string;
    corporateId: string;
    planTypeId: string;
    photoName: string;
    enrolleeIdNumber: string;
    createdDate: string;
    isActive: boolean;
    nextOfKin: {
      fullName: string;
      relationship: string;
      phoneNumber: string;
      homeAddress: string;
      id: string;
      isActive: boolean;
      hmoId: string;
      enrolleeId: string;
      createdDate: string;
    };
    dependents: Array<{
      enrolleeId: string;
      firstName: string;
      lastName: string;
      gender: string;
      dateOfBirth: string;
      id: string;
      photoName: string;
      isActive: boolean;
      createdDate: string;
    }>;
    enrolleeClass: {
      name: string;
      description: string;
      id: string;
      isActive: boolean;
      createdDate: string;
    };
    enrolleeType: {
      name: string;
      description: string;
      id: string;
      isActive: boolean;
      createdDate: string;
    };
    planType: {
      name: string;
      description: string;
      id: string;
      hmoId: string;
      isActive: boolean;
      createdDate: string;
    };
  };
  message: string;
  isSuccess: boolean;
}