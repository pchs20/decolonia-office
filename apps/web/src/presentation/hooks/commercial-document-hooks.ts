// React hooks for API interactions
import { useState, useCallback } from "react";
import { BudgetCreateRequest } from "@/api/schemas/budget-schemas";
import { InvoiceCreateRequest } from "@/api/schemas/invoice-schemas";
import { BudgetService } from "@/presentation/api-clients/budget.service";
import { InvoiceService } from "@/presentation/api-clients/invoice.service";
import { TaxService } from "@/presentation/api-clients/tax.service";

export function useBudgets() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const create = useCallback(async (data: BudgetCreateRequest) => {
    setLoading(true);
    setError(null);
    try {
      return await BudgetService.create(data);
    } catch (err) {
      setError((err as Error).message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const list = useCallback(async (page: number = 1, limit: number = 20, clientId?: string, search?: string) => {
    setLoading(true);
    setError(null);
    try {
      return await BudgetService.getAll(page, limit, clientId, search);
    } catch (err) {
      setError((err as Error).message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { create, list, loading, error };
}

export function useInvoices() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const create = useCallback(async (data: InvoiceCreateRequest) => {
    setLoading(true);
    setError(null);
    try {
      return await InvoiceService.create(data);
    } catch (err) {
      setError((err as Error).message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const list = useCallback(async (page: number = 1, limit: number = 20, clientId?: string, year?: number, search?: string) => {
    setLoading(true);
    setError(null);
    try {
      return await InvoiceService.getAll(page, limit, clientId, year, search);
    } catch (err) {
      setError((err as Error).message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { create, list, loading, error };
}

export function useTaxes() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const list = useCallback(async (page: number = 1, limit: number = 20, includeInactive: boolean = false) => {
    setLoading(true);
    setError(null);
    try {
      return await TaxService.getAll(page, limit, includeInactive);
    } catch (err) {
      setError((err as Error).message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { list, loading, error };
}
