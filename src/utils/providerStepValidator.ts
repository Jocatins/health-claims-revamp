import { type UseFormTrigger } from "react-hook-form";

import type { ProviderStep } from "../types/Step";
import type { ProviderEditFormData } from "../schemas/providerSchema";

export const validateProviderStep = async (
  trigger: UseFormTrigger<ProviderEditFormData>,
  setStep: (step: ProviderStep) => void
) => {
  const firstStepFields = [
    "hospitalName",
    "email",
    "hospitalAdress",
    "phoneNumber",
    "bankId",
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
