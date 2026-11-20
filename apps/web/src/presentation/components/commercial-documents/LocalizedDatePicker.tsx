"use client";

import { useTranslation } from "react-i18next";
import DatePicker, { registerLocale } from "react-datepicker";
import { ca, enGB, es } from "date-fns/locale";
import { formatLocalDateInput } from "@/presentation/utils/date-input";

registerLocale("ca", ca);
registerLocale("es", es);
registerLocale("en", enGB);

export const DATE_PICKER_DATE_FORMAT = "dd/MM/yyyy";
export const DATE_PICKER_WEEK_START = 1;

export function getDatePickerLocale(language: string): "ca" | "en" | "es" {
  return language.startsWith("ca") ? "ca" : language.startsWith("en") ? "en" : "es";
}

interface LocalizedDatePickerProps {
  id: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  className?: string;
}

export function LocalizedDatePicker({ id, name, value, onChange, required, className }: LocalizedDatePickerProps) {
  const { i18n } = useTranslation();
  const locale = getDatePickerLocale(i18n.language);
  const selected = value ? new Date(`${value}T00:00:00`) : null;

  return (
    <DatePicker
      id={id}
      name={name}
      selected={selected}
      onChange={(date: Date | null) => {
        if (date) onChange(formatLocalDateInput(date));
      }}
      dateFormat={DATE_PICKER_DATE_FORMAT}
      locale={locale}
      calendarStartDay={DATE_PICKER_WEEK_START}
      required={required}
      isClearable={false}
      className={className ?? "w-full px-3 py-2 border rounded"}
      wrapperClassName="w-full"
      popperClassName="z-50"
      showPopperArrow={false}
      autoComplete="off"
    />
  );
}
