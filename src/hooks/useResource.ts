import { useEffect, useState } from "react";
import { formatApiError } from "../utils/errorFormatter";

export const useResources = (
  fetchFns: Record<string, () => Promise<string[]>>
) => {
  const [data, setData] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadResources = async () => {
      try {
        setLoading(true);
        const entries = await Promise.all(
          Object.entries(fetchFns).map(async ([key, fn]) => {
            const result = await fn();
            return [key, result] as const;
          })
        );
        setData(Object.fromEntries(entries));
      } catch (err) {
        setError(formatApiError(err));
      } finally {
        setLoading(false);
      }
    };

    loadResources();
  }, [fetchFns]);

  return { data, loading, error };
};
