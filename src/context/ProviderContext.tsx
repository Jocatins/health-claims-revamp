import React, { useEffect, useMemo, useState } from 'react';
import { useGetProvidersQuery } from '../services/slices/providerSlice';
import { ProviderContext } from './ProviderContextBase';
import type { Provider } from '../types/Provider';

// Types moved to base file for context export.

export const ProviderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // TTL for provider list cache (ms). 30 minutes.
  const CACHE_TTL = 30 * 60 * 1000;

  // Load cached providers from localStorage if fresh
  const initialProviders: Provider[] = (() => {
    try {
      const raw = localStorage.getItem('providersCache');
      if (!raw) return [];
      const parsed = JSON.parse(raw) as { timestamp: number; data: Provider[] };
      if (Date.now() - parsed.timestamp < CACHE_TTL) {
        return Array.isArray(parsed.data) ? parsed.data : [];
      }
  } catch { /* ignore parse errors */ }
    return [];
  })();

  const [cachedProviders, setCachedProviders] = useState<Provider[]>(initialProviders);
  const shouldSkipQuery = cachedProviders.length > 0; // skip network if we have fresh cache
  // Always request up to 100 providers (paging support added)
  const { data, isLoading, error } = useGetProvidersQuery({ pageSize: 100, pageNumber: 1 }, { skip: shouldSkipQuery });

  // Merge: prefer cached list until new network data arrives
  const providers = useMemo<Provider[]>(() => {
    if (data?.data) return data.data;
    return cachedProviders;
  }, [data, cachedProviders]);

  const [selectedProviderId, setSelectedProviderId] = useState<string | null>(() => {
    return localStorage.getItem('selectedProviderId');
  });

  // Auto select first provider once loaded if none chosen
  useEffect(() => {
    if (!selectedProviderId && providers.length > 0) {
      setSelectedProviderId(providers[0].id);
    }
  }, [providers, selectedProviderId]);

  // Persist selection
  useEffect(() => {
    if (selectedProviderId) {
      localStorage.setItem('selectedProviderId', selectedProviderId);
    } else {
      localStorage.removeItem('selectedProviderId');
    }
  }, [selectedProviderId]);

  // Persist providers to cache when network fetch completes
  useEffect(() => {
    if (data?.data) {
      setCachedProviders(data.data);
      try {
        localStorage.setItem('providersCache', JSON.stringify({ timestamp: Date.now(), data: data.data }));
  } catch { /* ignore quota errors */ }
    }
  }, [data]);

  return (
    <ProviderContext.Provider value={{
      providers,
      selectedProviderId,
      setSelectedProviderId,
      loading: shouldSkipQuery ? false : isLoading,
      error: error ? ('status' in error ? `Error ${error.status}` : 'Failed to load providers') : null
    }}>
      {children}
    </ProviderContext.Provider>
  );
};

// Hook moved to separate file to improve Fast Refresh behavior.
