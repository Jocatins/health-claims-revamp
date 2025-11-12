import { useEffect, useState } from "react";
import Input from "../../../components/form/Input";
import FormHeader from "../../../components/form/FormHeader";
import ButtonT from "../../../components/form/ButttonT";
import ButtonG from "../../../components/form/ButtonG";
import FormSelect from "../../../components/form/FormSelect";

import { corporateTypeOptions } from "../../../utils/corporateTypeUtils";
import { corporateCategoryOptions } from "../../../utils/corporateCatUtils";
import type { CorporateEntity } from "../../../types/iCorporate";
import SuccessModal from "../../../components/form/SuccessModal";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux"; 
import type { AppDispatch, RootState } from "../../../services/store/store"; 
import { useForm } from "react-hook-form";
import { createCorporate } from "../../../services/thunks/corporateThunk";
import { fetchEnrolleeClass } from "../../../services/thunks/resourcesThunk";

const Corporate = () => {
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [successMessage, _setSuccessMessage] = useState('Corporate entity created successfully!'); 
  const dispatch = useDispatch<AppDispatch>();
  
  // Get loading state from Redux
  const { createLoading } = useSelector((state: RootState) => state.corporate);
    const { data: enrolleeClass, loading: loadingEnrolleeClass, error: errorEnrolleeClass } = useSelector((state: RootState) => state.enrolleeClass);

  const { 
    register, 
    handleSubmit, 
    formState: { errors }, 
    reset,
    trigger // Added trigger from useForm
  } = useForm<CorporateEntity>();

  const navigate = useNavigate();

  useEffect(() => {
   dispatch(fetchEnrolleeClass());
  }, [dispatch])

  const handleBlur = (fieldName: keyof CorporateEntity) => {
    trigger(fieldName);
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false); 
    // Optional: Navigate after success
    // navigate("/some-success-page");
  };

  const backNavigation = () => {
    navigate("/enrollee/registration/choose-type");
  };

  const handleFormSubmit = async (data: CorporateEntity) => {
   try {
 
    await dispatch(createCorporate(data)).unwrap();
    
    setShowSuccessModal(true);
    reset();
    
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error('Failed to create corporate entity:', error);
  }
  };

  return (
    <>
      <div>
        <FormHeader>Corporate Info</FormHeader>
        <form className="grid grid-cols-2 gap-4 mt-6" onSubmit={handleSubmit(handleFormSubmit)}>
          <FormSelect
            label="Corporate Type"
            {...register("corporateType", {
              required: "Corporate type is required",
            })}
            error={errors.corporateType?.message as string}
          >
            {/* <option value=""></option> */}
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
            {/* <option value=""></option> */}
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
            {/* <option value=""></option> */}
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
              <ButtonG type="submit" disabled={createLoading}>
                {createLoading ? "Submitting..." : "Submit"}
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