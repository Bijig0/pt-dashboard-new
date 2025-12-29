export const alatNamesKeys = {
  all: ["alatNames"] as const,
  lists: () => [...alatNamesKeys.all, "list"] as const,
  list: (filters: string) => [...alatNamesKeys.lists(), { filters }] as const,
  details: () => [...alatNamesKeys.all, "detail"] as const,
  detail: (startDate: Date | undefined, endDate: Date | undefined) => [...alatNamesKeys.details(), startDate, endDate] as const, 
};

export const worksheetDataKeys = {
  all: ["worksheetData"] as const,
  lists: () => [...worksheetDataKeys.all, "list"] as const,
  list: (filters: string) =>
    [...worksheetDataKeys.lists(), { filters }] as const,
  details: () => [...worksheetDataKeys.all, "detail"] as const,
  detail: (alatName: string, date: Date) =>
    [...worksheetDataKeys.details(), alatName, date] as const,
};
