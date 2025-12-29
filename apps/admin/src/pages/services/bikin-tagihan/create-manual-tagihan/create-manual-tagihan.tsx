import { Dayjs } from "dayjs";
import { Modal } from "flowbite-react";
import { useState } from "react";
import { Wizard } from "react-use-wizard";
import { useBoolean } from "usehooks-ts";
import { ConfirmCreateManualTagihan } from "./confirm-create-manual-tagihan/confirm-create-manual-tagihan";
import ConfirmRekapanValues from "./confirm-rekapan-values/confirm-rekapan-values";
import { getEndOfMonthDates } from "./confirm-rekapan-values/getEndOfMonthDates/getEndOfMonthDates";
import CreateManualTagihanButton from "./create-manual-tagihan-button/create-manual-tagihan-button";
import CreateManualTagihanProvider, {
  useCreateManualTagihanContext,
} from "./create-manual-tagihan-provider";
import InputAlatPrices from "./input-alat-prices/alat-price-modal";

type Props = {};

const _CreateManualTagihan = (props: Props) => {
  const {
    value: isOpen,
    setTrue: openModal,
    setFalse: closeModal,
  } = useBoolean(false);

  const { alatPrices } = useCreateManualTagihanContext();

  const [alatNames, setAlatNames] = useState<string[]>([]);

  const [rekapanData, setRekapanData] = useState();

  const periods = getEndOfMonthDates();

  const [period, setPeriod] = useState<Dayjs>(periods[0]!);

  console.log({ alatNames });

  console.log({ rekapanData });

  return (
    <div>
      <CreateManualTagihanButton onClick={openModal} />
      <Modal dismissible show={isOpen} onClose={closeModal}>
        <Wizard>
          <ConfirmRekapanValues
            periods={periods}
            period={period}
            setPeriod={setPeriod}
            setRekapanData={setRekapanData}
            setAlatNames={setAlatNames}
          />
          <InputAlatPrices itemsPerPage={8} alatNames={alatNames} />
          <ConfirmCreateManualTagihan periodToCreateTagihanFor={period} rekapanData={rekapanData} />
        </Wizard>
      </Modal>
    </div>
  );
};

const CreateManualTagihan = (props: Props) => {
  return (
    <CreateManualTagihanProvider>
      <_CreateManualTagihan {...props} />
    </CreateManualTagihanProvider>
  );
};

export default CreateManualTagihan;
