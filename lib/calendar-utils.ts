import type { CalendarEntry } from "./types";

/**
 * Sorts calendar entries by due date (ascending - earliest first)
 * @param calendar - Array of calendar entries
 * @returns Sorted array of calendar entries
 */
export function sortCalendarByDate(calendar: CalendarEntry[]): CalendarEntry[] {
  return [...calendar].sort(
    (a, b) => a.dueDate.getTime() - b.dueDate.getTime()
  );
}

/**
 * Filters calendar entries for a specific month
 * @param calendar - Array of calendar entries
 * @param month - Month string in format "MMMM yyyy" (e.g., "January 2025")
 * @returns Filtered array of calendar entries
 */
export function filterCalendarByMonth(
  calendar: CalendarEntry[],
  month: string
): CalendarEntry[] {
  return calendar.filter((entry) => entry.month === month);
}

/**
 * Filters calendar entries by category
 * @param calendar - Array of calendar entries
 * @param category - Category to filter by ('Tax', 'Labor', 'Statutory', 'Environmental')
 * @returns Filtered array of calendar entries
 */
export function filterCalendarByCategory(
  calendar: CalendarEntry[],
  category: string
): CalendarEntry[] {
  if (category === "all" || !category) {
    return calendar;
  }
  return calendar.filter(
    (entry) => entry.category.toLowerCase() === category.toLowerCase()
  );
}

/**
 * Groups calendar entries by month
 * @param calendar - Array of calendar entries
 * @returns Map with month strings as keys and arrays of calendar entries as values
 */
export function groupCalendarByMonth(
  calendar: CalendarEntry[]
): Map<string, CalendarEntry[]> {
  const grouped = new Map<string, CalendarEntry[]>();

  for (const entry of calendar) {
    const month = entry.month;
    if (!grouped.has(month)) {
      grouped.set(month, []);
    }
    grouped.get(month)!.push(entry);
  }

  // Sort entries within each month by due date
  for (const [month, entries] of grouped.entries()) {
    entries.sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime());
  }

  return grouped;
}
