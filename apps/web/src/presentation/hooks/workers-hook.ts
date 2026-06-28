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

  const setPrimary = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const worker = await WorkerService.setPrimary(id);
      return worker;
    } catch (err) {
      const message = (err as Error).message;
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const remove = useCallback(async (id: string) => {
    setError(null);
    try {
      await WorkerService.delete(id);
    } catch (err) {
      const message = (err as Error).message;
      setError(message);
      throw err;
    }
  }, []);

  return { list, workers, loading, error, setPrimary, remove };
}
