import { useState, useCallback, useEffect } from "react";
import { WorkerSchema } from "@/api/schemas/worker-schema";
import { WorkerService } from "@/presentation/api-clients/worker.service";

export function useWorkers() {
  const [workers, setWorkers] = useState<WorkerSchema[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const list = useCallback(async (page: number = 1, limit: number = 100) => {
    setLoading(true);
    setError(null);
    try {
      const response = await WorkerService.getAll(page, limit);
      setWorkers(response.workers || []);
      return response.workers || [];
    } catch (err) {
      const message = (err as Error).message;
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void list();
  }, [list]);

  return { list, workers, loading, error };
}
