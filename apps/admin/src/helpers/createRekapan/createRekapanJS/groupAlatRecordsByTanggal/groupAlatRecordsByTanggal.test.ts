import groupAlatRecordsByTanggal from "./groupAlatRecordsByTanggal";

describe("groupAlatRecordsByTanggal", () => {
  it("should group records by tanggal within each company", () => {
    const groupedByCompanyName = {
      CompanyA: [
        { tanggal: "2023-01-01", data: 1 },
        { tanggal: "2023-01-01", data: 2 },
        { tanggal: "2023-01-02", data: 3 },
      ],
      CompanyB: [
        { tanggal: "2023-01-01", data: 4 },
        { tanggal: "2023-01-03", data: 5 },
      ],
    };

    const expected = {
      CompanyA: {
        records: {
          "2023-01-01": [
            { tanggal: "2023-01-01", data: 1 },
            { tanggal: "2023-01-01", data: 2 },
          ],
          "2023-01-02": [{ tanggal: "2023-01-02", data: 3 }],
        },
      },
      CompanyB: {
        records: {
          "2023-01-01": [{ tanggal: "2023-01-01", data: 4 }],
          "2023-01-03": [{ tanggal: "2023-01-03", data: 5 }],
        },
      },
    };

    const result = groupAlatRecordsByTanggal(groupedByCompanyName);
    expect(result).toEqual(expected);
  });

  it("should handle an empty object of groupedByCompanyName", () => {
    const groupedByCompanyName = {};

    const expected = {};

    const result = groupAlatRecordsByTanggal(groupedByCompanyName);
    expect(result).toEqual(expected);
  });

  it("should handle companies with no records", () => {
    const groupedByCompanyName = {
      CompanyA: [],
      CompanyB: [],
    };

    const expected = {
      CompanyA: {
        records: {},
      },
      CompanyB: {
        records: {},
      },
    };

    const result = groupAlatRecordsByTanggal(groupedByCompanyName);
    expect(result).toEqual(expected);
  });

  it("should handle a single company with multiple records having the same tanggal", () => {
    const groupedByCompanyName = {
      CompanyA: [
        { tanggal: "2023-01-01", data: 1 },
        { tanggal: "2023-01-01", data: 2 },
      ],
    };

    const expected = {
      CompanyA: {
        records: {
          "2023-01-01": [
            { tanggal: "2023-01-01", data: 1 },
            { tanggal: "2023-01-01", data: 2 },
          ],
        },
      },
    };

    const result = groupAlatRecordsByTanggal(groupedByCompanyName);
    expect(result).toEqual(expected);
  });

  it("should handle a single company with multiple records having different tanggal", () => {
    const groupedByCompanyName = {
      CompanyA: [
        { tanggal: "2023-01-01", data: 1 },
        { tanggal: "2023-01-02", data: 2 },
        { tanggal: "2023-01-03", data: 3 },
      ],
    };

    const expected = {
      CompanyA: {
        records: {
          "2023-01-01": [{ tanggal: "2023-01-01", data: 1 }],
          "2023-01-02": [{ tanggal: "2023-01-02", data: 2 }],
          "2023-01-03": [{ tanggal: "2023-01-03", data: 3 }],
        },
      },
    };

    const result = groupAlatRecordsByTanggal(groupedByCompanyName);
    expect(result).toEqual(expected);
  });
});
