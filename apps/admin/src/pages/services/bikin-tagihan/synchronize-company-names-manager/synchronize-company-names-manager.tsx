import { useBoolean } from "usehooks-ts";
import { LoadingSpinner } from "../../../../context/ToastContext";
import { CompanyName } from "../../../../helpers/createRekapan/types";
import useGetCompanyNames from "../../../../hooks/useGetCompanyNames";
import { SynchronizeCompanyNamesModal } from "./synchronize-company-names-modal/synchronize-company-names-modal";
import { findExcelCompanyNamesNotInDatabaseCompanyNames } from "./synchronize-company-names-modal/findExcelCompanyNamesNotInDatabaseCompanyNames/findExcelCompanyNamesNotInDatabaseCompanyNames";

type _SynchronizeCompanyNamesManagerProps = {
  excelFileCompanyNames: string[];
  databaseCompanyNames: CompanyName[];
};

export const _SynchronizeCompanyNamesManager = (
  props: _SynchronizeCompanyNamesManagerProps
) => {
  const { excelFileCompanyNames, databaseCompanyNames } = props;
  const {
    value: isOpen,
    setValue,
    setTrue: openModal,
    setFalse: closeModal,
  } = useBoolean(false);

  const excelCompanyNamesNotInDatabaseCompanyNames =
    findExcelCompanyNamesNotInDatabaseCompanyNames({
      excelFileCompanyNames,
      databaseCompanyNames,
    });

  const isAllExcelCompanyNamesInDatabase =
    excelCompanyNamesNotInDatabaseCompanyNames.length === 0;

  console.log({ isAllExcelCompanyNamesInDatabase });

  const isModalOpen = !isAllExcelCompanyNamesInDatabase || isOpen;

  return (
    <SynchronizeCompanyNamesModal
      isOpen={isModalOpen}
      closeModal={closeModal}
      openModal={openModal}
      companyNamesToSynchronize={excelCompanyNamesNotInDatabaseCompanyNames}
    />
  );
};

type SynchronizeCompanyNamesManagerProps = {
  excelFileCompanyNames: string[];
};

const SynchronizeCompanyNamesManager = (
  props: SynchronizeCompanyNamesManagerProps
) => {
  const { excelFileCompanyNames } = props;
  const { data: databaseCompanyNames, isLoading, error } = useGetCompanyNames();

  if (databaseCompanyNames) {
    return (
      <_SynchronizeCompanyNamesManager
        excelFileCompanyNames={excelFileCompanyNames}
        databaseCompanyNames={databaseCompanyNames}
      />
    );
  }

  if (isLoading) return <LoadingSpinner />;

  throw error;
};

export default SynchronizeCompanyNamesManager;
