import { ExampleStokAlatData } from "./types";

// PIPA 2 transactions - matches the "PIPA 2" column in the rekapan output
export const exampleStokAlat1: ExampleStokAlatData = {
  title: "PIPA 2",
  records: [
    // January transactions
    {
      alat_name: "PIPA 2",
      company_name: "PT Konstruksi Jaya",
      tanggal: "2024-01-10",
      masuk: null,
      keluar: 30,
    },
    {
      alat_name: "PIPA 2",
      company_name: "PT Bangunan Prima",
      tanggal: "2024-01-15",
      masuk: null,
      keluar: 20,
    },

    // February transactions
    {
      alat_name: "PIPA 2",
      company_name: "PT Konstruksi Jaya",
      tanggal: "2024-02-05",
      masuk: null,
      keluar: 25,
    },
    {
      alat_name: "PIPA 2",
      company_name: "PT Bangunan Prima",
      tanggal: "2024-02-12",
      masuk: 10,
      keluar: null,
    },
    {
      alat_name: "PIPA 2",
      company_name: "PT Mega Proyek",
      tanggal: "2024-02-20",
      masuk: null,
      keluar: 15,
    },
  ],
};
