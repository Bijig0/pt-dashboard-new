import { AlatName } from "../../../../../createRekapan/types";
import { AlatRecord, SingleAlat } from "../../../generateTagihan";
import { calculateBulananJumlahs } from "../../calculateBulananJumlahs/calculateBulananJumlahs";
import { convertPrevBulanTotalSewaAlatAmountToObject } from "../../convertPrevBulanTotalSewaAlatAmountToObject/convertPrevBulanTotalSewaAlatAmountToObject";
import { getFirstDateAmountIfPresent } from "../../getFirstDateAmountIfPresent/getFirstDateAmountIfPresent";
import { getSumOfAllNegatives } from "../../getSumOfAllNegatives/getSumOfAllNegatives";

export type PrevBulanTotalSewaAlatAmount = {
  tanggal: string;
  alatRecords: AlatRecord[];
};

type Args = {
  prevBulanTotalSewaAlatAmount: PrevBulanTotalSewaAlatAmount;
  records: Record<
    AlatName,
    {
      records: SingleAlat;
    }
  >;
};
export const getBulananJumlahs = ({
  prevBulanTotalSewaAlatAmount,
  records,
}: Args) => {
  const firstDateAmountIfPresent = getFirstDateAmountIfPresent(records);

  console.log({ firstDateAmountIfPresent });

  const sumOfAllNegatives = getSumOfAllNegatives(records);

  console.log({ sumOfAllNegatives });

  const prevBulanObj = convertPrevBulanTotalSewaAlatAmountToObject(
    prevBulanTotalSewaAlatAmount.alatRecords
  );

  console.log({ prevBulanObj });

  const bulananJumlah = calculateBulananJumlahs({
    firstDateAmountIfPresent,
    sumOfAllNegatives,
    prevBulanObj,
  });

  return bulananJumlah;
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

  const result = getBulananJumlahs({
    prevBulanTotalSewaAlatAmount,
    records,
  });

  console.log({ result });
}
