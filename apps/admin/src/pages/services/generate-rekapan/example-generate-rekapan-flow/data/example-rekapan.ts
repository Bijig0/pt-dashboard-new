import { ExampleRekapanData } from "./types";

/**
 * Generated Rekapan Output
 *
 * This represents the summary report generated from Stok Alat transactions.
 * The rekapan aggregates equipment movements across all companies by date.
 *
 * Equipment columns match the Stok Alat tabs:
 * - PIPA 2 column ← aggregates all transactions from "PIPA 2" tab
 * - PIPA 3 column ← aggregates all transactions from "PIPA 3" tab
 *
 * How it works:
 * - Each date row shows the total net change for each equipment type on that date
 * - "Total Sewa Periode" rows show cumulative totals up to that month
 * - Negative numbers = equipment going out (keluar)
 * - Positive numbers = equipment coming back (masuk)
 *
 * Examples:
 * - Feb 05: PIPA 2: -25 (PT Konstruksi Jaya keluar 25)
 * - Feb 12: PIPA 2: +10 (PT Bangunan Prima masuk 10)
 * - Feb 20: PIPA 3: +5 (PT Konstruksi Jaya masuk 5)
 *
 * Total Sewa Periode February = January + all February transactions
 * - PIPA 2: -80 = -50 (Jan) + -25 + +10 + -15
 * - PIPA 3: -50 = -30 (Jan) + -15 + -10 + +5
 */
export const exampleRekapan: ExampleRekapanData = {
  equipmentNames: ["PIPA 2", "PIPA 3"],
  rows: [
    {
      tanggal: "Total Sewa Periode January",
      isSummaryRow: true,
      equipmentQuantities: {
        "PIPA 2": -50,
        "PIPA 3": -30,
      },
    },
    {
      tanggal: "05/02/2024",
      isSummaryRow: false,
      equipmentQuantities: {
        "PIPA 2": -25,
        "PIPA 3": -15,
      },
    },
    {
      tanggal: "12/02/2024",
      isSummaryRow: false,
      equipmentQuantities: {
        "PIPA 2": 10,
        "PIPA 3": -10,
      },
    },
    {
      tanggal: "20/02/2024",
      isSummaryRow: false,
      equipmentQuantities: {
        "PIPA 2": -15,
        "PIPA 3": 5,
      },
    },
    {
      tanggal: "Total Sewa Periode February",
      isSummaryRow: true,
      equipmentQuantities: {
        "PIPA 2": -80,
        "PIPA 3": -50,
      },
    },
  ],
};
