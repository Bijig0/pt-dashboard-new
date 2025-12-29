import dayjs, { Dayjs } from "dayjs";
import { supabase } from "../../supabase";

const CUSTOM_DATES_KEY = "custom_end_of_months";

const dayJSToUTCDate = (date: Dayjs): Date => {
  return new Date(date.toDate().toUTCString());
};

// Fetch available months from database (months that have records)
export async function fetchAvailableMonths(): Promise<Date[]> {
  const { data, error } = await supabase.rpc("get_available_months");

  if (error) {
    console.error("Error fetching available months:", error);
    return [];
  }

  if (!data || data.length === 0) {
    return [];
  }

  return data.map((row: { end_of_month: string }) => new Date(row.end_of_month));
}

// Get custom dates from localStorage
export function getCustomDates(): Date[] {
  const stored = localStorage.getItem(CUSTOM_DATES_KEY);
  if (!stored) return [];
  try {
    const parsed = JSON.parse(stored) as string[];
    return parsed.map((dateStr) => new Date(dateStr));
  } catch {
    return [];
  }
}

// Save custom dates to localStorage
export function saveCustomDates(dates: Date[]): void {
  const toStore = dates.map((d) => d.toISOString());
  localStorage.setItem(CUSTOM_DATES_KEY, JSON.stringify(toStore));
}

// Add a custom date
export function addCustomDate(date: Date): Date[] {
  const existing = getCustomDates();
  // Ensure we store end of month
  const endOfMonth = dayjs.utc(date).endOf("month");
  const endOfMonthDate = dayJSToUTCDate(endOfMonth);

  // Check if already exists
  const alreadyExists = existing.some(
    (d) => d.getTime() === endOfMonthDate.getTime()
  );
  if (alreadyExists) return existing;

  const newDates = [...existing, endOfMonthDate];
  saveCustomDates(newDates);
  return newDates;
}

// Remove a custom date
export function removeCustomDate(date: Date): Date[] {
  const existing = getCustomDates();
  const filtered = existing.filter((d) => d.getTime() !== date.getTime());
  saveCustomDates(filtered);
  return filtered;
}

// Update a custom date
export function updateCustomDate(oldDate: Date, newDate: Date): Date[] {
  const existing = getCustomDates();
  const endOfMonth = dayjs.utc(newDate).endOf("month");
  const endOfMonthDate = dayJSToUTCDate(endOfMonth);

  const updated = existing.map((d) =>
    d.getTime() === oldDate.getTime() ? endOfMonthDate : d
  );
  saveCustomDates(updated);
  return updated;
}

// Async function to get all available months (from DB + custom)
export async function getEndOfMonthsAsync(): Promise<Date[]> {
  const dbDates = await fetchAvailableMonths();
  const customDates = getCustomDates();

  // Combine and deduplicate
  const allDates = [...dbDates];
  customDates.forEach((customDate) => {
    const exists = allDates.some((d) => d.getTime() === customDate.getTime());
    if (!exists) {
      allDates.push(customDate);
    }
  });

  // Sort by date (newest first for display)
  allDates.sort((a, b) => b.getTime() - a.getTime());

  return allDates;
}

// Synchronous fallback that returns only custom dates
// Use getEndOfMonthsAsync for full functionality
function getEndOfMonths(): Date[] {
  // Return custom dates only as sync fallback
  // Components should use getEndOfMonthsAsync or useAvailableMonths hook
  const customDates = getCustomDates();
  customDates.sort((a, b) => b.getTime() - a.getTime());
  return customDates;
}

export default getEndOfMonths;
