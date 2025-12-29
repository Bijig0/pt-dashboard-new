import { Input } from "../generateTagihan";

type GetRecordsReturn = {
  recordsOnly: Input;
  recordsIncludingPrevBulanTotalSewaAlatAmount: Input;
};
export const getRecords = (rekapanData: Input): GetRecordsReturn => {
  const recordsOnly = rekapanData.slice(1, rekapanData.length - 1);
  const recordsIncludingPrevBulanTotalSewaAlatAmount = rekapanData.slice(
    0,
    rekapanData.length - 1
  );
  return { recordsOnly, recordsIncludingPrevBulanTotalSewaAlatAmount };
};
