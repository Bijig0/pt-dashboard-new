import { Modal } from "flowbite-react";
import LoadingButton from "../../../../../components/LoadingButton/LoadingButton";
import { useToastContext } from "../../../../../context/ToastContext";
import useSynchronizeCompanyNames from "./useSynchronizeCompanyNames/useSynchronizeCompanyNames";

type Props = {
  isOpen: boolean;
  companyNamesToSynchronize: string[];
  openModal: () => void;
  closeModal: () => void;
};

export const SYNCHRONIZE_SUCCESS_TOAST_TEXT = "Company names synchronized";

export const SynchronizeCompanyNamesModal = (props: Props) => {
  const { isOpen, companyNamesToSynchronize, closeModal } = props;

  const { showToast } = useToastContext();

  const { mutate: synchronizeCompanyNamesMutation, isPending } =
    useSynchronizeCompanyNames({
      companyNames: companyNamesToSynchronize,
      options: {
        onSuccess: () => {
          showToast("success", "Company names synchronized");
          closeModal();
        },
        onError: (error) => {
          showToast("error", error.message);
        },
      },
    });

  const handleSynchronize = async () => {
    synchronizeCompanyNamesMutation();
  };

  return (
    <Modal dismissible show={isOpen} onClose={closeModal}>
      <Modal.Header>
        <strong>Synchronize Company Names</strong>
        <p className="text-red-600 text-sm">
          Some company names from this rekapan are not present in the database
        </p>
      </Modal.Header>
      <Modal.Body>
        {companyNamesToSynchronize.map((companyName) => {
          return <p key={companyName}>{companyName}</p>;
        })}
      </Modal.Body>
      <Modal.Footer>
        <LoadingButton
          isLoading={isPending}
          onClick={handleSynchronize}
          color="primary"
        >
          Synchronize
        </LoadingButton>
      </Modal.Footer>
    </Modal>
  );
};
