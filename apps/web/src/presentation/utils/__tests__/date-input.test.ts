import {
  dateInputToUtcIso,
  formatDateInputFromUtcValue,
  formatLocalDateInput,
  isValidDateInput
} from "@/presentation/utils/date-input";

describe("date input helpers", () => {
  it("formats a local calendar date without timezone conversion", () => {
    expect(formatLocalDateInput(new Date(2026, 0, 5))).toBe("2026-01-05");
  });

  it("preserves a stored UTC-midnight business date", () => {
    expect(formatDateInputFromUtcValue("2026-11-20T00:00:00.000Z")).toBe("2026-11-20");
  });

  it("serializes a date input as UTC midnight", () => {
    expect(dateInputToUtcIso("2026-11-20")).toBe("2026-11-20T00:00:00.000Z");
  });

  it("defaults new documents to today", () => {
    jest.useFakeTimers().setSystemTime(new Date(2026, 10, 20));
    expect(formatLocalDateInput()).toBe("2026-11-20");
    jest.useRealTimers();
  });

  it("validates date-only input values", () => {
    expect(isValidDateInput("2026-02-28")).toBe(true);
    expect(isValidDateInput("2026-02-30")).toBe(false);
    expect(isValidDateInput("not-a-date")).toBe(false);
  });
});
