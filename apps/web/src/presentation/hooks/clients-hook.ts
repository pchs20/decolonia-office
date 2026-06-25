import { useState, useCallback, useEffect } from "react";
import { ClientSchema } from "@/api/schemas/client-schema";
import { ClientService } from "@/presentation/api-clients/client.service";

export function useClients() {
  const [clients, setClients] = useState<ClientSchema[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const list = useCallback(async (page: number = 1, limit: number = 100) => {
    setLoading(true);
    setError(null);
    try {
      const response = await ClientService.getAll(page, limit);
      setClients(response.clients || []);
      return response.clients || [];
    } catch (err) {
      const message = (err as Error).message;
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    list();
  }, [list]);

  return { list, clients, loading, error };
}
