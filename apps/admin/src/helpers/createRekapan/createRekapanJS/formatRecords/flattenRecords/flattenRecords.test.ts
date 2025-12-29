import { flattenRecords } from "./flattenRecords";

describe("flattenRecords", () => {
  it("should flatten records correctly", () => {
    const input = [
      {
        company_name: { name: "Company A" },
        alat_name: { name: "Alat 1" },
        other_field: "value1",
      },
      {
        company_name: { name: "Company B" },
        alat_name: { name: "Alat 2" },
        other_field: "value2",
      },
    ];

    const expected = [
      {
        companyName: "Company A",
        alatName: "Alat 1",
        other_field: "value1",
      },
      {
        companyName: "Company B",
        alatName: "Alat 2",
        other_field: "value2",
      },
    ];

    const result = flattenRecords(input);
    expect(result).toEqual(expected);
  });

  it("should handle empty input array", () => {
    const input: any[] = [];
    const result = flattenRecords(input);
    expect(result).toEqual([]);
  });

  it("should preserve other fields in the record", () => {
    const input = [
      {
        company_name: { name: "Company C" },
        alat_name: { name: "Alat 3" },
        field1: "value1",
        field2: 42,
      },
    ];

    const result = flattenRecords(input);
    expect(result[0]).toHaveProperty("field1", "value1");
    expect(result[0]).toHaveProperty("field2", 42);
  });

  it("should handle records with missing fields", () => {
    const input = [
      {
        company_name: { name: "Company D" },
        alat_name: { name: "Alat 4" },
      },
      {
        company_name: { name: "Company E" },
        alat_name: { name: "Alat 5" },
        additional_field: "extra",
      },
    ];

    const result = flattenRecords(input);
    expect(result).toHaveLength(2);
    expect(result[0]).toEqual({
      companyName: "Company D",
      alatName: "Alat 4",
    });
    expect(result[1]).toEqual({
      companyName: "Company E",
      alatName: "Alat 5",
      additional_field: "extra",
    });
  });
});
