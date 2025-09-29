// hooks/useCorporateForm.ts
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { corporateService } from '../services/corporateService';
import type { CorporateFormData } from '../types/iCorporate';

export const useCorporateForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const methods = useForm<CorporateFormData>({ 
    mode: "onChange",
    defaultValues: {
      corporateType: "",
      corporateCatgory: "",
      companyName: "",
      email: "",
      phoneNumber: "",
      officeAddress: "",
      enrolleeClassId: ""
    }
  });

  const { handleSubmit: rhfHandleSubmit } = methods;

  const onSubmit = async (data: CorporateFormData) => {
    setIsSubmitting(true);
    setSubmitError(null);
    setShowSuccessModal(false);

    try {
      const response = await corporateService.createCorporate(data);
      console.log('Submission successful:', response.data);
      
      // Set success message and show modal
      setSuccessMessage('You have successfully created a new Corporate');
      setShowSuccessModal(true);
     
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error('Submission error:', error);
      setSubmitError(
        error.response?.data?.message || 
        error.message || 
        'Failed to submit corporate information'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFormSubmit = rhfHandleSubmit(onSubmit);

  // Function to close the success modal and optionally reset the form
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
    
    // Modal-related state and functions
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