import { useState, useEffect } from "react";
import { fetchEnrolleeClass } from "../../services/api/resourcesApi";

export const useEnrolleeClass = () => {
  const [enrolleeClass, setEnrolleeClass] = useState<{id: string, name: string}[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadEnrolleeClass = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchEnrolleeClass();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setEnrolleeClass(data.map((item: any)=> ({
            id: item.id, 
          name: item.name
        })));
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
