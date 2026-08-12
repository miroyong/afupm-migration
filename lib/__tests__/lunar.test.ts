import { describe, expect, it } from "vitest";
import { formatCigDate, formatSolarDate, getCigDate } from "../lunar";

describe("getCigDate", () => {
  it("matches the live Wix site for 2026-08-12 (30º dia do 6º mês do 14º ano do CIG)", () => {
    const cig = getCigDate(new Date("2026-08-12T12:00:00Z"));
    expect(cig).toEqual({ year: 14, month: 6, day: 30 });
  });

  it("computes CIG year 14 for the contract spot-check date 2026-08-11", () => {
    // 2026 − 2013 + 1 = 14; the 14º ano began at lunar new year 2026.
    const cig = getCigDate(new Date("2026-08-11T12:00:00Z"));
    expect(cig?.year).toBe(14);
  });

  it("does not increment the CIG year on January 1 of the Gregorian calendar", () => {
    // Early January 2026 is still lunar year 2025 (before the 2026 lunar new
    // year), so the CIG year must be 13, not 14.
    const cig = getCigDate(new Date("2026-01-05T12:00:00Z"));
    expect(cig?.year).toBe(13);
  });

  it("returns null when the date cannot be converted", () => {
    expect(getCigDate(new Date("invalid"))).toBeNull();
  });
});

describe("formatCigDate", () => {
  it("formats Portuguese with adjacent ordinal indicators", () => {
    expect(formatCigDate({ year: 14, month: 6, day: 30 }, "pt")).toBe(
      "30º dia do 6º mês do 14º ano do CIG"
    );
  });

  it("formats Spanish with día/mes/año labels and same numeric values", () => {
    expect(formatCigDate({ year: 14, month: 6, day: 30 }, "es")).toBe(
      "30º día del 6º mes del 14º año del CIG"
    );
  });

  it("keeps the ordinal indicator adjacent for single-digit values (1º, not 1 º)", () => {
    expect(formatCigDate({ year: 3, month: 1, day: 1 }, "pt")).toBe(
      "1º dia do 1º mês do 3º ano do CIG"
    );
  });

  it("returns a localized fallback for null input", () => {
    expect(formatCigDate(null, "pt")).toBe("Data lunar indisponível");
    expect(formatCigDate(null, "es")).toBe("Fecha lunar no disponible");
  });
});

describe("formatSolarDate", () => {
  it("formats the Portuguese date with DD.MM.YYYY and lowercase weekday", () => {
    expect(formatSolarDate(new Date(2026, 7, 11), "pt")).toBe(
      "11.08.2026 terça-feira"
    );
  });

  it("formats the Spanish date with the Spanish weekday", () => {
    expect(formatSolarDate(new Date(2026, 7, 11), "es")).toBe(
      "11.08.2026 martes"
    );
  });

  it("zero-pads single-digit days and months", () => {
    expect(formatSolarDate(new Date(2026, 2, 1), "pt")).toBe(
      "01.03.2026 domingo"
    );
  });
});
