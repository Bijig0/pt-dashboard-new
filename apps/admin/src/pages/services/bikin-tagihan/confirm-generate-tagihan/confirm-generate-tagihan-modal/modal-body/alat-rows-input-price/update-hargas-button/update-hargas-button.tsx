import { AlatData } from "../../modal-body";
import { ConfirmUpdateHargasModal } from "../confirm-update-hargas-modal/confirm-update-hargas-modal";

type Props = {
  showButton: boolean;
  alatData: AlatData[];
  showModal: boolean;
  closeModal: () => void;
  openModal: () => void;
};

export const UpdateHargasButton = (props: Props) => {
  const { showButton, alatData, showModal, closeModal, openModal } = props;

  // console.log({ alatData });

  if (!showButton) return null;

  return (
    <div>
      <button type="submit">Update Hargas</button>
      <ConfirmUpdateHargasModal
        alatData={alatData}
        isOpen={showModal}
        onClose={closeModal}
      />
    </div>
  );
};
