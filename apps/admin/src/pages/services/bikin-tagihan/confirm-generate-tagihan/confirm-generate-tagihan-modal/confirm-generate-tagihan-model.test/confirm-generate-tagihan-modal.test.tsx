import { composeStories } from "@storybook/react";
import { fireEvent, prettyDOM, within } from "@testing-library/react";
import { vi } from "vitest";
import * as UseGetAllHargaAlatModule from "../../../../../../hooks/useGetAllHargaAlat";
import { renderWithClient } from "../../../../../../tests/utils";
import ConfirmGenerateTagihanModal from "../confirm-generate-tagihan-modal";
import * as stories from "../confirm-generate-tagihan-modal.stories";
import { missingOneAlatHargaAlatMockData } from "./fixtures/alats-dont-have-associated-prices";
import {
  hargaAlatMockData,
  mockSelectedCompanyName,
  mockWorksheetData,
} from "./fixtures/sucessMockData";

const { AllAlatsPresent } = composeStories(stories);

// takes in all the alats, and renders them onto the modal as much as possible
// for the alats that aren't present, it should then have some text like
// separate the two, if all alats are present then have green text that says All Alats Present
// Otherwise have a separator, the first part is the Some Alat Prices Are Missing
//

describe("confirm-generate-tagihan-modal", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("should show a success text if all alats have associated prices", () => {
    vi.spyOn(UseGetAllHargaAlatModule, "useGetAllHargaAlat").mockReturnValue({
      data: hargaAlatMockData,
      isLoading: false,
      error: null,
    } as any);

    const { getByText, getByRole, getByTestId } = renderWithClient(
      <ConfirmGenerateTagihanModal
        selectedCompanyName={mockSelectedCompanyName}
        worksheetData={mockWorksheetData as any}
      />
    );

    const confirmGenerateTagihanButton = getByRole("button");

    fireEvent.click(confirmGenerateTagihanButton);

    const modalOverlay = getByTestId("modal-overlay");

    expect(modalOverlay).toBeInTheDocument();

    // I expect there to be green text saying all alats are present
    expect(getByTestId("all-alat-prices-present-text")).toBeInTheDocument();

    // Ensure the text "Present Alat Prices" is in the document
    // expect(getByTestId("alat-prices-missing-text")).toBeInTheDocument();

    // And all the alats with all the prices listed
    const table = getByRole("table");
    const rows = within(table).getAllByRole("row");

    console.log(
      rows.map((row) => {
        console.log(prettyDOM(row));
        return row;
      })
    );

    expect(getByText("Nama Alat")).toBeInTheDocument();
    expect(getByText("Harga Bulanan")).toBeInTheDocument();
    expect(getByText("Harga Harian")).toBeInTheDocument();

    const rowsWithoutHeader = rows;

    expect(rowsWithoutHeader).toHaveLength(3);

    const rowOne = rowsWithoutHeader[0]; // Adjust the index based on your table structure (0 might be header)

    // Find all cells within that rowOne
    const rowOnecells = within(rowOne!).getAllByRole("cell");

    // Assert the text content of each cell
    expect(rowOnecells[0]).toHaveTextContent("TANGGA 190");
    expect(rowOnecells[1]).toHaveTextContent("100");
    expect(rowOnecells[2]).toHaveTextContent("3.33");

    const rowTwo = rowsWithoutHeader[1]; // Adjust the index based on your table structure (0 might be header)

    // Find all cells within that rowTwo
    const rowTwocells = within(rowTwo!).getAllByRole("cell");

    // Assert the text content of each cell
    expect(rowTwocells[0]).toHaveTextContent("PIPA 2"); // or whatever text you expect
    expect(rowTwocells[1]).toHaveTextContent("200"); // or whatever text you expect for harga_bulanan
    expect(rowTwocells[2]).toHaveTextContent("6.67");

    const rowThree = rowsWithoutHeader[2]; // Adjust the index based on your table structure (0 might be header)

    // Find all cells within that rowThree
    const rowThreeCells = within(rowThree!).getAllByRole("cell");

    // Assert the text content of each cell
    expect(rowThreeCells[0]).toHaveTextContent("PIPA 3"); // or whatever text you expect
    expect(rowThreeCells[1]).toHaveTextContent("300"); // or whatever text you expect for harga_bulanan
    expect(rowThreeCells[2]).toHaveTextContent("10");
  });

  it("should show a warning text if some alats don't have associated prices", () => {
    vi.spyOn(UseGetAllHargaAlatModule, "useGetAllHargaAlat").mockReturnValue({
      data: missingOneAlatHargaAlatMockData,
      isLoading: false,
      error: null,
    } as any);

    const { queryByText, getByRole, getByTestId } = renderWithClient(
      <ConfirmGenerateTagihanModal
        selectedCompanyName={mockSelectedCompanyName}
        worksheetData={mockWorksheetData as any}
      />
    );

    const confirmGenerateTagihanButton = getByRole("button");

    fireEvent.click(confirmGenerateTagihanButton);

    const modalOverlay = getByTestId("modal-overlay");

    expect(modalOverlay).toBeInTheDocument();

    // I expect there to be green text saying all alats are present
    expect(getByTestId("alat-prices-missing-text")).toBeInTheDocument();

    // Ensure the text "Present Alat Prices" is in the document
    // expect(getByTestId("alat-prices-missing-text")).toBeInTheDocument();

    // And all the alats with all the prices listed
    const table = getByRole("table");
    const rows = within(table).getAllByRole("row");

    console.log(
      rows.map((row) => {
        console.log(prettyDOM(row));
        return row;
      })
    );

    // expect(queryByText("Nama Alat")).toBeInTheDocument();
    // expect(queryByText("Harga Bulanan")).toBeInTheDocument();
    // expect(queryByText("Harga Harian")).toBeInTheDocument();

    const rowsWithoutHeader = rows;

    expect(rowsWithoutHeader).toHaveLength(2);

    const rowOne = rowsWithoutHeader[0]; // Adjust the index based on your table structure (0 might be header)

    // Find all cells within that rowOne
    const rowOnecells = within(rowOne!).getAllByRole("cell");

    // Assert the text content of each cell
    expect(rowOnecells[0]).toHaveTextContent("TANGGA 190");
    expect(rowOnecells[1]).toHaveTextContent("100");
    expect(rowOnecells[2]).toHaveTextContent("3.33");

    const rowTwo = rowsWithoutHeader[1]; // Adjust the index based on your table structure (0 might be header)

    // Find all cells within that rowTwo
    const rowTwocells = within(rowTwo!).getAllByRole("cell");

    // Assert the text content of each cell
    expect(rowTwocells[0]).toHaveTextContent("PIPA 2"); // or whatever text you expect
    expect(rowTwocells[1]).toHaveTextContent("200"); // or whatever text you expect for harga_bulanan
    expect(rowTwocells[2]).toHaveTextContent("6.67");
  });

  describe("generate tagihan button display", () => {
    const CONFIRM_GENERATE_TAGIHAN_BUTTON_TEXT = "Generate Tagihan";

    it("should show the generate tagihan button if there are no invalid alat prices", () => {
      vi.spyOn(UseGetAllHargaAlatModule, "useGetAllHargaAlat").mockReturnValue({
        data: hargaAlatMockData,
        isLoading: false,
        error: null,
      } as any);

      const { queryByText, getByText, getByTestId, getByRole } =
        renderWithClient(
          <ConfirmGenerateTagihanModal
            selectedCompanyName={mockSelectedCompanyName}
            worksheetData={mockWorksheetData as any}
          />
        );

      const confirmGenerateTagihanButton = getByRole("button");

      fireEvent.click(confirmGenerateTagihanButton);

      const modalOverlay = getByTestId("modal-overlay");

      expect(modalOverlay).toBeInTheDocument();

      const generateTagihanButton = getByText(
        CONFIRM_GENERATE_TAGIHAN_BUTTON_TEXT
      );

      expect(generateTagihanButton).toBeInTheDocument();
    });

    it("should hide the generate tagihan button if there are invalid alat prices", () => {
      vi.spyOn(UseGetAllHargaAlatModule, "useGetAllHargaAlat").mockReturnValue({
        data: missingOneAlatHargaAlatMockData,
        isLoading: false,
        error: null,
      } as any);

      const { queryByText, getByText, getByRole, getByTestId } =
        renderWithClient(
          <ConfirmGenerateTagihanModal
            selectedCompanyName={mockSelectedCompanyName}
            worksheetData={mockWorksheetData as any}
          />
        );

      const confirmGenerateTagihanButton = getByRole("button");

      fireEvent.click(confirmGenerateTagihanButton);

      const modalOverlay = getByTestId("modal-overlay");

      expect(modalOverlay).toBeInTheDocument();

      const generateTagihanButton = queryByText(
        CONFIRM_GENERATE_TAGIHAN_BUTTON_TEXT
      );

      expect(generateTagihanButton).not.toBeInTheDocument();
    });
  });

  it.todo("should allow you to edit existing alat prices");
});
