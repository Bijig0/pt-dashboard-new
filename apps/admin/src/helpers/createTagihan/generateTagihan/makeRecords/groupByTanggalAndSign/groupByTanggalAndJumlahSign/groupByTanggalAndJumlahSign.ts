import { SingleAlat } from "../../../generateTagihan";

type RentalType = "Sewa" | "Retur";
type GroupKey = `${string}-${RentalType}`;

export type AfterGroupBy = {
  [key: GroupKey]: {
    tanggal: string;
    jumlah: number;
    hargaBulanan: number;
    hargaHarian: number;
  }[];
};

// TODO: Uncomment this function when you have node 2
export const groupByTanggalAndJumlahSign = (
  array: SingleAlat
): AfterGroupBy => {
  return Object.groupBy(array, (obj): GroupKey => {
    const rentalType: RentalType = obj.jumlah < 0 ? "Retur" : "Sewa";
    return `${obj.tanggal}-${rentalType}`;
  }) as AfterGroupBy;
};
