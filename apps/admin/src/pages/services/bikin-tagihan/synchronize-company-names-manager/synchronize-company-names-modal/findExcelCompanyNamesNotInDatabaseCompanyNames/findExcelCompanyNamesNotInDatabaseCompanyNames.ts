type Args = {
  excelFileCompanyNames: string[];
  databaseCompanyNames: string[];
};

export const findExcelCompanyNamesNotInDatabaseCompanyNames = ({
  excelFileCompanyNames,
  databaseCompanyNames,
}: Args): string[] => {
  return excelFileCompanyNames.filter(
    (excelFileCompanyName) =>
      !databaseCompanyNames.includes(excelFileCompanyName)
  );
};
