import { useState, useEffect } from "react";
import { fetchPlanTypes } from "../../services/api/resourcesApi";

export const usePlanTypes = () => {
  const [planType, setPlanType] = useState<{id: string, name: string}[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPlanTypes = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchPlanTypes();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setPlanType(data.map((item: any) => ({
          id: item.id, 
          name: item.name
        })));
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    loadPlanTypes();
  }, []);

  return { planType, loading, error };
};
