import { DataError } from "#src/script/stok-alat-to-js/find-stok-alat-data-errors/find-stok-alat-data-errors.js";
import { Modal } from "flowbite-react";
import { useBoolean } from "usehooks-ts";

type Props = {
  errors: DataError[];
  show: boolean;
};

const AddNewStokAlatErrors = (props: Props) => {
  const { errors, show } = props;

  const {
    value: isOpen,
    setTrue: openModal,
    setFalse: closeModal,
  } = useBoolean(true);

  if (!show) return null;

  const isModalOpen = errors && isOpen;

  return (
    <Modal dismissible show={isModalOpen} onClose={closeModal}>
      <Modal.Header>Errors in stok alat excel file</Modal.Header>
      <Modal.Body>
        {errors.map((error, index) => (
          <div className="" key={index}>
            <p className="text-blue-600 text-sm">Error number: {index + 1}</p>
            <p className="text-red-600 text-sm">
              Worksheet Name: {error.worksheetName}
            </p>
            <p className="text-red-600 text-sm">
              {"\t"}Row Number: {error.rowNumber}
            </p>
            <p className="text-red-600 text-sm">
              Error Message: {error.errorMessage}
            </p>
          </div>
        ))}
      </Modal.Body>
    </Modal>
  );
};

export default AddNewStokAlatErrors;
