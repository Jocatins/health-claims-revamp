import { useState, useEffect } from "react";
import { fetchEnrolleeType } from "../../services/api/resourcesApi";

export const useEnrolleeTypes = () => {
  const [enrolleeTypes, setEnrolleeTypes] = useState<{id: string, name: string}[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadEnrolleeTypes = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchEnrolleeType();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setEnrolleeTypes(data.map((item: any) => ({
          id: item.id, 
          name: item.name
        })));
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
