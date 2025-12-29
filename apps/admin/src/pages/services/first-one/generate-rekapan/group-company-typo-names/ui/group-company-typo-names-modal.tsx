import { Modal } from "flowbite-react";
import {
  ClusteredCompanyNames,
  CorrectCompanyName,
  PossibleCorrectCompanyNameFromPrevMonthStokAlat,
} from "../types";
import GroupCompanyTypoNamesModalBody from "./group-company-typo-names-modal-body";
import { SupabaseWorksheetDataSchema } from "../../../getCurrentMonthStokAlatData/supabaseWorksheetDataSchema/supabaseWorksheetDataSchema";

type GroupCompanyTypoNamesProps = {
  prevMonthCorrectCompanyNames:
    | Record<
        CorrectCompanyName,
        {
          typoCompanyNames: string[];
          correctCompanyName: CorrectCompanyName;
          possibleCorrectCompanyNameFromPrevMonthStokAlat:
            | PossibleCorrectCompanyNameFromPrevMonthStokAlat
            | undefined;
        }
      >
    | undefined;
  showModal: boolean;
  currentMonthStokAlatData: SupabaseWorksheetDataSchema | undefined;
  handleModalConfirmation: (
    clusteredCompanyNames: ClusteredCompanyNames
  ) => void;
};

const GroupCompanyTypoNamesModal = (props: GroupCompanyTypoNamesProps) => {
  // FSM tings but learn some other time
  const { showModal, currentMonthStokAlatData, handleModalConfirmation } =
    props;

  if (!currentMonthStokAlatData) return null;
  if (!showModal) return null;
  if (!showModal && currentMonthStokAlatData !== undefined)
    throw new Error(
      "Show modal is false but currentMonthStokAlatData is present, bad state"
    );

  return (
    <Modal size={"4xl"} dismissible={false} show={showModal}>
      <Modal.Header className="border-b border-gray-200 !p-6 dark:border-gray-700">
        <strong>Group Company Typo Names</strong>
        <GroupCompanyTypoNamesModalBody
          prevMonthCorrectCompanyNames={props.prevMonthCorrectCompanyNames}
          currentMonthStokAlatData={currentMonthStokAlatData}
          handleModalConfirmation={handleModalConfirmation}
        />
      </Modal.Header>
    </Modal>
  );
};

export default GroupCompanyTypoNamesModal;
