import { useState, useEffect } from "react";
import { fetchEnrolleeType } from "../../services/api/resourcesApi";

export const useEnrolleeTypes = () => {
  const [enrolleeTypes, setEnrolleeTypes] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadEnrolleeTypes = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchEnrolleeType();
        setEnrolleeTypes(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    loadEnrolleeTypes();
  }, []);

  return { enrolleeTypes, loading, error };
};
