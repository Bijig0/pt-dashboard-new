import { Badge, Button, Table } from "flowbite-react";
import { HiArrowCircleLeft, HiClock } from "react-icons/hi";
import { LoadingSpinner } from "../../../../context/ToastContext";
import { CorrectionHistoryItem } from "../../../../hooks/useCompanyNameCorrections";

type RollbackPanelProps = {
  history: CorrectionHistoryItem[];
  isLoading: boolean;
  onRollback: (batchId: string) => void;
  isRollingBack: boolean;
};

const RollbackPanel = ({
  history,
  isLoading,
  onRollback,
  isRollingBack,
}: RollbackPanelProps) => {
  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (history.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 p-8 text-center dark:border-gray-700">
        <HiClock className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">
          No correction history
        </h3>
        <p className="mt-1 text-gray-500 dark:text-gray-400">
          Applied corrections will appear here with rollback options.
        </p>
      </div>
    );
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="overflow-x-auto">
      <Table>
        <Table.Head>
          <Table.HeadCell>Date</Table.HeadCell>
          <Table.HeadCell>Changes</Table.HeadCell>
          <Table.HeadCell className="text-right">Records</Table.HeadCell>
          <Table.HeadCell>Status</Table.HeadCell>
          <Table.HeadCell>Action</Table.HeadCell>
        </Table.Head>
        <Table.Body className="divide-y">
          {history.map((item) => (
            <Table.Row key={item.batch_id}>
              <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                {formatDate(item.created_at)}
              </Table.Cell>
              <Table.Cell>
                <div className="max-w-md">
                  <div className="flex flex-wrap gap-1">
                    {item.old_companies.slice(0, 3).map((oldName, i) => (
                      <span
                        key={i}
                        className="text-xs text-red-600 dark:text-red-400"
                      >
                        {oldName}
                        {i < Math.min(item.old_companies.length - 1, 2) && ", "}
                      </span>
                    ))}
                    {item.old_companies.length > 3 && (
                      <span className="text-xs text-gray-500">
                        +{item.old_companies.length - 3} more
                      </span>
                    )}
                  </div>
                  <div className="text-gray-400">→</div>
                  <div className="flex flex-wrap gap-1">
                    {item.new_companies.slice(0, 3).map((newName, i) => (
                      <span
                        key={i}
                        className="text-xs text-green-600 dark:text-green-400"
                      >
                        {newName}
                        {i < Math.min(item.new_companies.length - 1, 2) && ", "}
                      </span>
                    ))}
                    {item.new_companies.length > 3 && (
                      <span className="text-xs text-gray-500">
                        +{item.new_companies.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              </Table.Cell>
              <Table.Cell className="text-right">
                {item.records_count}
              </Table.Cell>
              <Table.Cell>
                {item.is_rolled_back ? (
                  <Badge color="gray">
                    Rolled back
                  </Badge>
                ) : (
                  <Badge color="green">
                    Applied
                  </Badge>
                )}
              </Table.Cell>
              <Table.Cell>
                {!item.is_rolled_back && (
                  <Button
                    size="xs"
                    color="warning"
                    onClick={() => onRollback(item.batch_id)}
                    disabled={isRollingBack}
                  >
                    <HiArrowCircleLeft className="mr-1 h-4 w-4" />
                    Rollback
                  </Button>
                )}
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </div>
  );
};

export default RollbackPanel;
