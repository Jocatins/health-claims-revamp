import { z } from "zod";
import { AccountType } from "../utils/accountTypeUtils";

export const providerSchema = z.object({
  hospitalName: z.string().min(1, "Hospital name is required"),
  email: z.string().email("Invalid email address"),
  hospitalAdress: z.string().min(1, "Hospital address is required"),
  phoneNumber: z.string().min(1, "Phone number is required"),
    bankId: z.string().min(1, "Bank is required"), // New field for bank ID
  bankName: z.string().min(1, "Bank name is required"), // Keep for display/API
  bankCode: z.string().min(1, "Bank code is required"),
  accountNumber: z
    .string()
    .min(1, "Account number is required")
    .regex(/^\d{10}$/, "Account number must be exactly 10 digits"),
  // bankCode: z.string().min(1, "Bank code is required"),
  accountName: z.string().min(1, "Account name is required"),
 accountType: z
    .string()
    .min(1, "Account type is required")
    .refine(
      (val) => Object.values(AccountType).includes(val as AccountType),
      "Please select a valid account type"
    ),

  bankVeririfationNumber: z
    .string()
    .min(1, "BVN is required")
    .regex(/^\d{11}$/, "BVN must be exactly 11 digits"),
  stateLicenseNumber: z.string().min(1, "State license number is required"),
  licenseExpiryDate: z.string().min(1, "License expiry date is required"),
  geoLocation: z.string().min(1, "Geo location is required"),
  contacts: z
    .array(
      z.object({
        name: z.string().min(1, "Contact name is required"),
        designation: z.string().min(1, "Designation is required"),
        email: z.string().email("Invalid contact email"),
        phoneNumber: z.string().min(1, "Contact phone number is required"),
      })
    )
    .min(1, "At least one contact is required"),
});

export type ProviderFormData = z.infer<typeof providerSchema>;