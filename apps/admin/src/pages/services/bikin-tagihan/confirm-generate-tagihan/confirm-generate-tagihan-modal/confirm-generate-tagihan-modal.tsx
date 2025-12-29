import {
  AlatRecord,
  bikinTagihan,
} from "#src/helpers/createTagihan/generateTagihan/generateTagihan.js";
import downloadExcelFile from "#src/helpers/downloadExcelFile.js";
import dayjsUtc from "@dayjsutc";
import { Button, Modal } from "flowbite-react";
import { useState } from "react";
import { LoadingSpinner } from "../../../../../context/ToastContext";
import { AlatName } from "../../../../../helpers/createRekapan/types";
import { useGetAllHargaAlat } from "../../../../../hooks/useGetAllHargaAlat";
import { HargaAlatSchema } from "../../../../../types/schemas";
import { useRekapanContext } from "../../rekapan-provider";
import { AgGridRow } from "../../types";
import { ConfirmGenerateTagihanButton } from "../confirm-generate-tagihan-button/confirm-generate-tagihan-button";
import { getCurrentWorksheetAlatNames } from "../confirm-generate-tagihan-button/getCurrentWorksheetAlatNames/getCurrentWorksheetAlatNames";
import { AlatDataRow } from "./getPricesCategorizedByPresence/convertCategorizedPricesIntoRows/convertCategorizedPricesIntoRows";
import { getPricesCategorizedByPresence } from "./getPricesCategorizedByPresence/getPricesCategorizedByPresence";
import { ModalBody as ConfirmGenerateTagihanModalBody } from "./modal-body/modal-body";
import { cleanAGGridColumnName } from "#src/helpers/cleanAGGridColumnName.js";

type _ConfirmGenerateTagihanModalProps = {
  selectedCompanyName: string;
  worksheetData: AgGridRow[];
  alatData: HargaAlatSchema;
};

export const cleanWorksheetData = (
  worksheetData: AgGridRow[],
  hargaAlatData: HargaAlatSchema
): Input => {
  const result: Input = [];

  for (const row of worksheetData) {
    const tanggal = row["Tanggal"];

    const alatRecords: AlatRecord[] = [];

    const alatNames = Object.keys(row).filter((key) => key !== "Tanggal");

    for (const alatName of alatNames) {
      const jumlahAlat = row[alatName!];
      const alatRecord = {
        alatName: alatName!,
        jumlahAlat: jumlahAlat as number,
        hargaBulanan: hargaAlatData.find(
          (hargaAlat) => cleanAGGridColumnName(hargaAlat.name) === alatName!
        )?.harga_bulanan!,
        hargaHarian: hargaAlatData.find(
          (hargaAlat) => cleanAGGridColumnName(hargaAlat.name) === alatName!
        )?.harga_harian!,
      } satisfies AlatRecord;
      alatRecords.push(alatRecord);
    }

    const eachInput = {
      tanggal: tanggal as string,
      alatRecords: alatRecords,
    };

    result.push(eachInput);
  }

  return result;
};

type MyRecord = {
  tanggalRange: {
    start: string;
    end: string;
  };
  days: number;
  jumlah: number;
  total: number;
};

type Input = {
  tanggal: string;
  alatRecords: AlatRecord[];
}[];

type OutputWrapper = {
  data: Output;
  jumlah: number;
  ppn: number;
  total: number;
} & {};

type Output = {
  [key: AlatName]: {
    records: MyRecord[];
    subTotal: number;
    harga: number;
  };
};

export const _ConfirmGenerateTagihanModal = function (
  props: _ConfirmGenerateTagihanModalProps
) {
  const { selectedCompanyName, worksheetData, alatData } = props;

  console.log({ worksheetData });

  console.log({ selectedCompanyName });

  console.log({ alatData });

  const [pageItems, setPageItems] = useState<AlatDataRow[]>([]);

  const pageItemsToUse = pageItems;

  const [isOpen, setIsOpen] = useState(false);

  const { selectedDate } = useRekapanContext();

  const currentWorksheetAlatNames = getCurrentWorksheetAlatNames(worksheetData);

  const categorizedMissingAndPresentAlatPrices = getPricesCategorizedByPresence(
    {
      currentWorksheetAlatNames,
      presentPrices: alatData,
    }
  );

  const isAllHargaPresent =
    categorizedMissingAndPresentAlatPrices.filter(
      ({ status }) => status === "missing"
    ).length === 0;

  const handleConfirmGenerateTagihan = () => {
    console.log({ alatData });

    const names = alatData.map((each) => each.name);

    console.log({ names });

    const cleanedWorksheetData = cleanWorksheetData(worksheetData, alatData);

    console.log({ worksheetData });

    console.log({ cleanedWorksheetData });

    const periodToCreateTagihanFor = dayjsUtc(selectedDate).add(1, "month");

    console.log({ periodToCreateTagihanFor });

    const tagihan = bikinTagihan({
      rekapanData: cleanedWorksheetData,
      periodToCreateTagihanFor: periodToCreateTagihanFor,
    });

    downloadExcelFile(tagihan, "example-tagihan.xlsx");

    setIsOpen(false);
  };

  const renderHargaPresentInfoText = (isAllHargaPresent: boolean) => {
    if (isAllHargaPresent) {
      return (
        <p
          data-testid="all-alat-prices-present-text"
          className="text-sm text-gray-500 dark:text-gray-400 text-green-400"
        >
          All Alat Prices Present
        </p>
      );
    }

    return (
      <p
        data-testid="alat-prices-missing-text"
        className="text-sm text-gray-500 dark:text-gray-400 text-red-400"
      >
        Some Alats Prices Missing, Please fill out
      </p>
    );
  };

  return (
    <>
      <ConfirmGenerateTagihanButton setIsOpen={setIsOpen} />
      <Modal
        dismissible
        size={"2xl"}
        onClose={() => setIsOpen(false)}
        show={isOpen}
      >
        <Modal.Header className="border-b border-gray-200 !p-6 dark:border-gray-700">
          <strong>Confirm Generate Tagihan</strong>
          {renderHargaPresentInfoText(isAllHargaPresent)}
        </Modal.Header>
        <ConfirmGenerateTagihanModalBody
          items={categorizedMissingAndPresentAlatPrices}
          itemsPerPage={8}
        />
        <Modal.Footer>
          {isAllHargaPresent ? (
            <Button
              color="primary"
              onClick={handleConfirmGenerateTagihan}
              data-testid="generate-tagihan-button"
            >
              Generate Tagihan
            </Button>
          ) : null}
        </Modal.Footer>
      </Modal>
    </>
  );
};

type ConfirmGenerateTagihanModalProps = {
  selectedCompanyName: string;
  worksheetData: AgGridRow[];
};

const ConfirmGenerateTagihanModal = (
  props: ConfirmGenerateTagihanModalProps
) => {
  const { selectedCompanyName, worksheetData } = props;
  const {
    data: alatData,
    isLoading,
    error,
  } = useGetAllHargaAlat(selectedCompanyName);

  if (alatData) {
    return (
      <_ConfirmGenerateTagihanModal
        worksheetData={worksheetData}
        selectedCompanyName={selectedCompanyName}
        alatData={alatData}
      />
    );
  }

  if (isLoading) {
    return <LoadingSpinner />;
  }

  throw error;
};

export default ConfirmGenerateTagihanModal;
