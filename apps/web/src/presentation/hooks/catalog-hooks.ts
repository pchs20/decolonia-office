import { useState, useCallback } from "react";
import { TaxCreateRequest, TaxUpdateRequest } from "@/api/schemas/tax-schemas";
import { TaxResponse } from "@/api/schemas/tax-schemas";
import { WorkTemplateCreateRequest, WorkTemplateUpdateRequest } from "@/api/schemas/work-template-schemas";
import { WorkTemplateResponse } from "@/api/schemas/work-template-schemas";
import { CommercialDocumentSettingsResponse } from "@/api/schemas/commercial-document-settings-schemas";
import { TaxService } from "@/presentation/api-clients/tax.service";
import { WorkTemplateService } from "@/presentation/api-clients/work-template.service";
import { CommercialDocumentSettingsService } from "@/presentation/api-clients/commercial-document-settings.service";

export function useTaxesList() {
  const [taxes, setTaxes] = useState<TaxResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getAll = useCallback(async (page: number = 1, limit: number = 100, includeInactive: boolean = false) => {
    setLoading(true);
    setError(null);
    try {
      const response = await TaxService.getAll(page, limit, includeInactive);
      setTaxes(response.taxes || []);
      return response.taxes || [];
    } catch (err) {
      const message = (err as Error).message;
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const create = useCallback(async (data: TaxCreateRequest) => {
    setLoading(true);
    setError(null);
    try {
      const created = await TaxService.create(data);
      setTaxes(prev => [created, ...prev]);
      return created;
    } catch (err) {
      const message = (err as Error).message;
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const update = useCallback(async (id: string, data: TaxUpdateRequest) => {
    setLoading(true);
    setError(null);
    try {
      const updated = await TaxService.update(id, data);
      setTaxes(prev => prev.map(t => t.id === id ? updated : t));
      return updated;
    } catch (err) {
      const message = (err as Error).message;
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const toggleActive = useCallback(async (id: string, isActive: boolean) => {
    setLoading(true);
    setError(null);
    try {
      const updated = await TaxService.toggleActive(id, isActive);
      setTaxes(prev => prev.map(t => t.id === id ? updated : t));
      return updated;
    } catch (err) {
      const message = (err as Error).message;
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { getAll, create, update, toggleActive, taxes, loading, error };
}

export function useWorkTemplatesList() {
  const [templates, setTemplates] = useState<WorkTemplateResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getAll = useCallback(async (page: number = 1, limit: number = 100, includeInactive: boolean = false) => {
    setLoading(true);
    setError(null);
    try {
      const response = await WorkTemplateService.getAll(page, limit, includeInactive);
      setTemplates(response.templates || []);
      return response.templates || [];
    } catch (err) {
      const message = (err as Error).message;
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const create = useCallback(async (data: WorkTemplateCreateRequest) => {
    setLoading(true);
    setError(null);
    try {
      const created = await WorkTemplateService.create(data);
      setTemplates(prev => [created, ...prev]);
      return created;
    } catch (err) {
      const message = (err as Error).message;
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const update = useCallback(async (id: string, data: WorkTemplateUpdateRequest) => {
    setLoading(true);
    setError(null);
    try {
      const updated = await WorkTemplateService.update(id, data);
      setTemplates(prev => prev.map(t => t.id === id ? updated : t));
      return updated;
    } catch (err) {
      const message = (err as Error).message;
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const toggleActive = useCallback(async (id: string, isActive: boolean) => {
    setLoading(true);
    setError(null);
    try {
      const updated = await WorkTemplateService.toggleActive(id, isActive);
      setTemplates(prev => prev.map(t => t.id === id ? updated : t));
      return updated;
    } catch (err) {
      const message = (err as Error).message;
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { getAll, create, update, toggleActive, templates, loading, error };
}

export function useCommercialDocumentSettings() {
  const [settings, setSettings] = useState<CommercialDocumentSettingsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const get = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await CommercialDocumentSettingsService.get();
      setSettings(response);
      return response;
    } catch (err) {
      const message = (err as Error).message;
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const update = useCallback(async (defaults: {
    defaultBudgetPricingMode: "computed" | "manual-subtotal";
    defaultInvoicePricingMode: "computed" | "manual-subtotal";
  }) => {
    setLoading(true);
    setError(null);
    try {
      const response = await CommercialDocumentSettingsService.update(defaults);
      setSettings(response);
      return response;
    } catch (err) {
      const message = (err as Error).message;
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { settings, loading, error, get, update };
}
