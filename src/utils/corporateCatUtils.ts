export const CorporateCategory = {
  Bank: "Bank",
  NGO: "NGO",
  Church: "Church",
  Agency: "Agency",
} as const;

export type CorporateCategory = (typeof CorporateCategory)[keyof typeof CorporateCategory];

// Dropdown options
export const corporateCategoryOptions = Object.values(CorporateCategory).map(value => ({
  value,
  label: value,
}));