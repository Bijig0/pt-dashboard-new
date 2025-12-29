import console from "console";
import { Button, Table } from "flowbite-react";
import { SetStateAction } from "react";
import { IoMdArrowBack } from "react-icons/io";
import { useWizard } from "react-use-wizard";
import { AgGridRow } from "../../types";
import { useCreateManualTagihan } from "./useCreateManualTagihan/useCreateManualTagihan";

type Props = {
  show: boolean;
  rekapan: AgGridRow[];
  alatNames: string[];
  setAlatNames: React.Dispatch<SetStateAction<string[]>>;
  setRekapanData: React.Dispatch<SetStateAction<any>>;
};

const RekapanValuesTable = (props: Props) => {
  const { show, rekapan, alatNames, setAlatNames, setRekapanData } = props;

  console.log({ show });

  const { mutate: createManualTagihan } = useCreateManualTagihan({
    onSuccess: () => {
      console.log("Successfully uploaded stok alat data");
    },
    onError: (error) => {
      console.log("Error uploading stok alat data", error);
    },
  });

  const { previousStep, nextStep } = useWizard();

  const handleConfirmRekapanValues = () => {
    console.log({ alatNames });
    setAlatNames((prevAlatNames) => {
      console.log("Updated alatNames:", prevAlatNames);
      return alatNames;
    });
    setRekapanData((prevRekapan: any) => {
      console.log("Updated rekapan:", prevRekapan);
      return rekapan;
    });
  };

  if (!show) return null;

  return (
    <div>
      <Table>
        <IoMdArrowBack onClick={previousStep} />
        <div>
          {rekapan.map((row, index) => {
            return (
              <p key={JSON.stringify({ ...row, index })}>
                {JSON.stringify(row)}
              </p>
            );
          })}
        </div>
      </Table>
      <Button color="primary" onClick={handleConfirmRekapanValues}>
        Confirm Rekapan Values
      </Button>
      <Button color="primary" onClick={nextStep}>
        Next Step
      </Button>
    </div>
  );
};

export default RekapanValuesTable;
