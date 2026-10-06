export async function downloadResponse(response: Response, filename: string): Promise<void> {
  if (!response.ok) {
    throw new Error("Download request failed");
  }

  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;

  try {
    anchor.click();
  } finally {
    URL.revokeObjectURL(url);
  }
}

export function downloadFilename(contentDisposition: string | null, fallback: string): string {
  const match = contentDisposition?.match(/filename="([^"]+)"/i);
  return match?.[1] ?? fallback;
}
