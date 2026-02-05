/**
 * Format a Date object as YYYY-MM-DD
 * This function always returns a string.
 */
export function formatDate(date: Date): string {
  return date.toISOString().split('T')[0] ?? '';
}

/**
 * Returns the date N days ago in YYYY-MM-DD format.
 * Always returns a string.
 */
export function daysAgo(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return formatDate(d);
}
