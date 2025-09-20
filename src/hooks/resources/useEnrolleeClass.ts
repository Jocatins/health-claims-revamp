import { useState, useEffect } from "react";
import { fetchEnrolleeClass } from "../../services/api/resourcesApi";

export const useEnrolleeClass = () => {
  const [enrolleeClass, setEnrolleeClass] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadEnrolleeClass = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchEnrolleeClass();
        setEnrolleeClass(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    loadEnrolleeClass();
  }, []);

  return { enrolleeClass, loading, error };
};
