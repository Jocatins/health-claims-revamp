import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { providerSchema, type ProviderFormData } from "../schemas/providerSchema";
import type { AppDispatch, RootState } from "../services/store/store";
import { useDispatch, useSelector } from "react-redux";
import { createProvider } from "../services/thunks/iProviderThunk";

export const useProviderForm = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const methods = useForm<ProviderFormData>({
    resolver: zodResolver(providerSchema),
    mode: "onChange",
    defaultValues: {
      contacts: [{
        name: "",
        designation: "",
        email: "",
        phoneNumber: ""
      }]
    },
  });

  const handleFormSubmit = methods.handleSubmit(async (data) => {
    try {
      console.log("Form submitted:", data);
      if (!user?.hmoId) {
        throw new Error("HMO ID is required. Please ensure you are logged in.");
      }

      const providerData = {
        ...data,
        hmoId: user.hmoId,
        licenseExpiryDate: data.licenseExpiryDate || new Date().toISOString(),
      };
      const result = await dispatch(createProvider(providerData)).unwrap();

      console.log("Provider created successfully:", result);
    } catch (error) {
      console.error("Submission error:", error);
    }
  });

  return {
    methods,
    handleFormSubmit,
    isSubmitting: methods.formState.isSubmitting,
  };
};