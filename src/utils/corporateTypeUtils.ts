export const CorporateType = {
  Employer: "Employer",
  TPA: "TPA",
  Sponsor: "Sponsor",
} as const;

export type CorporateType = (typeof CorporateType)[keyof typeof CorporateType];

// Dropdown options
export const corporateTypeOptions = Object.values(CorporateType).map(value => ({
  value,
  label: value,
}));
