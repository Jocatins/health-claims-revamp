// src/hooks/useCorporates.ts
import { useEffect, useState, useCallback } from "react";
import { fetchCorporates } from "../services/api/corporateApi"; 
import type { ICorporateEnrollee } from "../types/Corporate";

export function useCorporates() {
  const [corporates, setCorporate] = useState<ICorporateEnrollee[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const corporates = await fetchCorporates();
      setCorporate(corporates);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load corporates");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return {
    corporates,
    loading,
    error,
    refetch: load, 
  };
}
