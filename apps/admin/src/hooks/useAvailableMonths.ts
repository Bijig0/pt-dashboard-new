import { useState, useEffect, useCallback } from "react";
import { getEndOfMonthsAsync } from "../pages/services/getEndOfMonths";

type UseAvailableMonthsResult = {
  months: Date[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
};

export function useAvailableMonths(): UseAvailableMonthsResult {
  const [months, setMonths] = useState<Date[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchMonths = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getEndOfMonthsAsync();
      setMonths(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to fetch months"));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMonths();
  }, [fetchMonths]);

  return {
    months,
    isLoading,
    error,
    refetch: fetchMonths,
  };
}
