/**
 * Creates a function that generates unique worksheet names.
 * If a name already exists, it appends a suffix like " (2)", " (3)", etc.
 * Ensures the final name doesn't exceed Excel's 31 character limit.
 */
export const createUniqueWorksheetNameGenerator = () => {
  const usedWorksheetNames = new Set<string>();

  return (baseName: string): string => {
    let name = baseName;
    let counter = 2;
    while (usedWorksheetNames.has(name)) {
      // Ensure the name with suffix doesn't exceed 31 chars
      const suffix = ` (${counter})`;
      const maxBaseLength = 31 - suffix.length;
      const truncatedBase =
        baseName.length > maxBaseLength
          ? baseName.substring(0, maxBaseLength)
          : baseName;
      name = `${truncatedBase}${suffix}`;
      counter++;
    }
    usedWorksheetNames.add(name);
    return name;
  };
};
