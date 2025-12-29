import useGetRekeningExcelFile from "./useGetRekeningExcelFile";

const useGetRekeningData = (
  date: Date,
  enabled: boolean
) => {
  const result = useGetRekeningExcelFile(date, enabled);
};
