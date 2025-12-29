export const testPPAPattern = (element: string) => {
  const regex = /^\d+\//;
  return regex.test(element);
};
