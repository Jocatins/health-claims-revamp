import { useEffect, useState } from "react";
import { fetchRelationships } from "../../services/api/resourcesApi";
import { formatApiError } from "../../utils/errorFormatter";

export const useRelationship = () => {
  const [relations, setRelations] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadGenders = async () => {
      try {
        setLoading(true);
        const data = await fetchRelationships();
        setRelations(data);
      } catch (err) {
       setError(formatApiError(err));
      } finally {
        setLoading(false);
      }
    };

    loadGenders();
  }, []);

  return { relations, loading, error };
};
