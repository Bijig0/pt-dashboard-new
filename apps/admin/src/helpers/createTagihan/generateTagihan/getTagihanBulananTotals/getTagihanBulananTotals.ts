import dayjsUtc from "@dayjsutc";
import { Dayjs } from "dayjs";
import { merge } from "ts-deepmerge";
import { AlatName } from "../../../createRekapan/types";
import { Input } from "../generateTagihan";
import { getBulananHarga } from "./getBulananHarga/getBulananHarga";
import { getBulananRecord } from "./getBulananRecord/getBulananRecord";
import { prepareRecords } from "./prepareRecords/prepareRecords";

/**
 * The month should be 1 indexed
 */
type Args = {
  records: Input;
  periodToCreateTagihanFor: Dayjs;
};

/**
 * Ok so each alat's TAGIHAN is made up of 2 types of records, the daily ones which are normal
 * Which are like the positive ones from a certain date to the end of the month.
 * i.e the rekapan contains a row like this
 *
 * Tanggal:     Alat 1
 * 01/07/2024 - 10
 *
 * This is a regular positive record
 *
 * However, there is also the records that go for the full month, the bulanan records
 * These records are the ones from the start of the month to the end of the month,
 * and currently, they consist of adding :
 *
 * 1. the first date amount of the month +
 * 2. all the negatives +
 * 3. the initial total sewa alat amount
 *
 * This function aims to perform calculations for the latter
 *
 */
const getTagihanBulananJumlah = ({
  records,
  periodToCreateTagihanFor,
}: Args): Record<
  AlatName,
  {
    records: {
      tanggalRange: {
        start: string;
        end: string;
      };
      days: number;
      jumlah: number;
    }[];
    hargaHarian: number;
    hargaBulanan: number;
  }
> => {
  console.log({ records });

  const prevBulanTotalSewaAlatAmount = records[0];

  if (!prevBulanTotalSewaAlatAmount)
    throw new Error("No prevBulanTotalSewaAlatAmount");

  console.log({ prevBulanTotalSewaAlatAmount });

  const preparedRecords = prepareRecords(records);

  // Now here do the logic

  const alatByBulananRecord = getBulananRecord({
    prevBulanTotalSewaAlatAmount,
    records: preparedRecords,
    periodToCreateTagihanFor,
  });

  console.log({ alatByBulananRecord });

  const alatByHarga = getBulananHarga(prevBulanTotalSewaAlatAmount.alatRecords);

  console.log({ alatByHarga });

  const bulananRecordWithHarga = merge(alatByBulananRecord, alatByHarga);

  console.log({ bulananRecordWithHarga });

  return bulananRecordWithHarga;
};

export default getTagihanBulananJumlah;

// @ts-ignore
if (import.meta.main) {
  const mockData = [
    {
      tanggal: "Sisa Alat",
      alatRecords: [
        {
          alatName: "Alat 1",
          jumlahAlat: 10,
          hargaBulanan: 100,
          hargaHarian: 3.33,
        },
        {
          alatName: "Alat 2",
          jumlahAlat: 20,
          hargaBulanan: 300,
          hargaHarian: 10,
        },
      ],
    },
    {
      tanggal: "12/01/2024",
      alatRecords: [
        {
          alatName: "Alat 1",
          jumlahAlat: 5,
          hargaBulanan: 100,
          hargaHarian: 3.33,
        },
      ],
    },
  ] satisfies Input;

  const periodToCreateTagihanFor = dayjsUtc("2024-01-15");

  const result = getTagihanBulananJumlah({
    records: mockData,
    periodToCreateTagihanFor,
  });

  console.dir({ result }, { depth: null });
}
