import { fromPartial } from "@total-typescript/shoehorn";
import { vi } from "vitest";
import * as UseGetRekapanDataModule from "../../../hooks/useGetRekapanData";

vi.spyOn(UseGetRekapanDataModule, "default").mockImplementation(() => {
  return fromPartial({
    data: {
      prevBulanTotalSewaAlatAmount: {
        Tanggal: "Sisa Alat",
        "MF 190": 20,
        Catwalk: 30,
        "NO PO": 40,
      },
      currentBulanTotalSewaAlatAmount: {
        Tanggal: "Sisa Alat",
        "MF 190": 25,
        Catwalk: 35,
        "NO PO": 40,
      },
      header: {
        Tanggal: { colIndex: 0 },
        "MF 190": { colIndex: 1 },
        Catwalk: { colIndex: 2 },
        "NO PO": { colIndex: 3 },
      },
      records: [
        {
          Tanggal: "03/06/2024",
          "MF 190": 20,
          Catwalk: 30,
          "NO PO": 20,
        },
        {
          Tanggal: "10/06/2024",
          "MF 190": 22,
          Catwalk: 28,
          "NO PO": 22,
        },
        {
          Tanggal: "15/06/2024",
          "MF 190": 21,
          Catwalk: 29,
          "NO PO": 21,
        },
      ],
    },
    isLoading: false,
    error: null,
  });
});

describe("bikinTagihan", () => {
  it.todo(`should ask to synchronize current alats with the 
    database alats if current alats are not present in the db`);
});
