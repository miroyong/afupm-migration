import { describe, expect, it } from "vitest";
import { getDailyIndex, pickWordOfDay, utcDayNumber } from "../word-of-day";

const DAY_2026_08_12 = new Date("2026-08-12T00:00:00Z");

describe("utcDayNumber", () => {
  it("is stable across times within the same UTC day", () => {
    expect(utcDayNumber(new Date("2026-08-12T00:00:00Z"))).toBe(
      utcDayNumber(new Date("2026-08-12T23:59:59Z"))
    );
  });
});

describe("getDailyIndex", () => {
  it("is deterministic for the same UTC date", () => {
    expect(getDailyIndex(new Date("2026-08-12T00:00:00Z"), 3)).toBe(
      getDailyIndex(new Date("2026-08-12T23:59:59Z"), 3)
    );
  });

  it("advances by one per UTC day", () => {
    const a = getDailyIndex(new Date("2026-08-12T00:00:00Z"), 1000);
    const b = getDailyIndex(new Date("2026-08-13T00:00:00Z"), 1000);
    expect(b - a).toBe(1);
  });

  it("returns 0 on the epoch day (2020-01-01)", () => {
    expect(getDailyIndex(new Date("2020-01-01T12:00:00Z"), 7)).toBe(0);
  });

  it("wraps around the collection size", () => {
    const index = getDailyIndex(DAY_2026_08_12, 5);
    expect(index).toBeGreaterThanOrEqual(0);
    expect(index).toBeLessThan(5);
  });

  it("returns -1 for a non-positive collection size", () => {
    expect(getDailyIndex(DAY_2026_08_12, 0)).toBe(-1);
  });
});

describe("pickWordOfDay", () => {
  const phrases = [
    { order: 1, phrase: "A" },
    { order: 2, phrase: "B" },
    { order: 3, phrase: "C" },
  ];

  it("returns the same document for the same UTC date", () => {
    const a = pickWordOfDay(phrases, new Date("2026-08-12T01:00:00Z"));
    const b = pickWordOfDay(phrases, new Date("2026-08-12T22:00:00Z"));
    expect(a).toEqual(b);
  });

  it("returns a different document for a different UTC date", () => {
    const a = pickWordOfDay(phrases, new Date("2026-08-12T00:00:00Z"));
    const b = pickWordOfDay(phrases, new Date("2026-08-14T00:00:00Z"));
    expect(a).not.toEqual(b);
  });

  it("returns null for an empty collection", () => {
    expect(pickWordOfDay([], DAY_2026_08_12)).toBeNull();
  });

  it("always returns the single document for a size-1 collection", () => {
    const single = [{ order: 1, phrase: "única" }];
    expect(pickWordOfDay(single, new Date("2026-08-12T00:00:00Z"))).toBe(single[0]);
    expect(pickWordOfDay(single, new Date("2026-08-13T00:00:00Z"))).toBe(single[0]);
    expect(pickWordOfDay(single, new Date("2026-08-14T00:00:00Z"))).toBe(single[0]);
  });

  it("does not divide by zero or produce NaN for a size-1 collection", () => {
    const picked = pickWordOfDay([{ phrase: "x" }], DAY_2026_08_12);
    expect(picked?.phrase).toBe("x");
  });
});
