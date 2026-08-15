export interface DatePath {
  year: string;
  period: string;
}

export type DatePathValue = Date | string | null | undefined;

/** Returns a calendar year and storage period such as `{ year: "2026", period: "Q1" }`. */
export function getDatePath(value: DatePathValue): DatePath {
  const date = value instanceof Date ? value : new Date(String(value ?? 0));
  if (Number.isNaN(date.getTime())) {
    return { year: "unknown", period: "Q0" };
  }

  return {
    year: String(date.getUTCFullYear()),
    period: `Q${Math.floor(date.getUTCMonth() / 3) + 1}`
  };
}
