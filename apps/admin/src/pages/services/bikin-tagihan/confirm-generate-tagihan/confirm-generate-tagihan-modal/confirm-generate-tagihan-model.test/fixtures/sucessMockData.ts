import { HargaAlat } from "../../../../../../../hooks/useGetAllHargaAlat";

export const hargaAlatMockData = [
  {
    name: "TANGGA 190",
    harga_bulanan: 100,
    harga_harian: 3.33,
  },
  {
    name: "PIPA 2",
    harga_bulanan: 200,
    harga_harian: 6.67,
  },
  {
    name: "PIPA 3",
    harga_bulanan: 300,
    harga_harian: 10,
  },
] satisfies HargaAlat[];

export const mockSelectedCompanyName = "Company A";

export const mockWorksheetData = [
  {
    Tanggal: "Total Sewa Periode December",
    "TANGGA 190": 0,
    "PIPA 2": 0,
    "PIPA 3": 0,
  },
  {
    Tanggal: "16/01/2024",
    "TANGGA 190": 0,
    "PIPA 2": 0,
    "PIPA 3": 0,
  },
  {
    Tanggal: "Total Sewa Periode January",
    "TANGGA 190": 0,
    "PIPA 2": 0,
    "PIPA 3": 0,
  },
];
