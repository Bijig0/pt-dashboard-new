import { checkBorrowPeriodForWholeMonth } from "./checkBorrowPeriodForWholeMonth/checkBorrowPeriodForWholeMonth";

type LamaSewa = `${number} HR` | `1 BL`;

export const createLamaSewa = (
  daysBorrowedFor: number,
  tanggalWithinMonth: string
): LamaSewa => {
  const isBorrowPeriodForWholeMonth = checkBorrowPeriodForWholeMonth(
    daysBorrowedFor,
    tanggalWithinMonth
  );
  return isBorrowPeriodForWholeMonth ? `1 BL` : `${daysBorrowedFor} HR`;
};
