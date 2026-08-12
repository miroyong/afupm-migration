// CIG (Cheon Il Guk) lunar calendar utilities.
// Ported from the AFUPM Wix site (familias.org.br). The CIG date is derived
// from the Chinese lunar calendar via moment-lunar; the CIG year counts from
// lunar new year 2013 (CIG year 1), so lunar year Y maps to CIG year Y - 2012.
import moment from "moment";
import "moment-lunar";

export type CigDate = { year: number; month: number; day: number };

const CIG_YEAR_OFFSET = 2012;

/**
 * Convert a Gregorian date to the corresponding Cheon Il Guk lunar date.
 * Returns `null` when the conversion fails (invalid date, moment-lunar error),
 * which callers must render as a graceful fallback.
 */
export function getCigDate(date: Date = new Date()): CigDate | null {
  try {
    const lunar = moment(date).lunar();
    const year = lunar.year();
    const month = lunar.month();
    const day = lunar.date();
    if (
      typeof year !== "number" ||
      typeof month !== "number" ||
      typeof day !== "number" ||
      Number.isNaN(year) ||
      Number.isNaN(month) ||
      Number.isNaN(day)
    ) {
      return null;
    }
    return { year: year - CIG_YEAR_OFFSET, month, day };
  } catch {
    return null;
  }
}

/**
 * Format a CIG date as "[N]º dia do [M]º mês do [Y]º ano do CIG" (pt) or
 * "[N]º día del [M]º mes del [Y]º año del CIG" (es). The ordinal indicator
 * "º" is always adjacent to the number with no intervening space.
 */
export function formatCigDate(cig: CigDate | null, lang: "pt" | "es"): string {
  if (!cig) {
    return lang === "es" ? "Fecha lunar no disponible" : "Data lunar indisponível";
  }
  if (lang === "es") {
    return `${cig.day}º día del ${cig.month}º mes del ${cig.year}º año del CIG`;
  }
  return `${cig.day}º dia do ${cig.month}º mês do ${cig.year}º ano do CIG`;
}

const WEEKDAYS_PT = [
  "domingo",
  "segunda-feira",
  "terça-feira",
  "quarta-feira",
  "quinta-feira",
  "sexta-feira",
  "sábado",
];

const WEEKDAYS_ES = [
  "domingo",
  "lunes",
  "martes",
  "miércoles",
  "jueves",
  "viernes",
  "sábado",
];

/**
 * Format a Gregorian date as "DD.MM.YYYY weekday" (zero-padded, dots as
 * separators, lowercase weekday name) per locale.
 */
export function formatSolarDate(date: Date, lang: "pt" | "es"): string {
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const weekday = (lang === "es" ? WEEKDAYS_ES : WEEKDAYS_PT)[date.getDay()];
  return `${dd}.${mm}.${date.getFullYear()} ${weekday}`;
}
