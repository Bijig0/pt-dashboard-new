import { AlatName } from "../createRekapan/types";

export type TagihanJS = {
  data: {
    [key: AlatName]: {
      records: {
        tanggalRange: {
          start: string;
          end: string;
        };
        days: number;
        jumlah: number;
        totalSubtotal: number;
      }[];
      hargaBulanan: number;
      hargaHarian: number;
      recordsSubtotal: number;
    };
  };
  total: number;
  ppn: number;
  totalAfterPPN: number;
} & {};

export type TagihanAlatRecords = {
  [key: AlatName]: {
    records: {
      tanggalRange: {
        start: string;
        end: string;
      };
      days: number;
      jumlah: number;
      totalSubtotal: number;
    }[];
    harga: number;
  };
} & {};
