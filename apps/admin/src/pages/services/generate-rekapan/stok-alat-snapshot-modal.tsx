import { Button, Modal, Spinner, Table } from "flowbite-react";
import { useState } from "react";
import { HiEye } from "react-icons/hi";
import useGetAlatNames from "../../../hooks/useGetAlatNames";
import useGetWorksheetData from "../../../hooks/useGetWorksheetData";

type StokAlatSnapshotModalProps = {
  selectedDate: Date | undefined;
  label: string;
};

const StokAlatSnapshotModal = (props: StokAlatSnapshotModalProps) => {
  const { selectedDate, label } = props;
  const [showModal, setShowModal] = useState(false);

  if (!selectedDate) {
    return null;
  }

  const { data: alatNames, isLoading: isLoadingAlatNames } = useGetAlatNames({
    startDate: selectedDate,
    endDate: selectedDate,
  });

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <>
      <Button
        size="xs"
        color="light"
        onClick={handleOpenModal}
        className="ml-2"
      >
        <HiEye className="mr-1 h-4 w-4" />
        View Snapshot
      </Button>

      <Modal
        dismissible
        show={showModal}
        onClose={handleCloseModal}
        size="5xl"
      >
        <Modal.Header>
          Stok Alat Snapshot - {label}
        </Modal.Header>
        <Modal.Body>
          <div className="space-y-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Viewing stok alat data for{" "}
              <strong>
                {selectedDate.toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                })}
              </strong>
            </p>

            {isLoadingAlatNames ? (
              <div className="flex justify-center py-8">
                <Spinner size="xl" />
              </div>
            ) : (
              <SnapshotTable
                alatNames={alatNames || []}
                selectedDate={selectedDate}
              />
            )}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button color="gray" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

type SnapshotTableProps = {
  alatNames: string[];
  selectedDate: Date;
};

const SnapshotTable = (props: SnapshotTableProps) => {
  const { alatNames, selectedDate } = props;

  return (
    <div className="overflow-x-auto max-h-[60vh]">
      <Table striped>
        <Table.Head>
          <Table.HeadCell>Alat Name</Table.HeadCell>
          <Table.HeadCell>Total Records</Table.HeadCell>
          <Table.HeadCell>Status</Table.HeadCell>
        </Table.Head>
        <Table.Body className="divide-y">
          {alatNames.map((alatName) => (
            <SnapshotRow
              key={alatName}
              alatName={alatName}
              selectedDate={selectedDate}
            />
          ))}
        </Table.Body>
      </Table>
    </div>
  );
};

type SnapshotRowProps = {
  alatName: string;
  selectedDate: Date;
};

const SnapshotRow = (props: SnapshotRowProps) => {
  const { alatName, selectedDate } = props;

  const { data: worksheetData, isLoading } = useGetWorksheetData(
    alatName,
    selectedDate
  );

  const recordCount = worksheetData?.length || 0;
  const hasData = recordCount > 0;

  return (
    <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
      <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
        {alatName}
      </Table.Cell>
      <Table.Cell>
        {isLoading ? (
          <Spinner size="sm" />
        ) : (
          <span className="font-semibold">{recordCount}</span>
        )}
      </Table.Cell>
      <Table.Cell>
        {isLoading ? (
          <span className="text-gray-500 text-sm">Loading...</span>
        ) : hasData ? (
          <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-300">
            Has Data
          </span>
        ) : (
          <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800 dark:bg-gray-700 dark:text-gray-300">
            No Data
          </span>
        )}
      </Table.Cell>
    </Table.Row>
  );
};

export default StokAlatSnapshotModal;
