import LoadingButton from "#src/components/LoadingButton/LoadingButton.js";
import { Dropzone } from "#src/pages/services/first-one/metadata-sidebar/add-new-stok-alat-from-excel/dropzone/dropzone.js";
import precondition from "#src/utils/precondition.js";
import { Dayjs } from "dayjs";
import { Modal } from "flowbite-react";
import { SetStateAction } from "react";
import CreateManualTagihanProvider, {
  useCreateManualTagihanContext,
} from "../create-manual-tagihan-provider";
import useValidateManualTagihan from "../useValidateManualTagihan/useValidateManualTagihan";
import { ChoosePeriodDropDown } from "./choose-period-dropdown/choose-period-dropdown";
import CreateManualTagihanErrors from "./rekapan-errors/rekapan-errors";
import RekapanValuesTable from "./rekapan-values-table";

type Props = {
  setAlatNames: React.Dispatch<SetStateAction<string[]>>;
  setRekapanData: React.Dispatch<SetStateAction<any>>;
  setPeriod: React.Dispatch<SetStateAction<Dayjs>>;
  period: Dayjs;
  periods: Dayjs[];
};

const _ConfirmRekapanValues = (props: Props) => {
  const { setAlatNames, setRekapanData, setPeriod, period, periods } = props;
  const { files, setFiles } = useCreateManualTagihanContext();

  console.log({ files });

  const {
    mutate: validateManualTagihan,
    isPending,
    error,
    data: validationResult,
  } = useValidateManualTagihan();

  const handleValidateManualTagihan = async () => {
    precondition(files.length > 0, "No file was selected");
    const file = files[0];
    if (file === undefined) throw new Error("File is undefined");
    validateManualTagihan({ rekapanFile: file });
  };

  const showErrors = Boolean(validationResult?.errors);
  console.log({ showErrors });
  const showConfirmation = Boolean(validationResult?.data);
  console.log({ showConfirmation });

  console.log({ validationResult });

  return (
    <>
      <Modal.Header>
        <p>Manually create tagihan from excel file</p>
      </Modal.Header>
      <Modal.Body>
        <Dropzone files={files} setFiles={setFiles} />
        <ChoosePeriodDropDown
          selectedPeriod={period}
          periods={periods}
          setSelectedPeriod={setPeriod}
        />
        <CreateManualTagihanErrors
          show={showErrors}
          errors={validationResult?.errors!}
        />
        <RekapanValuesTable
          show={showConfirmation}
          rekapan={validationResult?.data!.rekapan}
          alatNames={validationResult?.data?.alatNames!}
          setAlatNames={setAlatNames}
          setRekapanData={setRekapanData}
        />
      </Modal.Body>
      <Modal.Footer>
        <LoadingButton
          color="primary"
          isLoading={isPending}
          onClick={handleValidateManualTagihan}
        >
          Validate Rekapan
        </LoadingButton>
      </Modal.Footer>
    </>
  );
};

const ConfirmRekapanValues = (props: Props) => {
  return (
    <CreateManualTagihanProvider>
      <_ConfirmRekapanValues {...props} />
    </CreateManualTagihanProvider>
  );
};

export default ConfirmRekapanValues;
