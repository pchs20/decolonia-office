"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { WorkerSchema } from "@/api/schemas/worker-schema";
import { WorkerService } from "@/presentation/api-clients/worker.service";
import { WorkerForm } from "@/presentation/components/workers/WorkerForm";

interface WorkerDetailPageProps {
  workerId: string;
  startInEditMode?: boolean;
}

export function WorkerDetailPage({ workerId, startInEditMode = false }: WorkerDetailPageProps) {
  const router = useRouter();
  const [worker, setWorker] = useState<WorkerSchema | null>(null);
  const [editing, setEditing] = useState(startInEditMode);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchWorker();
  }, [workerId]);

  const fetchWorker = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await WorkerService.getById(workerId);
      setWorker(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch worker");
    } finally {
      setLoading(false);
    }
  };

  const handleSuccess = (updatedWorker: WorkerSchema) => {
    setWorker(updatedWorker);
    setEditing(false);
    setHasUnsavedChanges(false);
    setSuccessMessage(`Worker ${updatedWorker.name} updated successfully`);
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const confirmDiscardChanges = (): boolean => {
    if (!hasUnsavedChanges) {
      return true;
    }

    return window.confirm("You have unsaved changes. Discard them and leave edit mode?");
  };

  const handleBackFromEdit = () => {
    if (!confirmDiscardChanges()) {
      return;
    }

    if (startInEditMode) {
      router.push(`/workers/${workerId}`);
      return;
    }

    setHasUnsavedChanges(false);
    setEditing(false);
  };

  const handleCancelEdit = () => {
    if (startInEditMode) {
      router.push(`/workers/${workerId}`);
      return;
    }
    setHasUnsavedChanges(false);
    setEditing(false);
  };

  if (loading) {
    return <div className="p-6 text-center">Loading...</div>;
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="p-3 bg-red-100 text-red-700 rounded">{error}</div>
        <Link href="/workers" className="mt-4 inline-block text-blue-600">
          Back to Workers
        </Link>
      </div>
    );
  }

  if (!worker) {
    return (
      <div className="p-6">
        <div>Worker not found</div>
        <Link href="/workers" className="mt-4 inline-block text-blue-600">
          Back to Workers
        </Link>
      </div>
    );
  }

  if (editing) {
    return (
      <div className="p-6">
        <button type="button" onClick={handleBackFromEdit} className="text-blue-600 mb-4 inline-block">
          ← Back
        </button>
        <WorkerForm
          worker={worker}
          onSuccess={handleSuccess}
          onCancel={handleCancelEdit}
          onDirtyChange={setHasUnsavedChanges}
        />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-start mb-6">
        <Link href="/workers" className="text-blue-600">
          ← Back to Workers
        </Link>
        <button
          onClick={() => setEditing(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Edit
        </button>
      </div>

      {successMessage && <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">{successMessage}</div>}

      <div className="bg-white rounded-lg border p-6 max-w-2xl">
        <h1 className="text-3xl font-bold mb-6">{worker.name}</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Tax ID</label>
            <p className="text-lg">{worker.taxId}</p>
          </div>

          {worker.phone && (
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Phone</label>
              <p className="text-lg">
                <a href={`tel:${worker.phone}`} className="text-blue-600 hover:underline">
                  {worker.phone}
                </a>
              </p>
            </div>
          )}

          {worker.email && (
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
              <p className="text-lg">
                <a href={`mailto:${worker.email}`} className="text-blue-600 hover:underline">
                  {worker.email}
                </a>
              </p>
            </div>
          )}

          <div className="md:col-span-2 pt-2">
            <h2 className="text-sm font-semibold text-gray-700">Address</h2>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-600 mb-1">Work Address</label>
            <p className="text-lg">{worker.street}</p>
            <p className="text-sm text-gray-600">
              {worker.city} {worker.postalCode}
            </p>
          </div>

          {worker.billingStreet &&
            worker.billingCity &&
            worker.billingPostalCode && (
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-600 mb-1">Billing Address</label>
                <p className="text-lg">{worker.billingStreet}</p>
                <p className="text-sm text-gray-600">
                  {worker.billingCity} {worker.billingPostalCode}
                </p>
              </div>
            )}

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Created</label>
            <p className="text-sm text-gray-600">{new Date(worker.createdAt).toLocaleDateString()}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Last Updated</label>
            <p className="text-sm text-gray-600">{new Date(worker.updatedAt).toLocaleDateString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
