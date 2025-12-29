export const objectValues = <K extends PropertyKey, A>(
  record: Record<K, A>
): A[] => Object.values(record);
