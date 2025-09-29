
import { useState } from 'react';
import { useForm } from 'react-hook-form';
// import { enrolleeService, createEnrolleeFormData } from '../services/enrolleeService';
import type { EnrolleeFormData } from '../types/Enrollee1';


export const useEnrolleeForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const methods = useForm<EnrolleeFormData>({ 
    mode: "onChange",
    defaultValues: {
      firstName: "",
      lastName: "",
      otherName: "",
      phoneNumber: "",
      emailAddress: "",
      dateOfBirth: "",
      gender: "",
      fullAddress: "",
      stateOfResidence: "",
      occupation: "",
      maritalStatus: "",
      ethnicity: "",
      nationality: "",
      enrolleeTypeId: "",
      enrolleeClassId: "",
      planTypeId: "",
      nextOfKin: {
        fullName: "",
        relationship: "",
        phoneNumber: "",
        homeAddress: ""
      },
      dependents: []
    }
  });

  const { handleSubmit: rhfHandleSubmit } = methods;

  const onSubmit = async (data: EnrolleeFormData) => {
    setIsSubmitting(true);
    setSubmitError(null);
    setShowSuccessModal(false);
    console.log(data)

    // try {
      
    //   const formData = createEnrolleeFormData(data);
      
    //   const response = await enrolleeService.createEnrollee(formData);
    //   console.log('Enrollee creation successful:', response.data);
      
    //   setSuccessMessage('Individual enrollee created successfully!');
    //   setShowSuccessModal(true);
     
    // // eslint-disable-next-line @typescript-eslint/no-explicit-any
    // } catch (error: any) {
    //   console.error('Submission error:', error);
    //   setSubmitError(
    //     error.response?.data?.message || 
    //     error.message || 
    //     'Failed to create enrollee'
    //   );
    // } finally {
    //   setIsSubmitting(false);
    // }
  };

  const handleFormSubmit = rhfHandleSubmit(onSubmit);

  const closeSuccessModal = (resetForm: boolean = false) => {
    setShowSuccessModal(false);
    if (resetForm) {
      methods.reset();
      setSubmitError(null);
    }
  };

  return {
    methods,
    onSubmit,
    isSubmitting,
    handleFormSubmit,
    submitError,
    showSuccessModal,
    successMessage,
    closeSuccessModal,
    reset: () => {
      setSubmitError(null);
      setShowSuccessModal(false);
      methods.reset();
    }
  };
};