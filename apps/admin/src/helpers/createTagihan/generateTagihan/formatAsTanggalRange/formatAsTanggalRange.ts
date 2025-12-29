import { createDayJS } from "@dayjsutc";
import { Dayjs } from "dayjs";
import { z } from "zod";
import { splitOnLastDash } from "../../../../utils/splitOnLastDash/splitOnLastDash";
import { AlatName } from "../../../createRekapan/types";
import { GroupedRecord } from "../generateTagihan";

const getDaysFromStartOfMonth = (date: Dayjs): number => date.date();

function getDaysUntilEndOfMonth(date: Dayjs): number {
  const endOfMonth = date.endOf("month");
  //   The 1 is because the days diffeerence is inclusive of the last day
  return endOfMonth.diff(date, "days") + 1;
}

export const formatAsTanggalRange = <
  RecordsDetails extends {
    records: {
      tanggalRange: {
        start: string;
        end: string;
      };
      days: number;
      jumlah: number;
    }[];
    hargaBulanan: number;
    hargaHarian: number;
  },
>(
  input: GroupedRecord
): Record<AlatName, RecordsDetails> => {
  const result: Record<AlatName, RecordsDetails> = {};
  const dayjs = createDayJS();

  for (const [alatName, alatInfo] of Object.entries(input)) {
    const records = [];

    let hargaBulanan: number;
    let hargaHarian: number;

    console.log({ input });

    for (const [alatDetail, alatValuesList] of Object.entries(alatInfo)) {
      if (alatValuesList === undefined) continue;
      for (const alatValues of alatValuesList) {
        hargaBulanan = alatValues.hargaBulanan;
        hargaHarian = alatValues.hargaHarian;
        const [_, rentalType] = splitOnLastDash(alatDetail);
        console.log({ alatDetail });
        console.log({ alatValues });
        console.log({ rentalType });
        const parsedRentalType = z.enum(["Sewa", "Retur"]).parse(rentalType);

        const asDate = dayjs(alatValues.tanggal, "DD/MM/YYYY");

        // console.log({ asDate, tanggal: alatValues.tanggal });

        // const backDateTemp = asDate.format("DD/MM/YYYY");

        // console.log({ backDateTemp, asDate, tanggal: alatValues.tanggal });

        const days =
          rentalType === "Sewa"
            ? getDaysUntilEndOfMonth(asDate)
            : getDaysFromStartOfMonth(asDate);

        const createTanggalRange = (rentalType: "Sewa" | "Retur") => {
          return rentalType === "Sewa"
            ? {
                start: alatValues.tanggal,
                end: asDate.endOf("month").format("DD/MM/YYYY"),
              }
            : {
                start: asDate.startOf("month").format("DD/MM/YYYY"),
                end: alatValues.tanggal,
              };
        };

        const tanggalRange = createTanggalRange(parsedRentalType);

        const record = {
          jumlah: alatValues.jumlah,
          days: days,
          tanggalRange: {
            start: tanggalRange.start,
            end: tanggalRange.end,
          },
        };

        records.push(record);
      }
    }

    console.log({ records });

    const fullAlatRecord = {
      records: records,
      hargaBulanan: hargaBulanan!,
      hargaHarian: hargaHarian!,
    };

    console.log({ fullAlatRecord });

    // @ts-ignore
    result[alatName] = fullAlatRecord;
  }

  console.log({ result });

  return result;
};
