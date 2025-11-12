import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import FormHeader from "../../components/form/FormHeader";
import Input from "../../components/form/Input";
import ButtonT from "../../components/form/ButttonT";
import ButtonG from "../../components/form/ButtonG";
import FormSelect from "../../components/form/FormSelect";
import AdvancedDatePicker from "../../components/form/ADatePicker";
import PhoneNumberInput from "../../components/form/PhoneInput";
import type { AppDispatch, RootState } from "../../services/store/store";
import { useDispatch, useSelector } from "react-redux";
import { fetchBanks } from "../../services/thunks/resourcesThunk";
import {
  fetchProviderById,
  updateProvider,
} from "../../services/thunks/iProviderThunk";
import { accountTypeOptions } from "../../utils/accountTypeUtils";
import SuccessModal from "../../components/form/SuccessModal";
import { LoadingSpinner } from "../../components/ui/LoadingSpinner";
import type { ProviderEntity } from "../../types/iProvider";
import { useProviderEditForm } from "../../hooks/useProviderEditForm";
import type { ProviderEditFormData } from "../../schemas/providerSchema";
import { useProviderContext } from "../../context/useProviderContext";

const EditProvider = () => {
  const [licenseExpiryDate, setLicenseExpiryDate] = useState<Date | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [providerData, setProviderData] = useState<ProviderEntity | null>(null);
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { selectedProviderId } = useProviderContext();

  // Get creating/updating state from Redux store
  const { creating, createError, providers, loading, error } = useSelector(
    (state: RootState) => state.allProviders
  );
  const { user } = useSelector((state: RootState) => state.auth);

  // Find existing provider data using selectedProviderId
  const existingProvider = providers.find((p) => p.id === selectedProviderId);

  // react - form hooks
  const {
    methods: {
      register,
      formState: { errors, isValid },
      setValue,
      watch,
      handleSubmit,
      reset,
      trigger,
    },
    isSubmitting,
  } = useProviderEditForm();

  const {
    banks,
    loading: loadingBanks,
    error: errorBanks,
  } = useSelector((state: RootState) => state.banks);

  useEffect(() => {
    const initializeForm = async () => {
      if (!selectedProviderId) {
        setSubmitError("Provider ID is missing from context");
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setSubmitError(null);

      try {
        console.log("Fetching provider data for ID:", selectedProviderId);

        let data: ProviderEntity;

        // If provider is already in the list, use it
        if (existingProvider) {
          console.log("Using existing provider from store:", existingProvider);
          data = existingProvider;
        } else {
          // Otherwise fetch the specific provider
          console.log("Fetching provider from API...");
          const result = await dispatch(fetchProviderById(selectedProviderId));
          console.log("API response:", result);

          if (fetchProviderById.fulfilled.match(result)) {
            data = result.payload;
            console.log("Fetched provider data:", data);
          } else {
            throw new Error(
              result.error?.message || "Failed to fetch provider"
            );
          }
        }

        if (!data) {
          throw new Error("No provider data received");
        }

        setProviderData(data);

        // Debug provider data structure
        console.log("=== PROVIDER DATA DEBUG ===");
        console.log("Main ID:", data.id);
        console.log("Contact array:", data.contacts);
        console.log("First contact:", data.contacts?.[0]);
        console.log("First contact providerId:", data.contacts?.[0]?.name);
        console.log("===========================");

        // Get the first contact (like Flutter: provider.contact![0])
        const firstContact = data.contacts?.[0];

        // Find the bank ID based on bank name and code
        const existingBank = banks.find(
          (bank) => bank.name === data.bankName && bank.code === data.bankCode
        );

        // Simple form initialization - matches Flutter structure exactly
        const formValues = {
          hospitalName: data.hospitalName || "",
          email: data.email || "",
          hospitalAdress: data.hospitalAdress || "",
          phoneNumber: data.phoneNumber || "",
          bankId: existingBank?.id.toString() || "", // Set bankId for selection
          bankName: data.bankName || "",
          bankCode: data.bankCode || "",
          accountNumber: data.accountNumber || "",
          accountName: data.accountName || "",
          accountType: data.accountType || "",
          bankVeririfationNumber: data.bankVeririfationNumber || "",
          stateLicenseNumber: data.stateLicenseNumber || "",
          licenseExpiryDate: data.licenseExpiryDate || "",
          geoLocation: data.geoLocation || "",
          contactName: firstContact?.name || "",
          contactEmail: firstContact?.email || "",
          contactDesignation: firstContact?.designation || "",
          contactPhone: firstContact?.phoneNumber || "",
        };

        console.log("Resetting form with data:", formValues);
        reset(formValues);

        // Set dates for date pickers
        if (data.licenseExpiryDate) {
          const expiryDate = new Date(data.licenseExpiryDate);
          setLicenseExpiryDate(expiryDate);
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        console.error("Failed to fetch provider data:", error);
        setSubmitError(error.message || "Failed to load provider data");
      } finally {
        setIsLoading(false);
      }
    };

    initializeForm();
  }, [selectedProviderId, existingProvider, dispatch, reset, banks]);

  // Handle bank selection
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

  // Handle date changes
  const handleLicenseDateChange = (date: Date | null) => {
    setLicenseExpiryDate(date);
    if (date) {
      const dateString = date.toISOString();
      setValue("licenseExpiryDate", dateString, { shouldValidate: true });
    } else {
      setValue("licenseExpiryDate", "", { shouldValidate: true });
    }
  };

  // Update provider function - Use selectedProviderId
  const handleUpdateProvider = async (formData: ProviderEditFormData) => {
    if (!selectedProviderId || !user?.hmoId || !providerData) {
      throw new Error("Missing required information for update");
    }

    // Transform form data to match backend schema exactly
    const providerUpdateData = {
      hospitalName: formData.hospitalName.trim(),
      email: formData.email.trim(),
      hospitalAdress: formData.hospitalAdress.trim(),
      phoneNumber: formData.phoneNumber.trim(),
      bankName: formData.bankName.trim(),
      accountNumber: formData.accountNumber.trim(),
      bankCode: formData.bankCode.trim(),
      accountName: formData.accountName.trim(),
      accountType: formData.accountType,
      bankVeririfationNumber: formData.bankVeririfationNumber.trim(),
      stateLicenseNumber: formData.stateLicenseNumber.trim(),
      licenseExpiryDate: formData.licenseExpiryDate,
      geoLocation: formData.geoLocation.trim(),
      // Transform individual contact fields to contacts array
      contacts: [
        {
          name: formData.contactName.trim(),
          designation: formData.contactDesignation.trim(),
          email: formData.contactEmail.trim(),
          phoneNumber: formData.contactPhone.trim(),
        },
      ],
      id: selectedProviderId, // FIXED: Use selectedProviderId
      hmoId: user.hmoId,
    };

    console.log("Update payload:", providerUpdateData);
    console.log("Updating provider with ID:", selectedProviderId);

    try {
      const result = await dispatch(
        updateProvider({
          id: selectedProviderId, // FIXED: Use selectedProviderId
          providerData: providerUpdateData,
        })
      ).unwrap();
      return result;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Update failed:", error);
      throw error;
    }
  };

  const onSubmit = async (data: ProviderEditFormData) => {
    console.log("=== FORM SUBMISSION STARTED ===");
    console.log("Form data:", data);
    console.log("Form errors:", errors);
    console.log("Is form valid?", isValid);

    setSubmitError(null);
    try {
      if (!user?.hmoId) {
        setSubmitError("User authentication error. Please log in again.");
        return;
      }

      if (!selectedProviderId) {
        setSubmitError("Provider ID is missing from context");
        return;
      }

      // Validate all fields before submission
      const isValid = await trigger();
      console.log("Form validation result:", isValid);

      if (!isValid) {
        setSubmitError("Please fix all form errors before submitting.");
        return;
      }

      console.log("Calling handleUpdateProvider...");
      await handleUpdateProvider(data);
      console.log("Update successful, showing success modal");
      setShowSuccessModal(true);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Submission error:", error);
      setSubmitError(error.message || "Failed to update provider");
    }
  };

  const handleModalClose = () => {
    setShowSuccessModal(false);
    navigate("/enrollee/providers/all");
  };

  useEffect(() => {
    dispatch(fetchBanks());
  }, [dispatch]);

  const backNavigation = () => {
    navigate("/enrollee/providers/all");
  };

  // Show loading state
  if (isLoading) return <LoadingSpinner />;

  // Show error state
  if (submitError && !providerData) {
    return (
      <div className="p-6 bg-gray-50">
        <div className="text-center py-8">
          <p className="text-red-500">{submitError}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Check if user is authenticated and has hmoId
  if (!user) {
    return (
      <div className="p-6 bg-gray-50">
        <div className="text-center py-8">
          <p className="text-red-500">Please log in to edit a provider.</p>
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

  // Check if selectedProviderId is available
  if (!selectedProviderId) {
    return (
      <div className="p-6 bg-gray-50">
        <div className="text-center py-8">
          <p className="text-red-500">
            No provider selected. Please select a provider to edit.
          </p>
          <button
            onClick={() => navigate("/enrollee/providers/all")}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
          >
            Back to Providers
          </button>
        </div>
      </div>
    );
  }

  const isSubmittingForm = isSubmitting || creating || loading;

  return (
    <>
      <div className="p-6 bg-gray-50">
        {/* Error Display */}
        {(submitError || createError || error) && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-600 text-sm">
              {submitError || createError || error}
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6">
          <FormHeader>Edit Provider Details</FormHeader>

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
              onChange={handleLicenseDateChange}
              error={errors.licenseExpiryDate?.message}
            />

            {/* Geo Location */}
            <Input
              type="text"
              label="Geo Location"
              {...register("geoLocation")}
              error={errors.geoLocation?.message}
            />

            {/* Contact Details Header */}
            <div className="col-span-2">
              <FormHeader>Contact Details</FormHeader>
            </div>

            {/* Contact Name */}
            <Input
              type="text"
              label="Contact Full Name"
              {...register("contactName")}
              error={errors.contactName?.message}
            />

            {/* Contact Email */}
            <Input
              type="email"
              label="Contact Email"
              {...register("contactEmail")}
              error={errors.contactEmail?.message}
            />

            {/* Designation */}
            <Input
              type="text"
              label="Contact Designation"
              {...register("contactDesignation")}
              error={errors.contactDesignation?.message}
            />

            {/* Contact Phone Number */}
            <PhoneNumberInput
              register={register("contactPhone")}
              error={errors.contactPhone?.message}
            />

            {/* Buttons */}
            <div className="flex justify-between col-span-2 gap-4 mt-4">
              <ButtonT type="button" onClick={backNavigation}>
                Back
              </ButtonT>

              <ButtonG
                type="submit"
                disabled={isSubmittingForm}
                className={
                  isSubmittingForm ? "opacity-50 cursor-not-allowed" : ""
                }
              >
                {isSubmittingForm ? "Updating..." : "Update"}
              </ButtonG>
            </div>
          </div>
        </form>
      </div>
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={handleModalClose}
        title="Provider Updated Successfully"
        message="The provider has been successfully updated in the system."
      />
    </>
  );
};

export default EditProvider;
