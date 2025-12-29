function areDatesEqualIgnoringTime(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

// Helper function to deeply compare arrays with custom date comparison
export function deepEqualWithDateComparison(arr1: any[], arr2: any[]): boolean {
  if (arr1.length !== arr2.length) return false;

  for (let i = 0; i < arr1.length; i++) {
    if (Array.isArray(arr1[i]) && Array.isArray(arr2[i])) {
      if (!deepEqualWithDateComparison(arr1[i], arr2[i])) return false;
    } else if (arr1[i] instanceof Date && arr2[i] instanceof Date) {
      if (!areDatesEqualIgnoringTime(arr1[i], arr2[i])) return false;
    } else if (arr1[i] !== arr2[i]) {
      return false;
    }
  }

  return true;
}
