import { addBulananRecord } from "./addBulananRecord";

describe("addBulananRecord", () => {
  it("should transform the input correctly", () => {
    const input = {
      tanggalStart: "01/01/2023",
      tanggalEnd: "31/01/2023",
      daysInMonth: 31,
      bulananJumlah: {
        alat1: {
          bulananJumlah: 10,
        },
        alat2: {
          bulananJumlah: 20,
        },
      },
    };

    const expectedOutput = {
      alat1: {
        records: [
          {
            tanggalRange: {
              start: "01/01/2023",
              end: "31/01/2023",
            },
            days: 31,
            jumlah: 10,
          },
        ],
      },
      alat2: {
        records: [
          {
            tanggalRange: {
              start: "01/01/2023",
              end: "31/01/2023",
            },
            days: 31,
            jumlah: 20,
          },
        ],
      },
    };

    expect(addBulananRecord(input)).toEqual(expectedOutput);
  });

  it("should handle empty input", () => {
    const input = {
      tanggalStart: "01/01/2023",
      tanggalEnd: "31/01/2023",
      daysInMonth: 31,
      bulananJumlah: {},
    };

    const expectedOutput = {};

    expect(addBulananRecord(input)).toEqual(expectedOutput);
  });

  it("should handle single entry input", () => {
    const input = {
      tanggalStart: "01/02/2023",
      tanggalEnd: "28/02/2023",
      daysInMonth: 28,
      bulananJumlah: {
        alat1: {
          bulananJumlah: 15,
        },
      },
    };

    const expectedOutput = {
      alat1: {
        records: [
          {
            tanggalRange: {
              start: "01/02/2023",
              end: "28/02/2023",
            },
            days: 28,
            jumlah: 15,
          },
        ],
      },
    };

    expect(addBulananRecord(input)).toEqual(expectedOutput);
  });
});
