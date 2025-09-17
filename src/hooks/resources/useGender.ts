import { useEffect, useState } from "react";
import { fetchGenders } from "../../services/api/resourcesApi";
import { formatApiError } from "../../utils/errorFormatter";

export const useGender = () => {
  const [genders, setGenders] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadGenders = async () => {
      try {
        setLoading(true);
        const data = await fetchGenders();
        setGenders(data);
      } catch (err) {
       setError(formatApiError(err));
      } finally {
        setLoading(false);
      }
    };

    loadGenders();
  }, []);

  return { genders, loading, error };
};
