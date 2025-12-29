import dayjs, { Dayjs } from "dayjs";
import { AlatName } from "../../../../createRekapan/types";
import { SingleAlat } from "../../generateTagihan";
import { addBulananRecord } from "../addBulananRecord/addBulananRecord";
import getTagihanDatePeriods from "../getTagihanDatePeriods/getTagihanDatePeriods";
import {
  getBulananJumlahs,
  PrevBulanTotalSewaAlatAmount,
} from "./getBulananJumlahs/getBulananJumlahs";

type Args = {
  prevBulanTotalSewaAlatAmount: PrevBulanTotalSewaAlatAmount;
  records: Record<
    AlatName,
    {
      records: SingleAlat;
    }
  >;
  periodToCreateTagihanFor: Dayjs;
};

export const getBulananRecord = ({
  prevBulanTotalSewaAlatAmount,
  records,
  periodToCreateTagihanFor,
}: Args) => {
  const bulananJumlah = getBulananJumlahs({
    prevBulanTotalSewaAlatAmount,
    records,
  });

  const {
    tanggalStart,
    tanggalEnd,
    daysInPeriod: daysInMonth,
  } = getTagihanDatePeriods(periodToCreateTagihanFor);

  console.log({ daysInMonth });

  console.log({ prevBulanTotalSewaAlatAmount });

  console.log({ bulananJumlah });

  const bulananRecord = addBulananRecord({
    bulananJumlah,
    tanggalStart,
    tanggalEnd,
    daysInMonth,
  });

  return bulananRecord;
};

// @ts-ignore
if (import.meta.main) {
  const records = {
    "Alat 1": {
      records: [
        {
          hargaBulanan: 100,
          hargaHarian: 3.33,
          jumlah: 5,
          tanggal: "12/01/2024",
        },
      ],
    },
  };

  const prevBulanTotalSewaAlatAmount = {
    tanggal: "Sisa Alat",
    alatRecords: [
      {
        alatName: "Alat 1",
        hargaBulanan: 100,
        hargaHarian: 3.33,
        jumlahAlat: 10,
      },
      {
        alatName: "Alat 2",
        hargaBulanan: 300,
        hargaHarian: 10,
        jumlahAlat: 20,
      },
    ],
  };

  const periodToCreateTagihanFor = dayjs.utc("01/05/2024");

  const result = getBulananRecord({
    prevBulanTotalSewaAlatAmount,
    records,
    periodToCreateTagihanFor,
  });

  console.log({ result });
}
