import { SingleAlat } from "../../../generateTagihan";
import {
  AfterGroupBy,
  groupByTanggalAndJumlahSign,
} from "./groupByTanggalAndJumlahSign";

describe("groupByTanggalAndJumlahSign", () => {
  it("should group by tanggal and jumlah sign correctly", () => {
    const input: SingleAlat = [
      {
        tanggal: "01/07/2023",
        jumlah: 2,
        hargaBulanan: 100,
        hargaHarian: 3.33,
      },
      {
        tanggal: "01/07/2023",
        jumlah: -1,
        hargaBulanan: 100,
        hargaHarian: 3.33,
      },
      {
        tanggal: "02/07/2023",
        jumlah: 3,
        hargaBulanan: 100,
        hargaHarian: 3.33,
      },
      {
        tanggal: "02/07/2023",
        jumlah: -2,
        hargaBulanan: 100,
        hargaHarian: 3.33,
      },
    ];

    const expected = {
      "01/07/2023-Sewa": [
        {
          tanggal: "01/07/2023",
          jumlah: 2,
          hargaBulanan: 100,
          hargaHarian: 3.33,
        },
      ],
      "01/07/2023-Retur": [
        {
          tanggal: "01/07/2023",
          jumlah: -1,
          hargaBulanan: 100,
          hargaHarian: 3.33,
        },
      ],
      "02/07/2023-Sewa": [
        {
          tanggal: "02/07/2023",
          jumlah: 3,
          hargaBulanan: 100,
          hargaHarian: 3.33,
        },
      ],
      "02/07/2023-Retur": [
        {
          tanggal: "02/07/2023",
          jumlah: -2,
          hargaBulanan: 100,
          hargaHarian: 3.33,
        },
      ],
    } satisfies AfterGroupBy;

    const result = groupByTanggalAndJumlahSign(input);
    expect(result).toEqual(expected);
  });

  it("should handle empty input", () => {
    const input: SingleAlat = [];
    const expected = {};
    const result = groupByTanggalAndJumlahSign(input);
    expect(result).toEqual(expected);
  });

  it("should handle input with only positive jumlah", () => {
    const input: SingleAlat = [
      {
        tanggal: "01/07/2023",
        jumlah: 2,
        hargaBulanan: 100,
        hargaHarian: 3.33,
      },
      {
        tanggal: "02/07/2023",
        jumlah: 3,
        hargaBulanan: 100,
        hargaHarian: 3.33,
      },
    ];

    const expected = {
      "01/07/2023-Sewa": [
        {
          tanggal: "01/07/2023",
          jumlah: 2,
          hargaBulanan: 100,
          hargaHarian: 3.33,
        },
      ],
      "02/07/2023-Sewa": [
        {
          tanggal: "02/07/2023",
          jumlah: 3,
          hargaBulanan: 100,
          hargaHarian: 3.33,
        },
      ],
    } satisfies AfterGroupBy;

    const result = groupByTanggalAndJumlahSign(input);
    expect(result).toEqual(expected);
  });

  it("should handle input with only negative jumlah", () => {
    const input: SingleAlat = [
      {
        tanggal: "01/07/2023",
        jumlah: -2,
        hargaBulanan: 100,
        hargaHarian: 3.33,
      },
      {
        tanggal: "02/07/2023",
        jumlah: -3,
        hargaBulanan: 100,
        hargaHarian: 3.33,
      },
    ];

    const expected = {
      "01/07/2023-Retur": [
        {
          tanggal: "01/07/2023",
          jumlah: -2,
          hargaBulanan: 100,
          hargaHarian: 3.33,
        },
      ],
      "02/07/2023-Retur": [
        {
          tanggal: "02/07/2023",
          jumlah: -3,
          hargaBulanan: 100,
          hargaHarian: 3.33,
        },
      ],
    } satisfies AfterGroupBy;

    const result = groupByTanggalAndJumlahSign(input);
    expect(result).toEqual(expected);
  });

  it("should handle input with multiple entries for the same group", () => {
    const input: SingleAlat = [
      {
        tanggal: "01/07/2023",
        jumlah: 2,
        hargaBulanan: 100,
        hargaHarian: 3.33,
      },
      {
        tanggal: "01/07/2023",
        jumlah: 3,
        hargaBulanan: 200,
        hargaHarian: 6.67,
      },
      {
        tanggal: "01/07/2023",
        jumlah: -1,
        hargaBulanan: 100,
        hargaHarian: 3.33,
      },
      {
        tanggal: "01/07/2023",
        jumlah: -2,
        hargaBulanan: 200,
        hargaHarian: 6.67,
      },
    ];

    const expected = {
      "01/07/2023-Sewa": [
        {
          tanggal: "01/07/2023",
          jumlah: 2,
          hargaBulanan: 100,
          hargaHarian: 3.33,
        },
        {
          tanggal: "01/07/2023",
          jumlah: 3,
          hargaBulanan: 200,
          hargaHarian: 6.67,
        },
      ],
      "01/07/2023-Retur": [
        {
          tanggal: "01/07/2023",
          jumlah: -1,
          hargaBulanan: 100,
          hargaHarian: 3.33,
        },
        {
          tanggal: "01/07/2023",
          jumlah: -2,
          hargaBulanan: 200,
          hargaHarian: 6.67,
        },
      ],
    } satisfies AfterGroupBy;

    const result = groupByTanggalAndJumlahSign(input);
    expect(result).toEqual(expected);
  });

  it("should handle input with zero jumlah", () => {
    const input: SingleAlat = [
      {
        tanggal: "01/07/2023",
        jumlah: 0,
        hargaBulanan: 100,
        hargaHarian: 3.33,
      },
      {
        tanggal: "02/07/2023",
        jumlah: 2,
        hargaBulanan: 100,
        hargaHarian: 3.33,
      },
    ];

    const expected = {
      "01/07/2023-Sewa": [
        {
          tanggal: "01/07/2023",
          jumlah: 0,
          hargaBulanan: 100,
          hargaHarian: 3.33,
        },
      ],
      "02/07/2023-Sewa": [
        {
          tanggal: "02/07/2023",
          jumlah: 2,
          hargaBulanan: 100,
          hargaHarian: 3.33,
        },
      ],
    } satisfies AfterGroupBy;

    const result = groupByTanggalAndJumlahSign(input);
    expect(result).toEqual(expected);
  });
});
