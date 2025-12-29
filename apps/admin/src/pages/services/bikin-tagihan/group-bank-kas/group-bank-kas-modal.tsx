import { FC, useState } from "react";
import { Button, Modal } from "flowbite-react";
import { Wizard } from "react-use-wizard";
import { HiDocumentText } from "react-icons/hi";
import { GroupBankKasProvider } from "./group-bank-kas-provider";
import { UploadStep } from "./upload-step/upload-step";
import { SheetSelectionStep } from "./sheet-selection-step/sheet-selection-step";
import { PreviewStep } from "./preview-step/preview-step";
import { ResultsStep } from "./results-step/results-step";

export const GroupBankKasModal: FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  return (
    <>
      <Button onClick={openModal} className="w-full">
        <HiDocumentText className="mr-2 h-5 w-5" />
        Group Bank KAS Data
      </Button>

      <Modal
        show={isOpen}
        onClose={closeModal}
        size="4xl"
        dismissible={false}
      >
        <Modal.Header>Bank KAS Data Grouping</Modal.Header>
        <Modal.Body>
          <GroupBankKasProvider>
            <Wizard>
              <UploadStep />
              <SheetSelectionStep />
              <PreviewStep />
              <ResultsStep onClose={closeModal} />
            </Wizard>
          </GroupBankKasProvider>
        </Modal.Body>
      </Modal>
    </>
  );
};
