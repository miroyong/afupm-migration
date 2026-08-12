// Deterministic daily rotation for the Sanity "wordOfTheDay" collection.
// The phrase shown on a given UTC date is fixed: index = days since the epoch
// (2020-01-01 UTC) modulo the collection size. Collection size 0 and 1 are
// handled without division-by-zero or NaN.

export const WOTD_EPOCH = Date.UTC(2020, 0, 1); // 2020-01-01T00:00:00Z
const MS_PER_DAY = 24 * 60 * 60 * 1000;

/** Zero-based day number of `now` in UTC (days since 1970-01-01). */
export function utcDayNumber(now: Date): number {
  return Math.floor(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()) / MS_PER_DAY
  );
}

/**
 * Deterministic rotation index for a given UTC date. Returns -1 for an empty
 * (or non-positive) collection.
 */
export function getDailyIndex(now: Date, collectionSize: number): number {
  if (!(collectionSize > 0) || !Number.isFinite(collectionSize)) {
    return -1;
  }
  const daysSinceEpoch = utcDayNumber(now) - utcDayNumber(new Date(WOTD_EPOCH));
  return ((daysSinceEpoch % collectionSize) + collectionSize) % collectionSize;
}

/**
 * Pick the document to display for a given date. The collection should be
 * pre-sorted by the `order` field. Returns null for an empty collection.
 */
export function pickWordOfDay<T>(docs: readonly T[], now: Date = new Date()): T | null {
  if (!docs || docs.length === 0) {
    return null;
  }
  const index = getDailyIndex(now, docs.length);
  if (index < 0) return null;
  return docs[index] ?? null;
}
