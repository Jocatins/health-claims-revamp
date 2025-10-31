import { type UseFormTrigger } from "react-hook-form";

import type { ProviderStep } from "../types/Step";
import type { ProviderFormData } from "../schemas/providerSchema";

export const validateProviderStep = async (
  trigger: UseFormTrigger<ProviderFormData>,
  setStep: (step: ProviderStep) => void
) => {
  const firstStepFields = [
    "hospitalName",
    "email",
    "hospitalAdress",
    "phoneNumber",
    "bankName",
    "accountNumber",
    "bankCode",
    "accountName",
    "accountType",
    "bankVeririfationNumber",
    "stateLicenseNumber",
    "licenseExpiryDate",
    "geoLocation",
  ] as const;

  const isValid = await trigger(firstStepFields);

  if (isValid) {
    setStep("provider-contact");
  }
};
