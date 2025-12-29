import { Modal } from "flowbite-react";
import { useBoolean } from "usehooks-ts";

type Props = {
  errors: any;
  show: boolean;
};

const RekapanErrors = (props: Props) => {
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
      <Modal.Header>Errors in rekapan excel file</Modal.Header>
      <Modal.Body>
        {JSON.stringify(errors)}
        {/* {errors.map((error, index) => (
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
        ))} */}
      </Modal.Body>
    </Modal>
  );
};

export default RekapanErrors;
