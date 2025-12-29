import { buildInitialRekapanFromValues, InitialTotalSewaAlat } from "./buildInitialRekapanFromValues";

describe("buildInitialRekapanFromValues", () => {
  it("should create a RekapanWorkbookObj with proper header containing alat names", () => {
    const currentMonthData = [
      { company_name: { name: "Company A" }, alat_name: { name: "Alat1" } },
      { company_name: { name: "Company A" }, alat_name: { name: "Alat2" } },
      { company_name: { name: "Company B" }, alat_name: { name: "Alat3" } },
    ];

    // Per-company initial values
    const initialTotalSewaAlat: InitialTotalSewaAlat = {
      "Company A": {
        Alat1: 100,
        Alat2: 200,
      },
      "Company B": {
        Alat3: 50,
      },
    };

    const result = buildInitialRekapanFromValues(currentMonthData, initialTotalSewaAlat);

    // Company A should have header with Tanggal, Alat1, Alat2
    expect(result["Company A"]).toBeDefined();
    expect(result["Company A"].header).toBeDefined();
    expect(Object.keys(result["Company A"].header)).toContain("Tanggal");
    expect(Object.keys(result["Company A"].header)).toContain("Alat1");
    expect(Object.keys(result["Company A"].header)).toContain("Alat2");

    // Company B should have header with Tanggal, Alat3
    expect(result["Company B"]).toBeDefined();
    expect(result["Company B"].header).toBeDefined();
    expect(Object.keys(result["Company B"].header)).toContain("Tanggal");
    expect(Object.keys(result["Company B"].header)).toContain("Alat3");

    // Headers should have colIndex
    expect(result["Company A"].header["Tanggal"]).toEqual({ colIndex: 0 });
    expect(result["Company A"].header["Alat1"]).toHaveProperty("colIndex");
    expect(result["Company A"].header["Alat2"]).toHaveProperty("colIndex");
  });

  it("should create currentBulanTotalSewaAlatAmount with initial values per company", () => {
    const currentMonthData = [
      { company_name: { name: "Company A" }, alat_name: { name: "Alat1" } },
    ];

    // Per-company initial values
    const initialTotalSewaAlat: InitialTotalSewaAlat = {
      "Company A": {
        Alat1: 150,
      },
    };

    const result = buildInitialRekapanFromValues(currentMonthData, initialTotalSewaAlat);

    expect(result["Company A"].currentBulanTotalSewaAlatAmount).toEqual({
      Alat1: 150,
    });
  });

  it("should default to 0 for alat not in company's initialTotalSewaAlat", () => {
    const currentMonthData = [
      { company_name: { name: "Company A" }, alat_name: { name: "Alat1" } },
      { company_name: { name: "Company A" }, alat_name: { name: "Alat2" } },
    ];

    // Per-company initial values - Alat2 not provided for Company A
    const initialTotalSewaAlat: InitialTotalSewaAlat = {
      "Company A": {
        Alat1: 100,
        // Alat2 not provided
      },
    };

    const result = buildInitialRekapanFromValues(currentMonthData, initialTotalSewaAlat);

    expect(result["Company A"].currentBulanTotalSewaAlatAmount).toEqual({
      Alat1: 100,
      Alat2: 0, // Should default to 0
    });
  });

  it("should default to 0 when company has no entry in initialTotalSewaAlat", () => {
    const currentMonthData = [
      { company_name: { name: "Company A" }, alat_name: { name: "Alat1" } },
      { company_name: { name: "Company B" }, alat_name: { name: "Alat2" } },
    ];

    // Only Company A has initial values
    const initialTotalSewaAlat: InitialTotalSewaAlat = {
      "Company A": {
        Alat1: 100,
      },
      // Company B not provided
    };

    const result = buildInitialRekapanFromValues(currentMonthData, initialTotalSewaAlat);

    expect(result["Company A"].currentBulanTotalSewaAlatAmount).toEqual({
      Alat1: 100,
    });
    // Company B should default to 0
    expect(result["Company B"].currentBulanTotalSewaAlatAmount).toEqual({
      Alat2: 0,
    });
  });

  it("should have empty records and prevBulanTotalSewaAlatAmount", () => {
    const currentMonthData = [
      { company_name: { name: "Company A" }, alat_name: { name: "Alat1" } },
    ];

    const initialTotalSewaAlat: InitialTotalSewaAlat = {};

    const result = buildInitialRekapanFromValues(currentMonthData, initialTotalSewaAlat);

    expect(result["Company A"].records).toEqual([]);
    expect(result["Company A"].prevBulanTotalSewaAlatAmount).toEqual({});
  });
});
