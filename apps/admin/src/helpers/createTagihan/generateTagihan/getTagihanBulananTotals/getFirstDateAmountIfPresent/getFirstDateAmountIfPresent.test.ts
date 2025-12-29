import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import utc from "dayjs/plugin/utc";
import { getFirstDateAmountIfPresent } from "./getFirstDateAmountIfPresent";

dayjs.extend(utc);
dayjs.extend(customParseFormat);

describe("getFirstDateAmountIfPresent", () => {
  it("should return correct first date amount when present", () => {
    const input = {
      "Alat 1": {
        records: [
          { tanggal: "01/07/2024", jumlah: 5 },
          { tanggal: "15/07/2024", jumlah: 3 },
        ],
      },
      "Alat 2": {
        records: [
          { tanggal: "02/07/2024", jumlah: 2 },
          { tanggal: "01/07/2024", jumlah: 4 },
        ],
      },
    };

    const result = getFirstDateAmountIfPresent(input);

    expect(result).toEqual({
      "Alat 1": { firstDateAmount: 5 },
      "Alat 2": { firstDateAmount: 4 },
    });
  });

  it("should return 0 when no first-of-month date is present", () => {
    const input = {
      "Alat 1": {
        records: [
          { tanggal: "02/07/2024", jumlah: 10 },
          { tanggal: "15/07/2024", jumlah: 5 },
        ],
      },
    };

    const result = getFirstDateAmountIfPresent(input);

    expect(result).toEqual({
      "Alat 1": { firstDateAmount: 0 },
    });
  });

  it("should return 0 when records array is empty", () => {
    const input = {
      "Alat 1": {
        records: [],
      },
    };

    const result = getFirstDateAmountIfPresent(input);

    expect(result).toEqual({
      "Alat 1": { firstDateAmount: 0 },
    });
  });

  it("should ignore zero amounts on first of month", () => {
    const input = {
      "Alat 1": {
        records: [
          { tanggal: "01/07/2024", jumlah: 3 },
          { tanggal: "01/07/2024", jumlah: 0 },
        ],
      },
    };

    const result = getFirstDateAmountIfPresent(input);

    expect(result).toEqual({
      "Alat 1": { firstDateAmount: 3 },
    });
  });
});
