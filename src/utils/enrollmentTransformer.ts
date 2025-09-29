import type { EnrollmentFormData } from "../types/iEnrollmentForm";

export const transformFormDataToEnrollmentRequest = (
  formData: EnrollmentFormData
): FormData => {
  const formDataObj = new FormData();
  const { basicInfo, nextOfKin } = formData.enrollee;

  console.log('🔍 Transforming form data with basicInfo:', basicInfo);

 
  const basicInfoMap = {
    firstName: basicInfo.firstName,
    lastName: basicInfo.lastName,
    otherName: basicInfo.otherName || '', 
    phoneNumber: basicInfo.phoneNumber,
    emailAddress: basicInfo.email,
    enrolleeTypeId: basicInfo.enrolleeType,
    enrolleeClassId: basicInfo.enrolleeClass || '', 
    fullAddress: basicInfo.fullAddress,
    stateOfResidence: basicInfo.state,
    gender: basicInfo.gender,
    occupation: basicInfo.occupation,
    maritalStatus: basicInfo.maritalStatus,
    ethnicity: basicInfo.ethnicity || '', 
    nationality: basicInfo.country,
    corporateId: basicInfo.beneficiary || '',
    planTypeId: basicInfo.planType,
  };
 console.log('🔍 Transforming form data with basicInfoMap:', basicInfoMap);
  // Append basic info fields
  Object.entries(basicInfoMap).forEach(([key, value]) => {
    // Always append the field, even if empty (backend might expect it)
    if(value ){

      formDataObj.append(key, value?.toString() || '');
      console.log(`📤 Appended field: ${key} =`, value);
    }
  });

  // Handle special fields
  if (basicInfo.dateOfBirth) {
    const dob = new Date(basicInfo.dateOfBirth);
    formDataObj.append('dateOfBirth', dob.toISOString().split('T')[0]); // YYYY-MM-DD format
    console.log('📤 Appended dateOfBirth:', dob.toISOString().split('T')[0]);
  }

  // Handle file upload
  // if (basicInfo.profilePhoto && basicInfo.profilePhoto instanceof File) {
  //   formDataObj.append('profilePhoto', basicInfo.profilePhoto);
  //   console.log('📤 Appended profilePhoto file:', basicInfo.profilePhoto.name);
  // } else if (basicInfo.profilePhoto && basicInfo.profilePhoto instanceof FileList && basicInfo.profilePhoto.length > 0) {
   
  //   formDataObj.append('profilePhoto', basicInfo.profilePhoto[0]);
  //   console.log('📤 Appended profilePhoto from FileList:', basicInfo.profilePhoto[0].name);
  // }

  // Append next of kin fields - use simple nested structure if backend expects it
  // Check if backend wants "nextOfKinCreate.fullName" or just flat fields
  const nextOfKinCreate = {
    'fullName': nextOfKin.fullName,
    'relationship': nextOfKin.relationship,
    'phoneNumber': nextOfKin.phoneNumber,
    'homeAddress': nextOfKin.homeAddress,
  };
  formDataObj.append("nextOfKinCreate", JSON.stringify(nextOfKinCreate))
  // this should be a json

  // Object.entries(nextOfKinCreate).forEach(([key, value]) => {
  //   if (value) {
  //     formDataObj.append(key, value.toString());
  //     console.log(`📤 Appended nextOfKin field: ${key} =`, value);
  //   }
  // });

  // Log final FormData for verification
  console.log('🔍 Final FormData entries:');
  for (const [key, value] of formDataObj.entries()) {
    console.log(`${key}:`, value);
  }

  return formDataObj;
};