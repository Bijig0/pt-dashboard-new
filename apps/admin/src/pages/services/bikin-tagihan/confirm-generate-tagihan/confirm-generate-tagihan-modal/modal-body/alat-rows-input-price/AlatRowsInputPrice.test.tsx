import {
  cleanup,
  fireEvent,
  prettyDOM,
  render,
  screen,
  within,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import * as GetHarianHargaSewaModule from "../../../../../../../helpers/createTagihan/convertTagihanJSToWorkbook/createHargaSewaToDisplay/getHarianHargaSewa/getHarianHargaSewa";
import { useGenerateTagihanStore } from "../../../store";
import { AlatRowsInputPrice } from "./AlatRowsInputPrice";

const alatNames = ["Alat 1", "Alat 2", "Alat 3"];

const UPDATE_HARGA_BUTTON_TEXT = "Update Hargas";

const initialStoreState = useGenerateTagihanStore.getState();
describe("AlatRowsInputPrice", () => {
  afterEach(() => {
    cleanup();
    useGenerateTagihanStore.setState(initialStoreState, true);
  });

  describe("Other logic", () => {
    it("should render all the alat rows it's given", () => {
      render(<AlatRowsInputPrice alatNames={alatNames} />);
      const alatRows = screen.getAllByRole("row");
      expect(alatRows).toHaveLength(alatNames.length);
    });
  });

  describe("update harga button presence", () => {
    it("should render an update harga button if there are missing alats", () => {
      render(<AlatRowsInputPrice alatNames={alatNames} />);
      const updateHargasButton = screen.getByText(UPDATE_HARGA_BUTTON_TEXT);
      expect(updateHargasButton).toBeInTheDocument();
    });

    it("should not render an update harga button if there are no missing alats", () => {
      render(<AlatRowsInputPrice alatNames={[]} />);
      const updateHargasButton = screen.queryByText(UPDATE_HARGA_BUTTON_TEXT);
      expect(updateHargasButton).not.toBeInTheDocument();
    });
  });

  describe("the interaction when you type in harga bulanan and harga harian", () => {
    vi.spyOn(GetHarianHargaSewaModule, "getHarianHargaSewa").mockReturnValue(
      10
    );

    it("should display the harga bulanan and harga harian in an alat row", () => {
      render(<AlatRowsInputPrice alatNames={alatNames} />);

      const rows = screen.getAllByRole("row");
      const firstRow = rows[0]!;
      expect(firstRow).toHaveTextContent("Alat 1");

      const hargaBulananInput =
        within(firstRow).getByLabelText("Harga Bulanan");
      const hargaHarianInput = within(firstRow).getByLabelText("Harga Harian");

      expect(hargaBulananInput).toBeInTheDocument();
      expect(hargaHarianInput).toBeInTheDocument();
    });

    it("should update the harga bulanan when a number is inputted into itself", () => {
      render(<AlatRowsInputPrice alatNames={alatNames} />);

      const rows = screen.getAllByRole("row");
      const firstRow = rows[0]!;

      const hargaBulananInput =
        within(firstRow).getByLabelText("Harga Bulanan");

      console.log(prettyDOM(hargaBulananInput));

      fireEvent.change(hargaBulananInput, { target: { value: 100 } });

      expect(hargaBulananInput).toHaveValue(100);
    });

    it("should update the harga harian when a harga bulanan is inputted", () => {
      render(<AlatRowsInputPrice alatNames={alatNames} />);

      const rows = screen.getAllByRole("row");
      const firstRow = rows[0]!;

      const hargaBulananInput =
        within(firstRow).getByLabelText("Harga Bulanan");

      fireEvent.change(hargaBulananInput, { target: { value: 100 } });

      const hargaHarianInput = within(firstRow).getByLabelText("Harga Harian");

      expect(hargaHarianInput).toHaveValue(10);
    });

    it("should not update the harga bulanan when a harga harian is inputted", () => {
      render(<AlatRowsInputPrice alatNames={alatNames} />);

      const rows = screen.getAllByRole("row");
      const firstRow = rows[0]!;

      const hargaBulananInput =
        within(firstRow).getByLabelText("Harga Bulanan");

      fireEvent.change(hargaBulananInput, { target: { value: 300 } });

      const hargaHarianInput = within(firstRow).getByLabelText("Harga Harian");

      expect(hargaHarianInput).toHaveValue(10);

      fireEvent.change(hargaHarianInput, { target: { value: 100 } });

      const expectHargaHarianChangeNotToAffectHargaBulanan = () => {
        expect(hargaHarianInput).toHaveValue(100);
        expect(hargaBulananInput).toHaveValue(300);
      };

      expectHargaHarianChangeNotToAffectHargaBulanan();
    });
  });

  describe("interaction of AlatRowsInputPrice with the confirm update harga modal", () => {
    it("should show the inputted harga on one page in the confirm update harga modal", async () => {
      const alatNames = ["Alat 1"];
      render(<AlatRowsInputPrice alatNames={alatNames} />);

      const rows = screen.getAllByRole("row");
      const firstRow = rows[0]!;

      const hargaBulananInput =
        within(firstRow).getByLabelText("Harga Bulanan");

      const hargaHarianInput = within(firstRow).getByLabelText("Harga Harian");

      fireEvent.change(hargaBulananInput, { target: { value: 100 } });

      expect(hargaBulananInput).toHaveValue(100);
      expect(hargaHarianInput).toHaveValue(10);

      const updateHargaButton = screen.getByText(UPDATE_HARGA_BUTTON_TEXT);

      userEvent.click(updateHargaButton!);

      const updateHargaModal = await screen.findByRole("dialog");

      const updateHargaModalRows =
        within(updateHargaModal).getAllByTestId("table-row-element");

      const updateHargaModalFirstRow = updateHargaModalRows[0]!;

      const cells = within(updateHargaModalFirstRow).getAllByRole("cell");

      expect(cells[0]).toHaveTextContent("Alat 1");
      expect(cells[1]).toHaveTextContent("100");
      expect(cells[2]).toHaveTextContent("10");
    });
  });
});
