import { Button, Modal } from "flowbite-react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export const InfoModal = ({ isOpen, onClose }: Props) => {
  return (
    <Modal dismissible show={isOpen} onClose={onClose} size="md">
      <Modal.Header>About Alat Selection</Modal.Header>
      <Modal.Body>
        <div className="space-y-3">
          <p className="text-sm text-gray-700 dark:text-gray-300">
            The alats displayed in the dropdown are obtained from the <strong>Stok Alat editor page</strong> and database.
          </p>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            These alats are automatically synced based on the stok alat records for each proyek (company).
          </p>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            Currently, you cannot add new alats directly from this page. To add a new alat, please use the Stok Alat editor page first.
          </p>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={onClose}>
          Got it
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
