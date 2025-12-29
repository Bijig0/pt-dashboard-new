import { MutualExclusivityError } from "../../../../../utils/precondition";
import { isMainModule } from "../../../../isRunningOnBrowser";

// Cant have them both be null
// Cant have them both be a value that's not 0

export const formatMasukAndKeluar = <
  WorksheetRecord extends { masuk: number | null; keluar: number | null },
>(
  records: WorksheetRecord[]
): (WorksheetRecord & { stokDifference: number })[] => {
  return records.map((record) => {
    const masukAndKelaurAreBothNull =
      record.masuk === null && record.keluar === null;

    if (masukAndKelaurAreBothNull) {
      return {
        ...record,
        masuk: 0,
        keluar: 0,
        stokDifference: 0,
      };
    }

    const masukValue = record.masuk ?? 0;
    const keluarValue = record.keluar ?? 0;

    const masukAndKeluarAreBothPresentValues =
      masukValue > 0 && keluarValue > 0;

    if (masukAndKeluarAreBothPresentValues) {
      throw new MutualExclusivityError(
        `Masuk and Keluar cannot both be present, for record ${JSON.stringify(
          record
        )}`
      );
    }

    // Masuk and Keluar are mutually exclusive
    const masukOrKeluarPresent =
      record.masuk !== 0 && record.masuk !== null ? "masuk" : "keluar";
    const formatAlatMasuk = (alatMasuk: number) => Math.abs(alatMasuk) * -1;
    const masuk =
      masukOrKeluarPresent === "masuk" ? formatAlatMasuk(masukValue) : 0;
    const keluar = masukOrKeluarPresent === "keluar" ? keluarValue : 0;
    const stokDifference = masuk === 0 ? keluar : masuk;
    const formattedMasukAndKeluar = {
      ...record,
      masuk,
      keluar,
      stokDifference,
    };
    return formattedMasukAndKeluar;
  });
};

// @ts-ignore
if (import.meta.main) {
  const records = [{ masuk: 10, keluar: 5 }];
  console.log(formatMasukAndKeluar(records));
}
