import { waitFor } from "@testing-library/react";
import { vi } from "vitest";
import { renderWithClient } from "../../../../../../tests/utils";
import { SupabaseWorksheetDataSchema } from "../../../getCurrentMonthStokAlatData/supabaseWorksheetDataSchema/supabaseWorksheetDataSchema";
import { ClusteredCompanyNames } from "../types";
import GroupCompanyTypoNamesModal from "./group-company-typo-names-modal";

// const clusteredCompanyNames = {
//   "Tech Innovations Inc": {
//     typoCompanyNames: [
//       "Tech Innovtions Inc",
//       "Tech Innov Inc",
//       "TechInovations Inc",
//     ],
//     correctCompanyName: "Tech Innovations Inc",
//     possibleCorrectCompanyNameFromPrevMonthStokAlat: "Tech Innovations",
//     split: true,
//   },
//   "Green Energy Solutions": {
//     typoCompanyNames: [
//       "Green Engery Solutions",
//       "Green Enegry Solutions",
//       "Green Energy Solutons",
//     ],
//     correctCompanyName: "Green Energy Solutions",
//     possibleCorrectCompanyNameFromPrevMonthStokAlat: undefined,
//   },
//   "Global Health Corp": {
//     typoCompanyNames: [
//       "Globl Health Corp",
//       "Global Healt Corp",
//       "GlobalHealth Corp",
//     ],
//     correctCompanyName: "Global Health Corp",
//     possibleCorrectCompanyNameFromPrevMonthStokAlat: "Global Health Co.",
//   },
// } satisfies ClusteredCompanyNames;

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
  it("should allow moving a typo company name from an existing row to its own new row", async () => {
    const showModal = true;
    const handleModalConfirmation = vi.fn();
    const {
      getByTestId,
      getByLabelText,
      getAllByLabelText,
      queryAllByLabelText,
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

    const preSelectionExpectedClusteredCompanyNames = [
      "Tech Innovations Inc",
      "Global Health Corp",
    ];
    allCorrectCompanyNameDropdownsPreSelection.forEach((each) => {
      const selectedCompanyName = each.children[0]!.textContent!;
      expect(preSelectionExpectedClusteredCompanyNames).toContain(
        selectedCompanyName
      );
      // Remove the selected company name from the expected clustered company names
      preSelectionExpectedClusteredCompanyNames.splice(
        preSelectionExpectedClusteredCompanyNames.indexOf(selectedCompanyName),
        1
      );
    });

    const startMoveButton = getByLabelText("Move");

    expect(startMoveButton).toBeInTheDocument();

    await waitFor(async () => {
      startMoveButton.click();
    });

    expect(startMoveButton).toBeChecked();

    const firstRadioButton = getByTestId("Tech Innovations Inc-radio-button");

    await waitFor(async () => {
      firstRadioButton.click();
    });

    expect(firstRadioButton).toBeChecked();

    const lockInCheckbox = getByTestId("lock-in-checkbox");

    await waitFor(async () => {
      lockInCheckbox.click();
    });

    expect(lockInCheckbox).toBeChecked();

    const moveToNewButton = getByTestId("move-to-new-button");

    await waitFor(async () => {
      moveToNewButton.click();
    });

    const confirmMoveToNewButton = getByTestId("confirm-move-to-new-button");

    await waitFor(async () => {
      confirmMoveToNewButton.click();
    });

    const selectRadioButtons = queryAllByLabelText(
      "Select Company Name Radio Button"
    );

    expect(selectRadioButtons).toHaveLength(0);

    const allCorrectCompanyNameDropdownsPostSelection = getAllByLabelText(
      "Correct Company Name Dropdown"
    );

    expect(allCorrectCompanyNameDropdownsPostSelection).toHaveLength(3);

    const postSelectionExpectedClusteredCompanyNames = [
      "Tech Innovations Incc",
      "Global Health Corp",
      "Tech Innovations Inc",
    ];

    allCorrectCompanyNameDropdownsPostSelection.forEach((each) => {
      const selectedCompanyName = each.children[0]!.textContent!;
      expect(postSelectionExpectedClusteredCompanyNames).toContain(
        selectedCompanyName
      );
      // Remove the selected company name from the expected clustered company names
      postSelectionExpectedClusteredCompanyNames.splice(
        postSelectionExpectedClusteredCompanyNames.indexOf(selectedCompanyName),
        1
      );
    });
  });
});
