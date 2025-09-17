import { useEffect, useState } from "react";
import { fetchMaritalStatus } from "../../services/api/resourcesApi";
import { formatApiError } from "../../utils/errorFormatter";

export const useMaritalStatus = () => {
  const [statuses, setStatuses] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadStatuses = async () => {
      try {
        setLoading(true);
        const data = await fetchMaritalStatus();
        setStatuses(data);
      } catch (err) {
        setError(formatApiError(err));
      } finally {
        setLoading(false);
      }
    };

    loadStatuses();
  }, []);

  return { statuses, loading, error };
};
