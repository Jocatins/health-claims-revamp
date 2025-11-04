export interface ServiceItem {
  name: string;
  approvalCode: string;
  amount: string;
}

export interface LocalStorageClaim {
   id: string;
  claimName: string;
  providerId: string;
  hmoId: string;
  claimDate: string;
  patientName: string;
  phoneNumber: string;
  serviceDate: string;
  serviceType: string;
  items: ServiceItem[];
  submittedAt: string;
  status: 'pending' | 'processed' | 'rejected';
}


export const CLAIMS_STORAGE_KEY = 'nemsas_claims';

export const saveClaimToLocalStorage = (claimData: Omit<LocalStorageClaim, 'id' | 'submittedAt' | 'status'>): void => {
  try {
    const existingClaims = getClaimsFromLocalStorage();
    
    const newClaim: LocalStorageClaim = {
      ...claimData,
      id: generateId(),
      submittedAt: new Date().toISOString(),
      status: 'pending'
    };

    const updatedClaims = [...existingClaims, newClaim];
    localStorage.setItem(CLAIMS_STORAGE_KEY, JSON.stringify(updatedClaims));
    
    console.log('Claim saved to local storage:', newClaim);
  } catch (error) {
    console.error('Error saving claim to local storage:', error);
    throw new Error('Failed to save claim locally');
  }
};

export const getClaimsFromLocalStorage = (): LocalStorageClaim[] => {
  try {
    const claims = localStorage.getItem(CLAIMS_STORAGE_KEY);
    return claims ? JSON.parse(claims) : [];
  } catch (error) {
    console.error('Error reading claims from local storage:', error);
    return [];
  }
};

export const clearClaimsFromLocalStorage = (): void => {
  try {
    localStorage.removeItem(CLAIMS_STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing claims from local storage:', error);
  }
};

const generateId = (): string => {
  return `claim_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};