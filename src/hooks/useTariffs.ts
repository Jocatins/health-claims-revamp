import { useCallback, useEffect, useRef, useState } from 'react';
import { fetchTariffs } from '../services/api/tariffApi';
import type { TariffListResponse, TariffQueryArgs } from '../types/Tariff';

interface UseTariffsReturn {
  data: TariffListResponse | undefined;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useTariffs = (args: TariffQueryArgs | null): UseTariffsReturn => {
  const [data, setData] = useState<TariffListResponse>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const refetchIndex = useRef(0);

  const refetch = useCallback(() => {
    refetchIndex.current++;
    // trigger effect by updating dummy state via setData? Instead rely on args + refetchIndex
    setError(null);
  }, []);

  useEffect(() => {
    if (!args) return; // skip until ready
    let cancelled = false;
    const run = async () => {
      setLoading(true);
      try {
        const res = await fetchTariffs(args);
        if (!cancelled) setData(res);
      } catch (e) {
        if (!cancelled) {
          if (e instanceof Error) setError(e.message);
          else setError('Failed to load tariffs');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    run();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(args), refetchIndex.current]);

  return { data, loading, error, refetch };
};
