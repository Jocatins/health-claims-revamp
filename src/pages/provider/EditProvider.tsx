import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
import { fetchProviderById, updateProvider } from "../../services/thunks/iProviderThunk"; 
import { accountTypeOptions } from "../../utils/accountTypeUtils";
import type { ProviderStep } from "../../types/Step";
import { validateProviderStep } from "../../utils/providerStepValidator";
import SuccessModal from "../../components/form/SuccessModal";
import { LoadingSpinner } from "../../components/ui/LoadingSpinner"; 
import type { ProviderEntity } from "../../types/iProvider";

const EditProvider = () => {
  const { id } = useParams<{ id: string }>(); 
  const [step, setStep] = useState<ProviderStep>("provider");
  const [licenseExpiryDate, setLicenseExpiryDate] = useState<Date | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true); 
  const [providerData, setProviderData] = useState<ProviderEntity | null>(null);
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  // Get creating/updating state from Redux store
  const { creating, createError, providers, loading, error } = useSelector(
    (state: RootState) => state.allProviders
  );
  const { user } = useSelector((state: RootState) => state.auth);

  // Find existing provider data
  const existingProvider = providers.find(p => p.id === id);

  // react - form hooks
  const {
    methods: {
      register,
      formState: { errors },
      setValue,
      trigger,
      watch,
      handleSubmit,
      reset,
    },
    handleFormSubmit,
    isSubmitting,
  } = useProviderForm();

  const {
    banks,
    loading: loadingBanks,
    error: errorBanks,
  } = useSelector((state: RootState) => state.banks);

  // Fetch provider data and populate form
  useEffect(() => {
    const fetchProviderData = async () => {
      if (!id) {
        setSubmitError("Provider ID is missing");
        setIsLoading(false);
        return;
      }
      
      setIsLoading(true);
      setSubmitError(null);
      
      try {
        console.log("Fetching provider data for ID:", id);
        
        let data: ProviderEntity;
        
        // If provider is already in the list, use it
        if (existingProvider) {
          console.log("Using existing provider from store:", existingProvider);
          data = existingProvider;
        } else {
          // Otherwise fetch the specific provider
          console.log("Fetching provider from API...");
          const result = await dispatch(fetchProviderById(id));
          console.log("API response:", result);
          
          if (fetchProviderById.fulfilled.match(result)) {
            data = result.payload; // Access the data property from the response
            console.log("Fetched provider data:", data);
          } else {
            throw new Error(result.error?.message || "Failed to fetch provider");
          }
        }

        if (!data) {
          throw new Error("No provider data received");
        }

        setProviderData(data);

        // Find bank ID by matching bank name
        const foundBank = banks.find(bank => bank.name === data.bankName);
        const bankId = foundBank ? foundBank.id.toString() : "";

        console.log("Preparing form data:", {
          hospitalName: data.hospitalName,
          email: data.email,
          bankName: data.bankName,
          bankId: bankId,
          contacts: data.contacts
        });

        // Prepare form data - ensure we're using the correct structure
        const formData = {
          hospitalName: data.hospitalName || "",
          email: data.email || "",
          hospitalAdress: data.hospitalAdress || "",
          phoneNumber: data.phoneNumber || "",
          bankId: bankId,
          bankName: data.bankName || "",
          bankCode: data.bankCode || "",
          accountNumber: data.accountNumber || "",
          accountName: data.accountName || "",
          accountType: data.accountType || "",
           bankVeririfationNumber: data.bankVeririfationNumber?.trim() || "",
          stateLicenseNumber: data.stateLicenseNumber || "",
          licenseExpiryDate: data.licenseExpiryDate || "",
          geoLocation: data.geoLocation || "",
          contacts: data.contacts && data.contacts.length > 0 
            ? data.contacts.map(contact => ({
                name: contact.name || "",
                designation: contact.designation || "",
                email: contact.email || "",
                phoneNumber: contact.phoneNumber || ""
              }))
            : [{ name: "", email: "", designation: "", phoneNumber: "" }],
        };

        console.log("Resetting form with data:", formData);
     
        setTimeout(() => {
          reset(formData);
          console.log("Form reset completed");
        }, 0);

        // Set license expiry date for the date picker
        if (data.licenseExpiryDate) {
          const expiryDate = new Date(data.licenseExpiryDate);
          setLicenseExpiryDate(expiryDate);
          console.log("Set license expiry date:", expiryDate);
        }

      } catch (error: any) {
        console.error("Failed to fetch provider data:", error);
        setSubmitError(error.message || "Failed to load provider data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProviderData();
  }, [id, existingProvider, dispatch, reset, banks]);

  // Alternative approach: Set form values individually after reset
  useEffect(() => {
    if (providerData && !isLoading) {
      console.log("Setting individual form values for provider:", providerData);
      
      // Set individual form values to ensure they're applied
      setValue("hospitalName", providerData.hospitalName || "");
      setValue("email", providerData.email || "");
      setValue("hospitalAdress", providerData.hospitalAdress || "");
      setValue("phoneNumber", providerData.phoneNumber || "");
      setValue("accountNumber", providerData.accountNumber || "");
      setValue("accountName", providerData.accountName || "");
      setValue("accountType", providerData.accountType || "");
      setValue("bankVeririfationNumber", providerData.bankVeririfationNumber || "");
      setValue("stateLicenseNumber", providerData.stateLicenseNumber || "");
      setValue("licenseExpiryDate", providerData.licenseExpiryDate || "");
      setValue("geoLocation", providerData.geoLocation || "");
      
      // Set bank values
      const foundBank = banks.find(bank => bank.name === providerData.bankName);
      if (foundBank) {
        setValue("bankId", foundBank.id.toString());
        setValue("bankName", providerData.bankName || "");
        setValue("bankCode", providerData.bankCode || "");
      }

      // Set contacts
      if (providerData.contacts && providerData.contacts.length > 0) {
        providerData.contacts.forEach((contact, index) => {
          setValue(`contacts.${index}.name`, contact.name || "");
          setValue(`contacts.${index}.email`, contact.email || "");
          setValue(`contacts.${index}.designation`, contact.designation || "");
          setValue(`contacts.${index}.phoneNumber`, contact.phoneNumber || "");
        });
      }

      console.log("Individual form values set");
    }
  }, [providerData, isLoading, setValue, banks]);

  // Debug: Log current form values after reset
  useEffect(() => {
    if (!isLoading && providerData) {
      console.log("Final form values check:");
      console.log("hospitalName:", watch("hospitalName"));
      console.log("email:", watch("email"));
      console.log("contacts:", watch("contacts"));
    }
  }, [isLoading, providerData, watch]);

  // Add this useEffect to debug form structure
useEffect(() => {
  const subscription = watch((value) => {
    console.log("Current form values:", value);
    console.log("Contacts structure:", value.contacts);
  });
  return () => subscription.unsubscribe();
}, [watch]);

const handleUpdateProvider = async (formData: any) => {
  if (!id || !user?.hmoId) {
    throw new Error("Missing required information for update");
  }

  console.log("Raw form data:", formData);

  // Clean up contacts array
  const cleanContacts = Array.isArray(formData.contacts) 
    ? formData.contacts
        .filter((contact: any) => 
          contact && 
          (contact.name?.trim() || 
           contact.designation?.trim() || 
           contact.email?.trim() || 
           contact.phoneNumber?.trim())
        )
        .map((contact: any) => ({
          name: contact.name?.trim() || "",
          designation: contact.designation?.trim() || "",
          email: contact.email?.trim() || "",
          phoneNumber: contact.phoneNumber?.trim() || ""
        }))
    : [];

  // Remove duplicate contacts
  const uniqueContacts = cleanContacts.filter((contact, index, self) =>
    index === self.findIndex((c) => 
      c.name === contact.name && c.email === contact.email
    )
  );

  const providerUpdateData = {
    hospitalName: formData.hospitalName?.trim() || "",
    email: formData.email?.trim() || "",
    hospitalAdress: formData.hospitalAdress?.trim() || "",
    phoneNumber: formData.phoneNumber?.trim() || "",
    bankName: formData.bankName?.trim() || "",
    bankCode: formData.bankCode?.trim() || "",
    accountNumber: formData.accountNumber?.trim() || "",
    accountName: formData.accountName?.trim() || "",
    accountType: formData.accountType || "",
    bankVeririfationNumber: formData.bankVeririfationNumber?.trim() || "",
    stateLicenseNumber: formData.stateLicenseNumber?.trim() || "",
    licenseExpiryDate: formData.licenseExpiryDate || "",
    geoLocation: formData.geoLocation?.trim() || "",
    contacts: uniqueContacts,
    hmoId: user.hmoId,
  };

  if ((providerUpdateData as any).bankId) {
    delete (providerUpdateData as any).bankId;
  }

  console.log("=== FINAL CLEANED PAYLOAD ===", providerUpdateData);
  console.log("Payload keys:", Object.keys(providerUpdateData));

  try {
    const result = await dispatch(updateProvider({
      id,
      providerData: providerUpdateData
    })).unwrap();

    console.log("Update successful:", result);
    return result;
  } catch (error: any) {
    console.error("Update failed:", error);
    
    // Log detailed error information
    if (error.response) {
      console.error("API Error Details:", error.response.data);
      console.error("API Error Status:", error.response.status);
    }
    
    throw error;
  }
};

  const onSubmit = async (data: any) => {
    setSubmitError(null);
    try {
      // Check if user has hmoId
      if (!user?.hmoId) {
        setSubmitError("User authentication error. Please log in again.");
        return;
      }

      if (!id) {
        setSubmitError("Provider ID is missing");
        return;
      }

      console.log("Submitting update data:", data);
      
      await handleUpdateProvider(data);

      setShowSuccessModal(true);
    } catch (error: any) {
      setSubmitError(error.message || "Failed to update provider");
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

  useEffect(() => {
    dispatch(fetchBanks());
  }, [dispatch]);

  const backNavigation = () => {
    navigate("/enrollee/enrollees");
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

  const isSubmittingForm = isSubmitting || creating || loading;

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

        {/* Show provider info when loaded */}
        {providerData && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-md">
            <p className="text-green-700 font-semibold">
              Editing: {providerData.hospitalName}
            </p>
            <p className="text-green-600 text-sm">
              Email: {providerData.email} | Phone: {providerData.phoneNumber}
            </p>
          </div>
        )}

        {/* Error Display */}
        {(submitError || createError || error) && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-600 text-sm">{submitError || createError || error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6">
          {step === "provider" && (
            <div>
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
                    {isSubmittingForm ? "Updating..." : "Update Provider"}
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
        title="Provider Updated Successfully"
        message="The provider has been successfully updated in the system."
      />
    </>
  );
};

export default EditProvider;