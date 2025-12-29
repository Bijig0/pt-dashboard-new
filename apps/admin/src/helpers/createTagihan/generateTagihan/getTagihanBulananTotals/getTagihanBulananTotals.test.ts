import dayjsUtc from "@dayjsutc";
import { Input } from "../generateTagihan";
import getTagihanBulananTotals from "./getTagihanBulananTotals";

describe("generateTagihanBulananTotals", () => {
  it("should take the jumlah alats from the top row and ONLY use those if there are no negatives and there is no first date amount", () => {
    const records = [
      {
        tanggal: "Total Sewa Alat June",
        alatRecords: [
          {
            alatName: "Alat 1",
            jumlahAlat: 10,
            hargaBulanan: 10,
            hargaHarian: 0.33,
          },
          {
            alatName: "Alat 2",
            jumlahAlat: 15,
            hargaBulanan: 20,
            hargaHarian: 0.67,
          },
          {
            alatName: "Alat 3",
            jumlahAlat: 20,
            hargaBulanan: 30,
            hargaHarian: 1,
          },
        ],
      },
      {
        tanggal: "09/07/2023",
        alatRecords: [
          {
            alatName: "Alat 1",
            jumlahAlat: 30,
            hargaBulanan: 10,
            hargaHarian: 0.33,
          },
          {
            alatName: "Alat 2",
            jumlahAlat: 40,
            hargaBulanan: 20,
            hargaHarian: 0.67,
          },
          {
            alatName: "Alat 3",
            jumlahAlat: 50,
            hargaBulanan: 30,
            hargaHarian: 1,
          },
        ],
      },
      {
        tanggal: "10/07/2023",
        alatRecords: [
          {
            alatName: "Alat 1",
            jumlahAlat: 60,
            hargaBulanan: 10,
            hargaHarian: 0.33,
          },
          {
            alatName: "Alat 2",
            jumlahAlat: 70,
            hargaBulanan: 20,
            hargaHarian: 0.67,
          },
          {
            alatName: "Alat 3",
            jumlahAlat: 80,
            hargaBulanan: 30,
            hargaHarian: 1,
          },
        ],
      },
    ] satisfies Input;

    const result = getTagihanBulananTotals({
      records,
      periodToCreateTagihanFor: dayjsUtc("2024-07-01"),
    });

    const expected = {
      "Alat 1": {
        records: [
          {
            tanggalRange: {
              start: "01/07/2024",
              end: "31/07/2024",
            },
            days: 31,
            jumlah: 10,
          },
        ],
        hargaBulanan: 10,
        hargaHarian: 0.33,
      },
      "Alat 2": {
        records: [
          {
            tanggalRange: {
              start: "01/07/2024",
              end: "31/07/2024",
            },
            days: 31,
            jumlah: 15,
          },
        ],
        hargaBulanan: 20,
        hargaHarian: 0.67,
      },
      "Alat 3": {
        records: [
          {
            tanggalRange: {
              start: "01/07/2024",
              end: "31/07/2024",
            },
            days: 31,
            jumlah: 20,
          },
        ],
        hargaBulanan: 30,
        hargaHarian: 1,
      },
    };

    expect(result).toEqual(expected);
  });

  it("should take the jumlah alats from the top row and first date if present and use those if there are no negatives as well", () => {
    const records = [
      {
        tanggal: "Total Sewa Alat June",
        alatRecords: [
          {
            alatName: "Alat 1",
            jumlahAlat: 10,
            hargaBulanan: 10,
            hargaHarian: 0.33,
          },
          {
            alatName: "Alat 2",
            jumlahAlat: 15,
            hargaBulanan: 20,
            hargaHarian: 0.67,
          },
          {
            alatName: "Alat 3",
            jumlahAlat: 20,
            hargaBulanan: 30,
            hargaHarian: 1,
          },
        ],
      },
      {
        tanggal: "01/07/2023",
        alatRecords: [
          {
            alatName: "Alat 1",
            jumlahAlat: 30,
            hargaBulanan: 10,
            hargaHarian: 0.33,
          },
          {
            alatName: "Alat 2",
            jumlahAlat: 40,
            hargaBulanan: 20,
            hargaHarian: 0.67,
          },
          {
            alatName: "Alat 3",
            jumlahAlat: 50,
            hargaBulanan: 30,
            hargaHarian: 1,
          },
        ],
      },
      {
        tanggal: "10/07/2023",
        alatRecords: [
          {
            alatName: "Alat 1",
            jumlahAlat: 60,
            hargaBulanan: 10,
            hargaHarian: 0.33,
          },
          {
            alatName: "Alat 2",
            jumlahAlat: 70,
            hargaBulanan: 20,
            hargaHarian: 0.67,
          },
          {
            alatName: "Alat 3",
            jumlahAlat: 80,
            hargaBulanan: 30,
            hargaHarian: 1,
          },
        ],
      },
    ] satisfies Input;

    const result = getTagihanBulananTotals({
      records,
      periodToCreateTagihanFor: dayjsUtc("2024-07-01"),
    });

    const expected = {
      "Alat 1": {
        records: [
          {
            tanggalRange: {
              start: "01/07/2024",
              end: "31/07/2024",
            },
            days: 31,
            jumlah: 40,
          },
        ],
        hargaBulanan: 10,
        hargaHarian: 0.33,
      },
      "Alat 2": {
        records: [
          {
            tanggalRange: {
              start: "01/07/2024",
              end: "31/07/2024",
            },
            days: 31,
            jumlah: 55,
          },
        ],
        hargaBulanan: 20,
        hargaHarian: 0.67,
      },
      "Alat 3": {
        records: [
          {
            tanggalRange: {
              start: "01/07/2024",
              end: "31/07/2024",
            },
            days: 31,
            jumlah: 70,
          },
        ],
        hargaBulanan: 30,
        hargaHarian: 1,
      },
    };

    expect(result).toEqual(expected);
  });

  it("should take the jumlah alats from the top row and first date if present and negatives and use those", () => {
    const records = [
      {
        tanggal: "Total Sewa Alat June",
        alatRecords: [
          {
            alatName: "Alat 1",
            jumlahAlat: 10,
            hargaBulanan: 10,
            hargaHarian: 0.33,
          },
          {
            alatName: "Alat 2",
            jumlahAlat: 15,
            hargaBulanan: 20,
            hargaHarian: 0.67,
          },
          {
            alatName: "Alat 3",
            jumlahAlat: 20,
            hargaBulanan: 30,
            hargaHarian: 1,
          },
        ],
      },
      {
        tanggal: "01/07/2023",
        alatRecords: [
          {
            alatName: "Alat 1",
            jumlahAlat: 30,
            hargaBulanan: 10,
            hargaHarian: 0.33,
          },
          {
            alatName: "Alat 2",
            jumlahAlat: 40,
            hargaBulanan: 20,
            hargaHarian: 0.67,
          },
          {
            alatName: "Alat 3",
            jumlahAlat: 50,
            hargaBulanan: 30,
            hargaHarian: 1,
          },
        ],
      },
      {
        tanggal: "15/07/2023",
        alatRecords: [
          {
            alatName: "Alat 1",
            jumlahAlat: 60,
            hargaBulanan: 10,
            hargaHarian: 0.33,
          },
          {
            alatName: "Alat 2",
            jumlahAlat: -70,
            hargaBulanan: 20,
            hargaHarian: 0.67,
          },
          {
            alatName: "Alat 3",
            jumlahAlat: 80,
            hargaBulanan: 30,
            hargaHarian: 1,
          },
        ],
      },
      {
        tanggal: "18/07/2023",
        alatRecords: [
          {
            alatName: "Alat 1",
            jumlahAlat: 60,
            hargaBulanan: 10,
            hargaHarian: 0.33,
          },
          {
            alatName: "Alat 2",
            jumlahAlat: 70,
            hargaBulanan: 20,
            hargaHarian: 0.67,
          },
          {
            alatName: "Alat 3",
            jumlahAlat: -80,
            hargaBulanan: 30,
            hargaHarian: 1,
          },
        ],
      },
    ] satisfies Input;

    const result = getTagihanBulananTotals({
      records,
      periodToCreateTagihanFor: dayjsUtc("2024-07-01"),
    });

    const expected = {
      "Alat 1": {
        records: [
          {
            tanggalRange: {
              start: "01/07/2024",
              end: "31/07/2024",
            },
            days: 31,
            jumlah: 40,
          },
        ],
        hargaBulanan: 10,
        hargaHarian: 0.33,
      },
      "Alat 2": {
        records: [
          {
            tanggalRange: {
              start: "01/07/2024",
              end: "31/07/2024",
            },
            days: 31,
            jumlah: -15,
          },
        ],
        hargaBulanan: 20,
        hargaHarian: 0.67,
      },
      "Alat 3": {
        records: [
          {
            tanggalRange: {
              start: "01/07/2024",
              end: "31/07/2024",
            },
            days: 31,
            jumlah: -10,
          },
        ],
        hargaBulanan: 30,
        hargaHarian: 1,
      },
    };

    expect(result).toEqual(expected);
  });
});
