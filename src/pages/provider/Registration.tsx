import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import FormHeader from "../../components/form/FormHeader";
import Input from "../../components/form/Input";
import ButtonT from "../../components/form/ButttonT";
import ButtonG from "../../components/form/ButtonG";
import FormSelect from "../../components/form/FormSelect";
import AdvancedDatePicker from "../../components/form/ADatePicker";
import PhoneNumberInput from "../../components/form/PhoneInput";

import { useProviderForm } from "../../hooks/useProviderForm";

import type { AppDispatch, RootState } from "../../services/store/store";
import { useDispatch, useSelector } from "react-redux";
import { fetchBanks } from "../../services/thunks/resourcesThunk";
import { accountTypeOptions } from "../../utils/accountTypeUtils";
import type { ProviderStep } from "../../types/Step";
import { validateProviderStep } from "../../utils/providerStepValidator";
import SuccessModal from "../../components/form/SuccessModal";

const ProviderRegistration = () => {
  const [step, setStep] = useState<ProviderStep>("provider");
  const [licenseExpiryDate, setLicenseExpiryDate] = useState<Date | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  // Get creating state from Redux store
  const { creating, createError } = useSelector(
    (state: RootState) => state.allProviders
  );
  const { user } = useSelector((state: RootState) => state.auth);

  // react - form hooks
  const {
    methods: {
      register,
      formState: { errors },
      setValue,
      trigger,
      watch,
      handleSubmit,
    },
    handleFormSubmit,
    isSubmitting,
  } = useProviderForm();

  const {
    banks,
    loading: loadingBanks,
    error: errorBanks,
  } = useSelector((state: RootState) => state.banks);

  const onSubmit = async (data: any) => {
    setSubmitError(null);
    try {
      // Check if user has hmoId
      if (!user?.hmoId) {
        setSubmitError("User authentication error. Please log in again.");
        return;
      }

      await handleFormSubmit(data);

      setShowSuccessModal(true);
    } catch (error: any) {
      setSubmitError(error.message || "Failed to create provider");
      console.error("Form submission error:", error);
    }
  };

  const handleModalClose = () => {
    setShowSuccessModal(false);

    navigate("/enrollee/providers/all");
  };

  const handleValidateProviderStep = () => {
    validateProviderStep(trigger, setStep);
  };

  const prevStep = () => {
    if (step === "provider-contact") setStep("provider");
  };

  const handleDateChange = (date: Date | null) => {
    console.log("Date selected:", date);
    setLicenseExpiryDate(date);
    if (date) {
      // Convert Date to ISO string
      const dateString = date.toISOString();
      setValue("licenseExpiryDate", dateString, {
        shouldValidate: true,
      });
      console.log("Date set in form:", dateString);
    } else {
      setValue("licenseExpiryDate", "", {
        shouldValidate: true,
      });
    }
  };

  const handleBankChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedBankId = e.target.value;
    const selectedBank = banks.find(
      (bank) => bank.id.toString() === selectedBankId
    );

    if (selectedBank) {
      setValue("bankId", selectedBankId, { shouldValidate: true });
      setValue("bankName", selectedBank.name, { shouldValidate: true });
      setValue("bankCode", selectedBank.code, { shouldValidate: true });
    } else {
      setValue("bankId", "", { shouldValidate: true });
      setValue("bankName", "", { shouldValidate: true });
      setValue("bankCode", "", { shouldValidate: true });
    }
  };

  // Auto-fill account name when account number is entered (simplified example)
  // useEffect(() => {
  //   if (accountNumber && accountNumber.length >= 10) {
  //     // In a real app, you might want to call an API to verify account details
  //     setValue("accountName", "Auto-filled Account Name", { shouldValidate: true });
  //   }
  // }, [accountNumber, setValue]);

  useEffect(() => {
    dispatch(fetchBanks());
  }, [dispatch]);

  const backNavigation = () => {
    navigate("/enrollee/enrollees");
  };

  // Check if user is authenticated and has hmoId
  if (!user) {
    return (
      <div className="p-6 bg-gray-50">
        <div className="text-center py-8">
          <p className="text-red-500">Please log in to create a provider.</p>
        </div>
      </div>
    );
  }

  if (!user.hmoId) {
    return (
      <div className="p-6 bg-gray-50">
        <div className="text-center py-8">
          <p className="text-red-500">
            Your account is missing required HMO information.
          </p>
        </div>
      </div>
    );
  }

  const isSubmittingForm = isSubmitting || creating;

  return (
    <>
      <div className="p-6 bg-gray-50">
        {/* Step indicators */}
        <div className="flex items-center space-x-6 mb-6">
          <div
            className={`flex items-center space-x-2 cursor-pointer ${
              step === "provider"
                ? "text-[#186255] font-semibold"
                : "text-gray-500"
            }`}
            onClick={() => setStep("provider")}
          >
            <span
              className={`w-5 h-5 flex items-center justify-center rounded-full border ${
                step === "provider"
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
              step === "provider-contact"
                ? "text-[#186255] font-semibold"
                : "text-gray-500"
            }`}
            onClick={() =>
              step === "provider-contact" && setStep("provider-contact")
            }
          >
            <span
              className={`w-5 h-5 flex items-center justify-center rounded-full border ${
                step === "provider-contact"
                  ? "bg-[#186255] text-white"
                  : "border-gray-400"
              }`}
            >
              {step === "provider-contact" ? "✓" : "○"}
            </span>
            <span>Provider Contact Details</span>
          </div>
        </div>

        {/* Error Display */}
        {(submitError || createError) && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-600 text-sm">{submitError || createError}</p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6">
          {step === "provider" && (
            <div>
              <FormHeader>Basic Info</FormHeader>
              <div className="grid grid-cols-2 gap-4 mt-6">
                {/* Hospital Name */}
                <Input
                  type="text"
                  label="Hospital name"
                  {...register("hospitalName")}
                  error={errors.hospitalName?.message}
                />

                {/* Email */}
                <Input
                  type="email"
                  label="Email"
                  {...register("email")}
                  error={errors.email?.message}
                />

                {/* Hospital Address */}
                <Input
                  type="text"
                  label="Hospital Address"
                  {...register("hospitalAdress")}
                  error={errors.hospitalAdress?.message}
                />

                {/* Phone Number */}
                <PhoneNumberInput
                  register={register("phoneNumber")}
                  error={errors.phoneNumber?.message}
                />

                {/* Bank Selection */}
                <FormSelect
                  label="Banks"
                  value={watch("bankId") || ""}
                  isLoading={loadingBanks}
                  error={errors.bankId?.message || errorBanks}
                  onChange={handleBankChange}
                >
                  <option value="">Select a bank</option>
                  {banks?.map((bk) => (
                    <option key={bk.id} value={bk.id}>
                      {bk.name}
                    </option>
                  ))}
                </FormSelect>

                {/* Account Number */}
                <Input
                  type="text"
                  label="Account Number"
                  {...register("accountNumber")}
                  error={errors.accountNumber?.message}
                />

                {/* Account Name */}
                <Input
                  type="text"
                  label="Account Name"
                  {...register("accountName")}
                  error={errors.accountName?.message}
                />

                {/* Account Type */}
                <FormSelect
                  label="Account Type"
                  {...register("accountType")}
                  error={errors.accountType?.message}
                >
                  <option value="">Select account type</option>
                  {accountTypeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </FormSelect>

                {/* BVN */}
                <Input
                  type="text"
                  label="BVN"
                  {...register("bankVeririfationNumber")}
                  error={errors.bankVeririfationNumber?.message}
                />

                {/* State License Number */}
                <Input
                  type="text"
                  label="State Licence Number"
                  {...register("stateLicenseNumber")}
                  error={errors.stateLicenseNumber?.message}
                />

                {/* License Expiry Date */}
                <AdvancedDatePicker
                  label="Licence Expiry Date"
                  selected={licenseExpiryDate}
                  onChange={handleDateChange}
                  error={errors.licenseExpiryDate?.message}
                />

                {/* Geo Location */}
                <Input
                  type="text"
                  label="Geo Location"
                  {...register("geoLocation")}
                  error={errors.geoLocation?.message}
                />

                {/* Buttons */}
                <div className="flex">
                  <ButtonT type="button" onClick={backNavigation}>
                    Back
                  </ButtonT>
                </div>
                <div className="flex justify-end">
                  <ButtonG type="button" onClick={handleValidateProviderStep}>
                    Next
                  </ButtonG>
                </div>
              </div>
            </div>
          )}

          {step === "provider-contact" && (
            <div>
              <FormHeader>Contact Details</FormHeader>
              <div className="grid grid-cols-2 gap-4 mt-6">
                {/* Contact Name */}
                <Input
                  type="text"
                  label="Full Name"
                  {...register("contacts.0.name")}
                  error={errors.contacts?.[0]?.name?.message}
                />

                {/* Contact Email */}
                <Input
                  type="email"
                  label="Email"
                  {...register("contacts.0.email")}
                  error={errors.contacts?.[0]?.email?.message}
                />

                {/* Designation */}
                <Input
                  type="text"
                  label="Designation"
                  {...register("contacts.0.designation")}
                  error={errors.contacts?.[0]?.designation?.message}
                />

                {/* Contact Phone Number */}
                <PhoneNumberInput
                  register={register("contacts.0.phoneNumber")}
                  error={errors.contacts?.[0]?.phoneNumber?.message}
                />

                {/* Buttons */}
                <div className="flex col-span-2 gap-4 mt-4">
                  <ButtonT type="button" onClick={prevStep}>
                    Back
                  </ButtonT>
                  <ButtonG
                    type="submit"
                    disabled={isSubmittingForm}
                    className={
                      isSubmittingForm ? "opacity-50 cursor-not-allowed" : ""
                    }
                  >
                    {isSubmittingForm ? "Submitting..." : "Submit"}
                  </ButtonG>
                </div>
              </div>
            </div>
          )}
        </form>
      </div>
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={handleModalClose}
        title="Provider Created Successfully"
        message="The provider has been successfully registered in the system."
      />
    </>
  );
};

export default ProviderRegistration;
