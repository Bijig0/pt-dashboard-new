// create a context template for me

import dayjsUtc from "@dayjsutc";
import {
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import useGetRekapanData, {
  RekapanWorksheetObjSchema,
} from "../../../hooks/useGetRekapanData";
import useGetRekapanCompanyNames from "../../../hooks/useGetRekeningCompanyNames";
import { useAvailableMonths } from "../../../hooks/useAvailableMonths";

type ContextType = {
  companyNamesList: string[];
  selectedCompanyName: string;
  setSelectedCompanyName: React.Dispatch<SetStateAction<string>>;
  // The selected date is like the month it's for e.g. 31 May 2024 will show the June rekapan
  selectedDate: Date;
  // The rekapan period is like June etc.
  periodMonth: number;
  daysInPeriod: number;
  periodYear: number;
  isLoading: boolean;
  setSelectedDate: React.Dispatch<SetStateAction<Date>>;
  dates: Date[];
  worksheetData: RekapanWorksheetObjSchema;
  setFetchRekapanWorksheetDataEnabled: React.Dispatch<SetStateAction<boolean>>;
  setFetchRekapanCompanyNamesEnabled: React.Dispatch<SetStateAction<boolean>>;
};

const RekapanContext = createContext<ContextType>({} as ContextType);

let companyNamesLoaded = false;

export const Provider = ({ children }: { children: React.ReactNode }) => {
  // All hooks must be called unconditionally at the top
  const { months: endOfMonths, isLoading: isLoadingMonths } = useAvailableMonths();
  const [userSelectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedCompanyName, setSelectedCompanyName] = useState<string>("");
  const [
    fetchRekapanWorksheetDataEnabled,
    setFetchRekapanWorksheetDataEnabled,
  ] = useState(true);
  const [fetchRekapanCompanyNamesEnabled, setFetchRekapanCompanyNamesEnabled] =
    useState(true);

  // Use fallback date for hooks when userSelectedDate is null
  const selectedDate = userSelectedDate ?? new Date();

  const { data: companyNames } = useGetRekapanCompanyNames(
    selectedDate,
    fetchRekapanCompanyNamesEnabled && userSelectedDate !== null
  );

  const {
    data: worksheetData,
    isLoading,
    error,
  } = useGetRekapanData(
    selectedCompanyName,
    selectedDate,
    fetchRekapanWorksheetDataEnabled && userSelectedDate !== null
  );

  console.log({ endOfMonths });

  // Set initial selected date when months are loaded
  useEffect(() => {
    if (endOfMonths.length > 0 && !userSelectedDate) {
      setSelectedDate(endOfMonths[0]!);
    }
  }, [endOfMonths, userSelectedDate]);

  useEffect(() => {
    const companyNamesIsNotLoading =
      companyNames !== undefined && companyNames.length > 0;
    if (companyNamesIsNotLoading && !companyNamesLoaded!) {
      companyNamesLoaded = true;

      if (companyNames[0] === undefined) return;
      setSelectedCompanyName(companyNames[0]);
    }
  }, [companyNames]);

  console.log({ selectedDate });
  console.log({ worksheetData });

  useEffect(() => {
    if (worksheetData) {
      setFetchRekapanWorksheetDataEnabled(false);
    }
  }, [worksheetData]);

  // Show loading if months not ready
  if (isLoadingMonths || !userSelectedDate) {
    return null;
  }

  const periodDate = dayjsUtc(selectedDate).add(1, "month");
  const periodYear = periodDate.year();
  const periodMonth = periodDate.month();
  const daysInPeriod = periodDate.daysInMonth();

  if (error) throw error;

  console.log({ worksheetData });

  if (!worksheetData) return null;

  console.log({ isLoading });

  if (isLoading) return null;

  return (
    <RekapanContext.Provider
      value={{
        companyNamesList: companyNames ?? [""],
        selectedCompanyName: selectedCompanyName ?? "",
        setSelectedCompanyName,
        selectedDate,
        periodMonth,
        daysInPeriod,
        periodYear,
        isLoading,
        setSelectedDate,
        dates: endOfMonths,
        worksheetData,
        setFetchRekapanCompanyNamesEnabled,
        setFetchRekapanWorksheetDataEnabled,
      }}
    >
      {children}
    </RekapanContext.Provider>
  );
};

export default Provider;

export const useRekapanContext = () => useContext(RekapanContext);
