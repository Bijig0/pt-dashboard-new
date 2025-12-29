import { checkBorrowPeriodForWholeMonth } from "../createLamaSewa/checkBorrowPeriodForWholeMonth/checkBorrowPeriodForWholeMonth";

export type Args = {
  hargaBulanan: number;
  hargaHarian: number;
  record: {
    tanggalRange: {
      start: string;
      end: string;
    };
    days: number;
  };
};

export const createHargaSewaToDisplay = ({
  hargaBulanan,
  hargaHarian,
  record,
}: Args): number => {
  const isBorrowPeriodForWholeMonth = checkBorrowPeriodForWholeMonth(
    record.days,
    record.tanggalRange.start
  );

  console.log({ isBorrowPeriodForWholeMonth });

  return isBorrowPeriodForWholeMonth ? hargaBulanan : hargaHarian;
};

// @ts-ignore
if (import.meta.main) {
  const result = createHargaSewaToDisplay({
    hargaBulanan: 1000,
    hargaHarian: 1000,
    record: {
      tanggalRange: { start: "01/07/2024", end: "31/07/2024" },
      days: 31,
    },
  } satisfies Args);
  console.log({ result });
}
