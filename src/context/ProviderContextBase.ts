import { createContext } from 'react';
import type { Provider } from '../types/Provider';

export interface ProviderContextValue {
  providers: Provider[];
  selectedProviderId: string | null;
  setSelectedProviderId: (id: string | null) => void;
  loading: boolean;
  error: string | null;
}

export const ProviderContext = createContext<ProviderContextValue | undefined>(undefined);
