/** Sums numeric values in a string-keyed record; ignores non-finite entries. */
export function sumRecordValues(record: Record<string, number> | undefined): number {
  if (!record) return 0;
  return Object.values(record).reduce((sum, value) => sum + (Number.isFinite(value) ? value : 0), 0);
}
