/**
 * Parse various date formats into a consistent display format
 * Handles Date objects, ISO strings, and common date patterns
 *
 * @param date - The date value to parse (Date object, string, or unknown)
 * @param locale - The locale for formatting (default: 'id-ID')
 * @returns Formatted date string (DD/MM format) or the original string if unparseable
 */
export function parseDate(
  date: Date | string | unknown,
  locale: string = 'id-ID'
): string {
  // Handle null/undefined
  if (date === null || date === undefined) {
    return '';
  }

  // Handle Date objects
  if (date instanceof Date) {
    if (isNaN(date.getTime())) {
      return ''; // Invalid Date
    }
    return formatDate(date, locale);
  }

  // Handle string dates
  if (typeof date === 'string') {
    const trimmed = date.trim();

    // Return empty for empty strings
    if (!trimmed) {
      return '';
    }

    // Try to parse as ISO string or common date formats
    const parsed = tryParseDate(trimmed);
    if (parsed) {
      return formatDate(parsed, locale);
    }

    // If it looks like a valid date format already (DD/MM, DD-MM, etc.), return as-is
    if (isValidDateFormat(trimmed)) {
      return trimmed;
    }

    // Return original string if we can't parse it
    return trimmed;
  }

  // Handle numbers (timestamps)
  if (typeof date === 'number') {
    const parsed = new Date(date);
    if (!isNaN(parsed.getTime())) {
      return formatDate(parsed, locale);
    }
  }

  // Fallback: convert to string
  return String(date);
}

/**
 * Format a Date object to DD/MM format
 */
function formatDate(date: Date, locale: string): string {
  try {
    return date.toLocaleDateString(locale, {
      day: '2-digit',
      month: '2-digit',
    });
  } catch {
    // Fallback if locale is not supported
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    return `${day}/${month}`;
  }
}

/**
 * Try to parse a string into a Date object
 * Supports multiple formats: ISO, DD/MM/YYYY, DD-MM-YYYY, MM/DD/YYYY, etc.
 */
function tryParseDate(str: string): Date | null {
  // Try ISO format first (most reliable)
  const isoDate = new Date(str);
  if (!isNaN(isoDate.getTime()) && str.includes('-') && str.length > 8) {
    return isoDate;
  }

  // Common patterns to try
  const patterns: Array<{ regex: RegExp; parse: (m: RegExpMatchArray) => Date }> = [
    // DD/MM/YYYY or DD-MM-YYYY
    {
      regex: /^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/,
      parse: (m) => new Date(parseInt(m[3]), parseInt(m[2]) - 1, parseInt(m[1])),
    },
    // YYYY-MM-DD (ISO without time)
    {
      regex: /^(\d{4})[\/\-](\d{1,2})[\/\-](\d{1,2})$/,
      parse: (m) => new Date(parseInt(m[1]), parseInt(m[2]) - 1, parseInt(m[3])),
    },
    // DD/MM or DD-MM (current year assumed)
    {
      regex: /^(\d{1,2})[\/\-](\d{1,2})$/,
      parse: (m) => new Date(new Date().getFullYear(), parseInt(m[2]) - 1, parseInt(m[1])),
    },
    // Month name formats: DD Mon YYYY, Mon DD YYYY
    {
      regex: /^(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})$/,
      parse: (m) => {
        const month = parseMonthName(m[2]);
        if (month === -1) return new Date(NaN);
        return new Date(parseInt(m[3]), month, parseInt(m[1]));
      },
    },
    {
      regex: /^([A-Za-z]+)\s+(\d{1,2}),?\s+(\d{4})$/,
      parse: (m) => {
        const month = parseMonthName(m[1]);
        if (month === -1) return new Date(NaN);
        return new Date(parseInt(m[3]), month, parseInt(m[2]));
      },
    },
  ];

  for (const { regex, parse } of patterns) {
    const match = str.match(regex);
    if (match) {
      const parsed = parse(match);
      if (!isNaN(parsed.getTime())) {
        return parsed;
      }
    }
  }

  return null;
}

/**
 * Parse month name to month index (0-11)
 */
function parseMonthName(name: string): number {
  const months: Record<string, number> = {
    jan: 0, january: 0, januari: 0,
    feb: 1, february: 1, februari: 1,
    mar: 2, march: 2, maret: 2,
    apr: 3, april: 3,
    may: 4, mei: 4,
    jun: 5, june: 5, juni: 5,
    jul: 6, july: 6, juli: 6,
    aug: 7, august: 7, agustus: 7,
    sep: 8, sept: 8, september: 8,
    oct: 9, october: 9, oktober: 9,
    nov: 10, november: 10,
    dec: 11, december: 11, desember: 11,
  };

  return months[name.toLowerCase()] ?? -1;
}

/**
 * Check if a string looks like a valid date format
 * (e.g., DD/MM, DD-MM, DD/MM/YY)
 */
function isValidDateFormat(str: string): boolean {
  // Common valid date patterns
  const validPatterns = [
    /^\d{1,2}[\/\-]\d{1,2}$/, // DD/MM or DD-MM
    /^\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}$/, // DD/MM/YY or DD/MM/YYYY
    /^\d{4}[\/\-]\d{1,2}[\/\-]\d{1,2}$/, // YYYY-MM-DD
  ];

  return validPatterns.some((pattern) => pattern.test(str));
}

export default parseDate;
