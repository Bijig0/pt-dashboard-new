function areDatesEqual(date1: Date, date2: Date): boolean {
  if (!(date1 instanceof Date) || !(date2 instanceof Date)) {
    throw new TypeError("Both arguments must be Date objects");
  }

  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}
