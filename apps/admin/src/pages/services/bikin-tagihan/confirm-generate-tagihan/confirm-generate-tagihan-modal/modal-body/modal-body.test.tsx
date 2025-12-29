import { fireEvent, waitFor, within } from "@storybook/test";
import { cleanup, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Modal } from "flowbite-react";
import { act } from "react";
import { vi } from "vitest";
import * as GetHarianHargaSewaModule from "../../../../../../helpers/createTagihan/convertTagihanJSToWorkbook/createHargaSewaToDisplay/getHarianHargaSewa/getHarianHargaSewa";
import { renderWithClient } from "../../../../../../tests/utils";
import { manyMissingItemsRequiresPagination } from "./fixtures/manyMissingItemsRequiresPagination";
import ModalBody from "./modal-body";

describe("ModalBody", () => {
  const CONFIRM_UPDATE_HARGAS_BUTTON_TEXT = "Confirm Update Hargas";
  const UPDATE_HARGA_BUTTON_TEXT = "Update Hargas";
  afterEach(() => {
    cleanup();
  });

  userEvent.setup();

  vi.spyOn(GetHarianHargaSewaModule, "getHarianHargaSewa").mockReturnValue(10);

  it("should maintain the inputted prices on paginate", () => {
    const ITEMS_PER_PAGE = 2;

    renderWithClient(
      <Modal show>
        <ModalBody
          items={manyMissingItemsRequiresPagination}
          itemsPerPage={ITEMS_PER_PAGE}
        />
      </Modal>
    );

    const rows = screen.getAllByRole("row");
    const firstRow = rows[0]!;

    expect(firstRow).toHaveTextContent("Alat 1");

    const hargaBulananInput = within(firstRow).getByLabelText("Harga Bulanan");

    const hargaHarianInput = within(firstRow).getByLabelText("Harga Harian");

    expect(hargaBulananInput).toBeInTheDocument();

    fireEvent.change(hargaBulananInput, { target: { value: "100" } });

    expect(hargaBulananInput).toHaveValue(100);

    expect(hargaHarianInput).toHaveValue(10);

    const firstPagePaginationLabel = screen.getByLabelText(
      "Page 1 is your current page"
    );

    const secondPagePaginationLabel = screen.getByLabelText("Page 2");

    secondPagePaginationLabel.click();

    firstPagePaginationLabel.click();

    expect(hargaBulananInput).toHaveValue(100);

    expect(hargaHarianInput).toHaveValue(10);
  });

  it("should display all the items (including paginated ones) in the confirm update hargas modal", async () => {
    const ITEMS_PER_PAGE = 2;

    const user = userEvent.setup();

    await act(async () => {
      renderWithClient(
        <Modal show>
          <ModalBody
            items={manyMissingItemsRequiresPagination}
            itemsPerPage={ITEMS_PER_PAGE}
          />
        </Modal>
      );
    });

    const firstPageAllItems = screen.getAllByRole("row");
    expect(firstPageAllItems).toHaveLength(2);
    const firstItem = firstPageAllItems[0]!;
    const firstItemHargaBulananInput =
      within(firstItem).getByLabelText("Harga Bulanan");

    await user.type(firstItemHargaBulananInput, "100");

    const secondItem = firstPageAllItems[1]!;
    const secondItemHargaBulananInput =
      within(secondItem).getByLabelText("Harga Bulanan");

    await user.type(secondItemHargaBulananInput, "200");

    const secondPagePaginationLabel = screen.getByLabelText("Page 2");

    await user.click(secondPagePaginationLabel);

    await waitFor(() => {
      const secondPageAllItems = screen.getAllByRole("row");
      expect(secondPageAllItems).toHaveLength(1);
    });

    const thirdItem = screen.getAllByRole("row")[0]!;
    const thirdItemHargaBulananInput =
      within(thirdItem).getByLabelText("Harga Bulanan");

    await user.type(thirdItemHargaBulananInput, "300");

    const updateHargasButtonText = screen.getByText(UPDATE_HARGA_BUTTON_TEXT);
    await user.click(updateHargasButtonText);

    await waitFor(() => {
      const confirmUpdateHargasButton = screen.getByText(
        CONFIRM_UPDATE_HARGAS_BUTTON_TEXT
      );
      expect(confirmUpdateHargasButton).toBeInTheDocument();
    });

    const confirmUpdateHargasRows = screen.getAllByRole("row");

    const headerRow = confirmUpdateHargasRows[0]!;
    expect(headerRow).toHaveTextContent("Nama Alat");
    expect(headerRow).toHaveTextContent("Harga Bulanan");
    expect(headerRow).toHaveTextContent("Harga Harian");

    const alatHargaRows = confirmUpdateHargasRows.slice(1);

    expect(alatHargaRows).toHaveLength(3);
  });
});
