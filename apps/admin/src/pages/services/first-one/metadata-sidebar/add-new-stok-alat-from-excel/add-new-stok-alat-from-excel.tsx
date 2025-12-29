import LoadingButton from "#src/components/LoadingButton/LoadingButton.js";
import { LoadingSpinner } from "#src/context/ToastContext.js";
import useGetCompanyNames from "#src/hooks/useGetCompanyNames.js";
import precondition from "#src/utils/precondition.js";
import { Dayjs } from "dayjs";
import { Button, Modal } from "flowbite-react";
import { useBoolean } from "usehooks-ts";
import AddNewStokAlatErrors from "./add-new-stok-alat-errors/add-new-stok-alat-errors";
import AddNewStokAlatProvider, {
  useAddNewStokAlatContext,
} from "./add-new-stok-alat-provider";
import ConfirmAddStokAlatModal from "./confirm-add-stok-alat-modal/confirm-add-stok-alat-modal";
import { Dropzone } from "./dropzone/dropzone";
import useValidateNewStokAlat from "./useAddNewStokAlat/useValidateNewStokAlat";

type Props = {
  selectedDate: Dayjs;
  isStokAlatPreviouslyFilled: boolean;
};

const _AddNewStokAlatFromExcel = (props: Props) => {
  const { selectedDate, isStokAlatPreviouslyFilled } = props;
  const {
    value: isOpen,
    setTrue: openModal,
    setFalse: closeModal,
  } = useBoolean(false);

  const {
    isPending,
    mutate: validateNewStokAlat,
    data: validationResult,
    
  } = useValidateNewStokAlat();

  const {
    data: companyNames,
    isLoading,
    error: companyNamesError,
  } = useGetCompanyNames();

  const { files, setFiles } = useAddNewStokAlatContext();

  const handleAddNewStokAlat = async () => {
    precondition(files.length > 0, "No file was selected");
    const file = files[0];
    if (file === undefined) throw new Error("File is undefined");
    if (companyNames === undefined)
      throw new Error("Company names is undefined");
    validateNewStokAlat({
      stokAlatFile: file,
      allowedCompanyNames: companyNames,
    });
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  console.log({ validationResult });

  const showErrors = Boolean(validationResult?.errors);
  console.log({ showErrors });
  const showConfirmation = Boolean(validationResult?.data);
  console.log({ showConfirmation });

  if (companyNamesError) throw companyNamesError;

  return (
    <div>
      <Button onClick={openModal} color="primary">
        Add new stok alat
      </Button>
      <Modal dismissible show={isOpen} onClose={closeModal}>
        <Modal.Header>
          <p>Add new stok alat from excel</p>
          <p className="text-blue-600">
            Uploading stok alat for {selectedDate.format("D MMMM")}
          </p>
          {isStokAlatPreviouslyFilled && (
            <p className="text-red-600">
              Warning: Stok alat already filled, uploading will overwrite the
              data!
            </p>
          )}
        </Modal.Header>
        <Modal.Body>
          <Dropzone files={files} setFiles={setFiles} />
          <AddNewStokAlatErrors
            show={showErrors}
            errors={validationResult?.errors!}
          />
          <ConfirmAddStokAlatModal
            show={showConfirmation}
            stokAlat={validationResult?.data!}
            allowedCompanyNames={companyNames!}
          />
        </Modal.Body>
        <Modal.Footer>
          <LoadingButton
            color="primary"
            isLoading={isPending}
            onClick={handleAddNewStokAlat}
          >
            Upload
          </LoadingButton>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

const AddNewStokAlatFromExcel = (props: Props) => {
  return (
    <AddNewStokAlatProvider>
      <_AddNewStokAlatFromExcel {...props} />
    </AddNewStokAlatProvider>
  );
};

export default AddNewStokAlatFromExcel;
