import { cleanup, prettyDOM, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import { renderWithClient } from "../../../../../../tests/utils";
import { SupabaseWorksheetDataSchema } from "../../../getCurrentMonthStokAlatData/supabaseWorksheetDataSchema/supabaseWorksheetDataSchema";
import { ClusteredCompanyNames } from "../types";
import GroupCompanyTypoNamesModal from "./group-company-typo-names-modal";

const currentMonthStokAlatData = [
  {
    alat_name: { name: "Alat A" },
    company_name: { name: "Tech Innovations Inc" },
    keluar: 0,
    masuk: 0,
    tanggal: "28/03/2023",
  },
  {
    alat_name: { name: "Alat A" },
    company_name: { name: "Tech Innovations Incc" },
    keluar: 0,
    masuk: 0,
    tanggal: "30/03/2023",
  },
  {
    alat_name: { name: "Alat A" },
    company_name: { name: "Global Health Corp" },
    keluar: 0,
    masuk: 0,
    tanggal: "31/03/2023",
  },
] satisfies SupabaseWorksheetDataSchema;

vi.mock("../main", () => {
  return {
    doFullThing: vi.fn().mockImplementationOnce((): ClusteredCompanyNames => {
      const clusteredCompanyNames = {
        "Tech Innovations Inc": {
          typoCompanyNames: ["Tech Innovations Inc", "Tech Innovations Incc"],
          correctCompanyName: "Tech Innovations Inc",
          possibleCorrectCompanyNameFromPrevMonthStokAlat: undefined,
        },
        "Global Health Corp": {
          typoCompanyNames: ["Global Health Corp"],
          correctCompanyName: "Global Health Corp",
          possibleCorrectCompanyNameFromPrevMonthStokAlat: undefined,
        },
      };
      return clusteredCompanyNames;
    }),
  };
});

describe("group-company-typo-names", () => {
  afterEach(() => {
    cleanup();
  });

  it("should allow moving a typo company name from one row to the list of another row's typo company names", async () => {
    const showModal = true;
    const handleModalConfirmation = vi.fn();
    const {
      getByTestId,
      getByLabelText,
      getAllByLabelText,
      queryByTestId,
      getByText,
    } = renderWithClient(
      <GroupCompanyTypoNamesModal
        showModal={showModal}
        prevMonthCorrectCompanyNames={undefined}
        currentMonthStokAlatData={currentMonthStokAlatData}
        handleModalConfirmation={handleModalConfirmation}
      />
    );

    const allCorrectCompanyNameDropdownsPreSelection = getAllByLabelText(
      "Correct Company Name Dropdown"
    );

    expect(allCorrectCompanyNameDropdownsPreSelection).toHaveLength(2);

    const preMoveClusteredCompanyNames = [
      ["Global Health Corp"],
      ["Tech Innovations Inc", "Tech Innovations Incc"],
    ] as const;

    const toMoveCompanyName = preMoveClusteredCompanyNames[1][0];
    const destinationCompanyName = preMoveClusteredCompanyNames[0];

    allCorrectCompanyNameDropdownsPreSelection.forEach((each) => {
      console.log(prettyDOM(each));
    });

    expect(
      allCorrectCompanyNameDropdownsPreSelection[0]?.children[0]?.textContent
    ).toEqual(preMoveClusteredCompanyNames[0][0]);
    expect(
      allCorrectCompanyNameDropdownsPreSelection[1]?.children[0]?.textContent
    ).toEqual(preMoveClusteredCompanyNames[1][0]);

    expect(
      allCorrectCompanyNameDropdownsPreSelection[1]?.children[1]?.textContent
    ).toEqual(preMoveClusteredCompanyNames[1][1]);

    const startMoveButton = getByLabelText("Move");

    expect(startMoveButton).toBeInTheDocument();

    await waitFor(async () => {
      startMoveButton.click();
    });

    expect(startMoveButton).toBeChecked();

    const firstRadioButton = getByTestId(`${toMoveCompanyName}-radio-button`);

    await waitFor(async () => {
      firstRadioButton.click();
    });

    expect(firstRadioButton).toBeChecked();

    const lockInCheckbox = getByTestId("lock-in-checkbox");

    await waitFor(async () => {
      lockInCheckbox.click();
    });

    expect(lockInCheckbox).toBeChecked();

    const destinationSelectRadioButton = getByTestId(
      "destination-typo-name-checkbox"
    );

    await waitFor(async () => {
      destinationSelectRadioButton.click();
    });

    expect(destinationSelectRadioButton).toBeChecked();

    const moveToNewButton = queryByTestId("move-to-new-button");

    expect(moveToNewButton).not.toBeInTheDocument();

    const secondSelectButton = getByTestId(
      `${destinationCompanyName}-radio-button`
    );

    await waitFor(async () => {
      secondSelectButton.click();
    });

    expect(secondSelectButton).toBeChecked();

    const lockInDestinationCheckbox = getByTestId(
      "lock-in-destination-checkbox"
    );

    await waitFor(async () => {
      lockInDestinationCheckbox.click();
    });

    expect(lockInDestinationCheckbox).toBeChecked();

    const toMoveSelectionText = getByText(
      `Company Typo Name To Move is ${toMoveCompanyName}`
    );
    expect(toMoveSelectionText).toBeInTheDocument();

    const destinationSelectionText = getByText(
      `Destination Company Typo Names To Move To is ${destinationCompanyName}`
    );
    expect(destinationSelectionText).toBeInTheDocument();

    const confirmMoveToDestinationButton = getByTestId(
      "confirm-move-to-destination-button"
    );

    await waitFor(async () => {
      confirmMoveToDestinationButton.click();
    });

    const expectedPostMove = [
      ["Global Health Corp", "Tech Innovations Inc"],
      ["Tech Innovations Incc"],
    ] as const;

    const allCorrectCompanyNameDropdownsPostMove = getAllByLabelText(
      "Correct Company Name Dropdown"
    );

    expect(allCorrectCompanyNameDropdownsPostMove).toHaveLength(2);

    expect(
      allCorrectCompanyNameDropdownsPostMove[0]?.children[0]?.textContent
    ).toEqual(expectedPostMove[0][0]);
    expect(
      allCorrectCompanyNameDropdownsPostMove[0]?.children[1]?.textContent
    ).toEqual(expectedPostMove[0][1]);

    expect(
      allCorrectCompanyNameDropdownsPostMove[1]?.children[0]?.textContent
    ).toEqual(expectedPostMove[1][0]);
  });
});
