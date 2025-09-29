import React from "react";
import Input from "../../../components/form/Input";

import FormHeader from "../../../components/form/FormHeader";
import ButtonT from "../../../components/form/ButttonT";
import ButtonG from "../../../components/form/ButtonG";
import FormSelect from "../../../components/form/FormSelect";

import { useEnrolleeClass } from "../../../hooks/resources/useEnrolleeClass";
import { corporateTypeOptions } from "../../../utils/corporateTypeUtils";
import { corporateCategoryOptions } from "../../../utils/corporateCatUtils";
import { useCorporateForm } from "../../../hooks/useCorporateForm";
import type { CorporateFormData } from "../../../types/iCorporate";
import SuccessModal from "../../../components/form/SuccessModal";
import { useNavigate } from "react-router-dom";

const Corporate: React.FC = () => {

   const {
    methods: { register, trigger, formState: { errors } },
  
    isSubmitting,
     handleFormSubmit, 
     showSuccessModal,
    successMessage,
    closeSuccessModal,
  } = useCorporateForm();
  const {
    enrolleeClass,
    loading: loadingEnrolleeClass,
    error: errorEnrolleeClass,
  } = useEnrolleeClass(); 
  const navigate = useNavigate();

const handleBlur = (fieldName: keyof CorporateFormData) => {
    trigger(fieldName);
  };

  const handleSuccessModalClose = () => {
    closeSuccessModal(true); 
    
  };
  const backNavigation = () => {
    navigate("/enrollee/enrollees")
  }


  return (
   <>
   
      <div>
        <FormHeader>Corporate Info</FormHeader>
        <form className="grid grid-cols-2 gap-4 mt-6" onSubmit={handleFormSubmit}>
          <FormSelect
            label="Corporate Type"
            {...register("corporateType", {
              required: "Corporate type is required",
            })}
            error={errors.corporateType?.message as string}
            // onBlur={() => handleBlur("corporateType")}
          >
            <option value=""></option>
            {corporateTypeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </FormSelect>

          <FormSelect
            label="Corporate Category"
            {...register("corporateCatgory", {
              required: "Corporate Category is required",
            })}
            error={errors.corporateCatgory?.message as string}
   
          >
            <option value=""></option>
            {corporateCategoryOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </FormSelect>

          <Input 
            type="text" 
            label="Company" 
            {...register("companyName", {
              required: "Company is required",
            })}
            error={errors.companyName?.message as string}
            onBlur={() => handleBlur("companyName")}
          />

          <Input 
            type="email" 
            label="Email" 
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^\S+@\S+$/i,
                message: "Invalid email format"
              }
            })}
            error={errors.email?.message as string}
            onBlur={() => handleBlur("email")}
          />

          <Input 
            type="text" 
            label="Phone Number" 
            {...register("phoneNumber", {
              required: "Phone number is required",
            })}
            error={errors.phoneNumber?.message as string}
            onBlur={() => handleBlur("phoneNumber")}
          />

          <Input 
            type="text" 
            label="Office Address" 
            {...register("officeAddress", {
              required: "Office address is required",
            })}
            error={errors.officeAddress?.message as string}
            onBlur={() => handleBlur("officeAddress")}
          />

          <FormSelect
            label="Enrollee Class"
            {...register("enrolleeClassId", {
              required: "Enrollee class is required",
            })}
            error={errors.enrolleeClassId?.message as string || errorEnrolleeClass}
            isLoading={loadingEnrolleeClass}
          
          >
            <option value=""></option>
            {enrolleeClass?.map((ec) => (
              <option key={ec.id} value={ec.id}>
                {ec.name}
              </option>
            ))}
          </FormSelect>

          <div className="grid grid-cols-2 gap-4 mt-6 col-span-2">
            <div className="flex">
              <ButtonT type="button" onClick={backNavigation}>Back</ButtonT>
            </div>
            <div className="flex justify-end">
              <ButtonG type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit"}
              </ButtonG>
            </div>
          </div>
        </form>
      </div>
       <SuccessModal
        isOpen={showSuccessModal}
        onClose={handleSuccessModalClose}
        title="Successful!"
        message={successMessage}
      />
    </>
  );
};

export default Corporate;
