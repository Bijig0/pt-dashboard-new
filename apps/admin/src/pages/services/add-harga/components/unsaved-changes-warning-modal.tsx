import { Button, Modal } from "flowbite-react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export const UnsavedChangesWarningModal = ({ isOpen, onClose, onConfirm }: Props) => {
  return (
    <Modal dismissible show={isOpen} onClose={onClose} size="md">
      <Modal.Header>Unsaved Changes</Modal.Header>
      <Modal.Body>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          You have unsaved changes. If you continue, your changes will be lost.
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button color="gray" onClick={onClose}>
          Cancel
        </Button>
        <Button color="failure" onClick={onConfirm}>
          Discard Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
