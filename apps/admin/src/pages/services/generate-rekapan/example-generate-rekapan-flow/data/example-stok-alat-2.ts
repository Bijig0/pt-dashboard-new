import { ExampleStokAlatData } from "./types";

// PIPA 3 transactions - matches the "PIPA 3" column in the rekapan output
export const exampleStokAlat2: ExampleStokAlatData = {
  title: "PIPA 3",
  records: [
    // January transactions
    {
      alat_name: "PIPA 3",
      company_name: "PT Konstruksi Jaya",
      tanggal: "2024-01-12",
      masuk: null,
      keluar: 30,
    },

    // February transactions
    {
      alat_name: "PIPA 3",
      company_name: "PT Bangunan Prima",
      tanggal: "2024-02-05",
      masuk: null,
      keluar: 15,
    },
    {
      alat_name: "PIPA 3",
      company_name: "PT Mega Proyek",
      tanggal: "2024-02-12",
      masuk: null,
      keluar: 10,
    },
    {
      alat_name: "PIPA 3",
      company_name: "PT Konstruksi Jaya",
      tanggal: "2024-02-20",
      masuk: 5,
      keluar: null,
    },
  ],
};
