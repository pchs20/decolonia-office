"use client";

import { useEffect, useState } from "react";
import { Download, RefreshCw } from "lucide-react";
import { useTranslation } from "react-i18next";

interface SyncResult {
  nextCursor: number | null;
  processed: number;
  skipped: number;
  skippedCount: number;
  remaining: number;
  uploadedDocuments: { type: string; path: string }[];
  failures: { documentType: string; documentId: string; message: string }[];
}

export function BackupExportPanel() {
  const { t } = useTranslation();
  const [syncing, setSyncing] = useState(false);
  const [checkingAuthorization, setCheckingAuthorization] = useState(true);
  const [driveAuthorized, setDriveAuthorized] = useState(false);
  const [progress, setProgress] = useState<SyncResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/backup/cloud/status")
      .then((response) => response.json())
      .then((body) => setDriveAuthorized(body.authorized === true))
      .catch(() => setDriveAuthorized(false))
      .finally(() => setCheckingAuthorization(false));
  }, []);

  async function syncToDrive() {
    setSyncing(true);
    setError(null);
    setProgress(null);

    try {
      let cursor = 0;
      let latest: SyncResult = {
        nextCursor: null,
        processed: 0,
        skipped: 0,
        skippedCount: 0,
        remaining: 0,
        uploadedDocuments: [],
        failures: []
      };

      do {
        const response = await fetch("/api/backup/cloud", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ cursor, batchSize: 5 })
        });
        const body = await response.json();
        if (!response.ok) {
          throw new Error(body.message ?? t("catalog.backup.errors.syncFailed"));
        }

        latest = {
          nextCursor: body.nextCursor,
          processed: (latest.processed ?? 0) + body.processed,
          skipped: (latest.skipped ?? 0) + body.skipped,
          skippedCount: (latest.skippedCount ?? 0) + body.skippedCount,
          remaining: body.remaining,
          uploadedDocuments: [...(latest.uploadedDocuments ?? []), ...(body.uploadedDocuments ?? [])],
          failures: [...latest.failures, ...body.failures]
        };
        setProgress(latest);
        cursor = body.nextCursor ?? 0;
      } while (latest.nextCursor !== null);
    } catch (syncError) {
      setError(syncError instanceof Error ? syncError.message : t("catalog.backup.errors.syncFailed"));
    } finally {
      setSyncing(false);
    }
  }

  function downloadBackup() {
    window.location.assign("/api/backup/download");
  }

  function authorizeDrive() {
    window.location.assign("/api/backup/cloud/authorize");
  }

  return (
    <section className="space-y-6" aria-labelledby="backup-export-title">
      <div>
        <h2 id="backup-export-title" className="text-xl font-semibold text-gray-800">
          {t("catalog.backup.title")}
        </h2>
        <p className="mt-1 text-sm text-gray-600">{t("catalog.backup.description")}</p>
      </div>

      <div className="flex flex-wrap gap-3">
        {!checkingAuthorization && (driveAuthorized ? <button
          type="button"
          onClick={syncToDrive}
          disabled={syncing}
          className="inline-flex items-center gap-2 rounded bg-settings px-4 py-2 text-sm font-medium text-white hover:bg-settings/90 disabled:cursor-not-allowed disabled:bg-gray-400"
        >
          <RefreshCw className={syncing ? "h-4 w-4 animate-spin" : "h-4 w-4"} aria-hidden="true" />
          {syncing ? t("catalog.backup.syncing") : t("catalog.backup.syncButton")}
        </button> : <button
          type="button"
          onClick={authorizeDrive}
          disabled={syncing}
          className="inline-flex items-center gap-2 rounded bg-settings px-4 py-2 text-sm font-medium text-white hover:bg-settings/90 disabled:cursor-not-allowed disabled:bg-gray-400"
        >
          {t("catalog.backup.authorizeButton")}
        </button>)}
        <button
          type="button"
          onClick={downloadBackup}
          disabled={syncing}
          className="inline-flex items-center gap-2 rounded bg-settings px-4 py-2 text-sm font-medium text-white hover:bg-settings/90 disabled:cursor-not-allowed disabled:bg-gray-400"
        >
          <Download className="h-4 w-4" aria-hidden="true" />
          {t("catalog.backup.downloadButton")}
        </button>
      </div>

      {progress && !syncing && (
        <div className="space-y-4">
          <p className="text-sm text-green-700" role="status">
            ✅ {t("catalog.backup.syncCompleted", {
              uploaded: progress.uploadedDocuments.length,
              skipped: progress.skippedCount,
              failed: progress.failures.length
            })}
          </p>
          {progress.uploadedDocuments.length > 0 && (
            <div className="rounded border border-green-200 bg-green-50 p-3">
              <p className="text-sm font-medium text-green-800">{t("catalog.backup.uploadedDocuments")}</p>
              <ul className="mt-2 list-disc pl-5 text-sm text-green-700">
                {progress.uploadedDocuments.map((doc, index) => (
                  <li key={index}>{doc.path}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
      {progress && syncing && (
        <p className="text-sm text-gray-700" role="status">
          {t("catalog.backup.inProgress", { remaining: progress.remaining })}
        </p>
      )}
      {error && <p className="text-sm text-red-700" role="alert">{error}</p>}
      {progress && progress.failures.length > 0 && (
        <div className="rounded border border-red-200 bg-red-50 p-3 text-sm text-red-800">
          <p className="font-medium">{t("catalog.backup.failedDocuments")}</p>
          <ul className="mt-2 list-disc pl-5">
            {progress.failures.map((failure) => (
              <li key={`${failure.documentType}-${failure.documentId}`}>
                {failure.documentType}: {failure.documentId} - {failure.message}
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
