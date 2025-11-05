export const CLAIM_STATUSES = [
  'Pending',
  'Processed',
  'Rejected',
  'Resolved',
  'Approved',
  'Paid'
] as const;

export type ClaimStatus = typeof CLAIM_STATUSES[number];

export const CLAIM_STATUS_COLORS: Record<ClaimStatus,string> = {
  Pending: '#ff9800',
  Processed: '#1976d2',
  Rejected: '#d32f2f',
  Resolved: '#2e7d32',
  Approved: '#217346',
  Paid: '#6b6f80'
};
