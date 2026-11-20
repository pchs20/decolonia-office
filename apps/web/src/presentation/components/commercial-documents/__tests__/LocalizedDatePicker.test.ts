import {
  DATE_PICKER_DATE_FORMAT,
  DATE_PICKER_WEEK_START,
  getDatePickerLocale
} from "@/presentation/components/commercial-documents/LocalizedDatePicker";

describe("LocalizedDatePicker configuration", () => {
  it("uses day/month/year and Monday as the first day", () => {
    expect(DATE_PICKER_DATE_FORMAT).toBe("dd/MM/yyyy");
    expect(DATE_PICKER_WEEK_START).toBe(1);
  });

  it("maps application languages to date-fns locales", () => {
    expect(getDatePickerLocale("ca")).toBe("ca");
    expect(getDatePickerLocale("en")).toBe("en");
    expect(getDatePickerLocale("es")).toBe("es");
  });
});
