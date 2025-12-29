import { HargaAlatSchema } from "#src/types/schemas.js";
import { fromPartial } from "@total-typescript/shoehorn";
import { validateInitialStokValue } from "./validateInitialHargas";

describe("validateInitialStokValue", () => {
  const selectedAlatName = "Test Alat";

  it("should not throw an error when harga has exactly one item", () => {
    const harga: HargaAlatSchema = fromPartial([{ name: "Test Alat" }]);
    expect(() =>
      validateInitialStokValue({ harga, selectedAlatName })
    ).not.toThrow();
  });

  it("should throw an error when harga is empty", () => {
    const harga: HargaAlatSchema = [];
    expect(() => validateInitialStokValue({ harga, selectedAlatName })).toThrow(
      `No records found when searching for ${selectedAlatName}`
    );
  });

  it("should throw an error when harga has more than one item", () => {
    const harga: HargaAlatSchema = fromPartial([
      { name: "Test Alat 1" },
      { name: "Test Alat 2" },
    ]);
    expect(() => validateInitialStokValue({ harga, selectedAlatName })).toThrow(
      `More than one record found when searching for ${selectedAlatName}`
    );
  });

  it("should work with different selectedAlatName values", () => {
    const harga: HargaAlatSchema = [];
    const customAlatName = "Custom Alat";
    expect(() =>
      validateInitialStokValue({ harga, selectedAlatName: customAlatName })
    ).toThrow(`No records found when searching for ${customAlatName}`);
  });
});
