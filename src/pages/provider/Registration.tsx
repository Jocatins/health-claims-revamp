/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import FormHeader from "../../components/form/FormHeader";
import Input from "../../components/form/Input";
import ButtonT from "../../components/form/ButttonT";
import ButtonG from "../../components/form/ButtonG";
import FormSelect from "../../components/form/FormSelect";
import AdvancedDatePicker from "../../components/form/ADatePicker";
import PhoneNumberInput from "../../components/form/PhoneInput";

import { useEnrolleeForm } from "../../hooks/useEnrolleeForm";
import { useStepValidator } from "../../constant/stepValidatior";
import type { AppDispatch, RootState } from "../../services/store/store";
import { useDispatch, useSelector } from "react-redux";
import { fetchBanks } from "../../services/thunks/resourcesThunk";

export type Step = "enrollee" | "plan";

const ProviderRegistration = () => {
  const [step, setStep] = useState<Step>("enrollee");
  const [dateOfBirth, setDateOfBirth] = useState<Date | null>(null);
  const navigate = useNavigate();
   const dispatch = useDispatch<AppDispatch>();

  const { validateEnrolleeStep } = useStepValidator();

  // react - form hooks
  const {
    methods: {
      register,
      formState: { errors },
      watch,
      setValue,
      trigger,
    },
    handleFormSubmit,
    isSubmitting,
  } = useEnrolleeForm();
   const { banks, loading: loadingBanks, error: errorBanks} = useSelector((state: RootState) => state.banks);
  // ----------------------
  const handleValidateEnrolleeStep = () => {
    validateEnrolleeStep(trigger, setStep);
  };

  // --------------------------

  // const nextStep = () => {
  //   if (step === "enrollee") setStep("plan");
  // };

  const prevStep = () => {
    if (step === "plan") setStep("enrollee");
  };

  const handleDateChange = (date: Date | null) => {
    console.log("Date selected:", date);
    setDateOfBirth(date);
    if (date) {
      // Convert Date to ISO string
      const dateString = date.toISOString();
      setValue("dateOfBirth", dateString, {
        shouldValidate: true,
      });
      console.log("Date set in form:", dateString);
    } else {
      setValue("dateOfBirth", "", {
        shouldValidate: true,
      });
    }
  };
  useEffect(() => {
    dispatch(fetchBanks())
  }, [dispatch]);

  const backNavigation = () => {
    navigate("/enrollee/enrollees");
  };

  return (
    <>
      <div className="p-6 bg-gray-50">
        {/* Step indicators */}
        <div className="flex items-center space-x-6 mb-6">
          <div
            className={`flex items-center space-x-2 cursor-pointer ${
              step === "enrollee"
                ? "text-[#186255] font-semibold"
                : "text-gray-500"
            }`}
            onClick={() => setStep("enrollee")}
          >
            <span
              className={`w-5 h-5 flex items-center justify-center rounded-full border ${
                step === "enrollee"
                  ? "bg-[#186255] text-white"
                  : "border-gray-400"
              }`}
            >
              ✓
            </span>
            <span>Provider Details</span>
          </div>

          <div
            className={`flex items-center space-x-2 cursor-pointer ${
              step === "plan" ? "text-[#186255] font-semibold" : "text-gray-500"
            }`}
            onClick={() => step === "plan" && setStep("plan")}
          >
            <span
              className={`w-5 h-5 flex items-center justify-center rounded-full border ${
                step === "plan" ? "bg-[#186255] text-white" : "border-gray-400"
              }`}
            >
              {step === "plan" ? "✓" : "○"}
            </span>
            <span>Provider Contact Details</span>
          </div>
        </div>

        {/* Single form wrapper */}
        <form className="mt-6">
          {step === "enrollee" && (
            <div>
              <FormHeader>Basic Info</FormHeader>
              <div className="grid grid-cols-2 gap-4 mt-6">
                <Input
                  type="text"
                  label="Hospital name"
                  // {...register("firstName", {
                  //   required: "First name is required",
                  // })}
                  // error={errors.firstName?.message}
                />
                <Input
                  type="email"
                  label="Email"
                  {...register("emailAddress", {
                    required: "Email is required",
                    pattern: {
                      value: /^\S+@\S+$/i,
                      message: "Invalid email address",
                    },
                  })}
                  error={errors.emailAddress?.message}
                />
                <Input type="text" label="Hospital Address" />

                <PhoneNumberInput
                  register={register("phoneNumber", {
                    required: "Phone number is required",
                  })}
                  error={errors.phoneNumber?.message}
                />

                <FormSelect
                  label="Banks"
                  defaultValue=""
                  isLoading={loadingBanks}
                  error={errorBanks}
               
                >
                  {banks?.map((bk) => (
                    <option key={bk.id} value={bk.id}>
                      {bk.name}
                    </option>
                  ))}
                </FormSelect>

                <Input
                  type="number"
                  label="Account Number"
                  // {...register("occupation", {
                  //   required: "Occupation",
                  // })}
                  // error={errors.occupation?.message}
                />
                <Input type="text" label="Account Name" />

                <FormSelect label="Account Type" defaultValue=""></FormSelect>

                <Input type="number" label="BVN" />
                <Input type="text" label="State Licence Number" />
                <AdvancedDatePicker
                  label="Licence Expiry Date"
                  selected={dateOfBirth}
                  onChange={handleDateChange}
                />
                <Input type="text" label="Professional Indenmity Number" />
                <AdvancedDatePicker
                  label="Indenmity Number Expiry Date"
                  selected={dateOfBirth}
                  onChange={handleDateChange}
                />
                <Input type="text" label="Tariff Band" />
                <Input type="text" label="Geo Location" />

                <br />
                <div className="flex">
                  <ButtonT type="button" onClick={backNavigation}>
                    Back
                  </ButtonT>
                </div>
                <div className="flex justify-end">
                  <ButtonG type="button" onClick={handleValidateEnrolleeStep}>
                    Next
                  </ButtonG>
                </div>
              </div>
            </div>
          )}

          {step === "plan" && (
            <div>
              <FormHeader>Plan Details</FormHeader>
              <div className="grid grid-cols-2 gap-4 mt-6">
                <Input type="text" label="Full Name" />
                <Input
                  type="email"
                  label="Email"
                  
                />

                <Input type="text" label="Designation" />
                <PhoneNumberInput
                  register={register("phoneNumber", {
                    required: "Phone number is required",
                  })}
                  error={errors.phoneNumber?.message}
                />

                <div className="flex">
                  <ButtonT type="button" onClick={prevStep}>
                    Back
                  </ButtonT>
                </div>
                <div className="flex justify-end">
                  <ButtonG
                    type="submit"
                    disabled={isSubmitting}
                    className={
                      isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                    }
                  >
                    {isSubmitting ? "Submitting..." : "Submit"}
                  </ButtonG>
                </div>
              </div>
            </div>
          )}
        </form>
      </div>
    </>
  );
};

export default ProviderRegistration;
