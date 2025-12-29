import { Button, Modal } from "flowbite-react";
import { useRekapanContext } from "../../../../../rekapan-provider";
import { AlatData } from "../../modal-body";
import { ConfirmModalTable } from "./confirm-update-hargas-table/confirm-update-hargas-table";
import { handleConfirmUpdateHargas } from "./handleConfirmUpdateHargas";

type Props = {
  alatData: AlatData[];
  isOpen: boolean;
  onClose: () => void;
};

export const ConfirmUpdateHargasModal = (props: Props) => {
  const { alatData, isOpen, onClose } = props;
  const { selectedCompanyName } = useRekapanContext();

  return (
    <Modal
      data-testid="confirm-update-hargas-modal"
      dismissible
      show={isOpen}
      onClose={onClose}
    >
      <Modal.Header>Update Hargas</Modal.Header>
      <Modal.Body>
        <ConfirmModalTable alatData={alatData} />
      </Modal.Body>
      <Modal.Footer>
        <Button
          data-testid="confirm-update-hargas-button"
          color="blue"
          onClick={() =>
            handleConfirmUpdateHargas({
              alatData,
              onComplete: onClose,
              selectedCompanyName,
            })
          }
        >
          Confirm Update Hargas
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
