export function formatLocalDateInput(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function formatDateInputFromUtcValue(value: Date | string): string {
  const date = value instanceof Date ? value : new Date(value);
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}-${String(date.getUTCDate()).padStart(2, "0")}`;
}

export function dateInputToUtcIso(value: string): string {
  return `${value}T00:00:00.000Z`;
}

export function isValidDateInput(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(dateInputToUtcIso(value));
  return !Number.isNaN(date.getTime()) && date.toISOString().startsWith(value);
}
