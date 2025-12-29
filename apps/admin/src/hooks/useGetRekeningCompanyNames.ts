import useGetRekeningExcelFile from "./useGetRekeningExcelFile";

const useGetRekapanCompanyNames = (date: Date, enabled: boolean) => {
  const result = useGetRekeningExcelFile(date, enabled);

  const companyNames = result.data?.worksheets
    .map((worksheet) => worksheet.name)
    .sort();

  const finalResult = { ...result, data: companyNames };

  return finalResult;
};

export default useGetRekapanCompanyNames;
