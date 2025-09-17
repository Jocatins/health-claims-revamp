import { useContext } from 'react';
import { ProviderContext } from './ProviderContextBase';

export const useProviderContext = () => {
  const ctx = useContext(ProviderContext);
  if (!ctx) throw new Error('useProviderContext must be used within ProviderProvider');
  return ctx;
};
