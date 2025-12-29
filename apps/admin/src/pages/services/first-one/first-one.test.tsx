import dayjsUtc from "@dayjsutc";
import { cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { RouterProvider, createMemoryRouter } from "react-router";
import { vi } from "vitest";
import { renderWithClient } from "../../../tests/utils";
import { WorksheetDataSchema } from "../../../types/schemas";
import FirstOne from "./first-one";

vi.mock("./metadata-sidebar/alat-name-dropdown/alat-name-dropdown.tsx");

vi.mock("./metadata-sidebar/alat-initial-stok.tsx");

vi.mock("../../../hooks/useGetAlatNames", () => {
  const alatNamesMockData = ["Alat A", "Alat B"] as const;

  return {
    useGetAlatNames: vi.fn().mockReturnValue({
      data: alatNamesMockData,
      isLoading: false,
      error: null,
    }),
  };
});

vi.mock("../getEndOfMonths", () => {
  return {
    default: vi
      .fn()
      .mockReturnValue([
        new Date("2023-01-31 EDT"),
        new Date("2023-02-28 EDT"),
      ]),
    getCustomDates: vi.fn().mockReturnValue([]),
    addCustomDate: vi.fn().mockReturnValue([]),
    removeCustomDate: vi.fn().mockReturnValue([]),
    updateCustomDate: vi.fn().mockReturnValue([]),
  };
});

vi.mock("../../../hooks/useAvailableMonths", () => {
  return {
    useAvailableMonths: vi.fn().mockReturnValue({
      months: [
        new Date("2023-01-31 EDT"),
        new Date("2023-02-28 EDT"),
      ],
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    }),
  };
});

vi.mock("../../../hooks/useGetWorksheetData", () => {
  const alatNamesMockData = ["Alat A", "Alat B"] as const;

  type AlatNamesMockData = (typeof alatNamesMockData)[number];

  return {
    default: vi
      .fn()
      .mockImplementation((alatName: AlatNamesMockData, date: Date) => {
        console.log({ alatName, date });

        const firstAlatNameData = [
          {
            alat_name: `${alatName}`,
            company_name: "Company",
            keluar: 0,
            masuk: 0,
            tanggal: `${dayjsUtc(date).format("DD/MM/YYYY")}`,
          },
        ] satisfies WorksheetDataSchema;

        const secondAlatNameData = [
          {
            alat_name: `${alatName}`,
            company_name: "Company",
            keluar: 100,
            masuk: 100,
            tanggal: `${dayjsUtc(date).format("DD/MM/YYYY")}`,
          },
        ] satisfies WorksheetDataSchema;

        const data = {
          "Alat A": firstAlatNameData,
          "Alat B": secondAlatNameData,
        } satisfies Record<
          (typeof alatNamesMockData)[number],
          WorksheetDataSchema
        >;

        const selectedData = data[alatName];

        return {
          data: selectedData satisfies WorksheetDataSchema,
          isLoading: false,
          error: null,
        };
      }),
  };
});

describe("first-one", () => {
  afterEach(() => {
    cleanup();
  });

  it("Should pass in and display the correct alat names", async () => {
    vi.doMock("../../../hooks/useGetCompanyNames", () => {
      return {
        useGetCompanyNames: vi.fn().mockReturnValue({
          data: ["Company A", "Company B"],
          isLoading: false,
          error: null,
        }),
      };
    });

    await import("../../../hooks/useGetCompanyNames");

    const router = createMemoryRouter([{ path: "*", element: <FirstOne /> }]);

    const { findByTestId, getByText, getByRole } = renderWithClient(
      <RouterProvider router={router} />
    );

    const user = userEvent.setup();

    const dateChoices = await findByTestId("alat-name-choices");

    expect(dateChoices).toBeInTheDocument();
    expect(dateChoices).toHaveValue("Alat A");
    await user.selectOptions(dateChoices, "Alat B");
    expect(dateChoices).toHaveValue("Alat B");
  });

  it("should change worksheet data according to the change in selected date", async () => {
    const router = createMemoryRouter([{ path: "*", element: <FirstOne /> }]);

    const { findByTestId, getByText, getByRole, findByRole, findAllByRole } =
      renderWithClient(<RouterProvider router={router} />);

    const user = userEvent.setup();

    const dateChoices = await findByTestId("date-select");

    expect(dateChoices).toHaveValue("31 January 2023");

    const beforeSelectTanggalGridCells = await findAllByRole("gridcell", {
      name: "31 January",
    });

    expect(beforeSelectTanggalGridCells).toHaveLength(1);

    await user.selectOptions(dateChoices, "28 February 2023");

    expect(dateChoices).toHaveValue("28 February 2023");

    const afterSelectTanggalGridCells = await findAllByRole("gridcell", {
      name: "28 February",
    });

    expect(afterSelectTanggalGridCells).toHaveLength(1);
  });

  it("should change worksheet data according to the change in selected alat name", async () => {
    const router = createMemoryRouter([{ path: "*", element: <FirstOne /> }]);

    const { findByTestId, getByText, getByRole, findByRole, findAllByRole } =
      renderWithClient(<RouterProvider router={router} />);

    const user = userEvent.setup();

    const alatNameChoices = await findByTestId("alat-name-choices");

    expect(alatNameChoices).toHaveValue("Alat A");

    const alatAMasukAndKeluar = await findAllByRole("gridcell", {
      name: "0",
    });

    // masuk and keluar should be 0
    expect(alatAMasukAndKeluar).toHaveLength(2);

    await user.selectOptions(alatNameChoices, "Alat B");

    expect(alatNameChoices).toHaveValue("Alat B");

    const alatBMasukAndKeluar = await findAllByRole("gridcell", {
      name: "100",
    });

    expect(alatBMasukAndKeluar).toHaveLength(2);
  });
});
