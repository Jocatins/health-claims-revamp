import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  providerEditSchema,
  type ProviderEditFormData,
} from "../schemas/providerSchema";

export const useProviderEditForm = () => {
  const methods = useForm<ProviderEditFormData>({
    resolver: zodResolver(providerEditSchema),
    mode: "onChange",
    defaultValues: {
      hospitalName: "",
      email: "",
      hospitalAdress: "",
      phoneNumber: "",

      bankName: "",
      bankCode: "",
      accountNumber: "",
      accountName: "",
      accountType: "",
      bankVeririfationNumber: "",
      stateLicenseNumber: "",
      licenseExpiryDate: "",

      geoLocation: "",
      contactName: "",
      contactDesignation: "",
      contactEmail: "",
      contactPhone: "",
    },
  });

  return {
    methods,
    isSubmitting: methods.formState.isSubmitting,
  };
};
