import { AgGridRow } from "../../../grid"; // adjust the import path as needed
import { createMockRow } from "./createMockRow";
import { getCurrentWorksheetAlatNames } from "./getCurrentWorksheetAlatNames"; // adjust the import path as needed

describe("getCurrentWorksheetAlatNames", () => {
  // Helper function to create a mock AgGridRow

  it('should return all keys except "tanggal"', () => {
    const mockData = [createMockRow(["tanggal", "alat1", "alat2", "alat3"])];
    const result = getCurrentWorksheetAlatNames(mockData);
    expect(result).toEqual(["alat1", "alat2", "alat3"]);
  });

  it('should be case insensitive when filtering out "tanggal"', () => {
    const mockData = [createMockRow(["Tanggal", "alat1", "ALAT2", "Alat3"])];
    const result = getCurrentWorksheetAlatNames(mockData);
    expect(result).toEqual(["alat1", "ALAT2", "Alat3"]);
  });

  it("should throw an error if worksheet data is empty", () => {
    expect(() => getCurrentWorksheetAlatNames([])).toThrow(
      "Worksheet data is empty"
    );
  });

  it('should throw an error if "tanggal" is not should throw an error for non-string keys', () => {
    const mockData = [createMockRow(["alat1", "alat2", "alat3"])];
    expect(() => getCurrentWorksheetAlatNames(mockData)).toThrow();
  });

  it('should return an empty array if only "tanggal" is present', () => {
    const mockData = [createMockRow(["tanggal"])];
    const result = getCurrentWorksheetAlatNames(mockData);
    expect(result).toEqual([]);
  });

  it("should handle mixed case keys correctly", () => {
    const mockData = [createMockRow(["tanggal", "Alat1", "ALAT2", "alat3"])];
    const result = getCurrentWorksheetAlatNames(mockData);
    expect(result).toEqual(["Alat1", "ALAT2", "alat3"]);
  });

  it("should handle keys with special characters", () => {
    const mockData = [createMockRow(["tanggal", "alat-1", "alat_2", "alat 3"])];
    const result = getCurrentWorksheetAlatNames(mockData);
    expect(result).toEqual(["alat-1", "alat_2", "alat 3"]);
  });

  it.skip("should throw an error for non-string keys", () => {
    const mockData = [
      { tanggal: "", 1: "", alat2: "" } as unknown as AgGridRow,
    ];
    expect(() => getCurrentWorksheetAlatNames(mockData)).toThrow();
  });
});
