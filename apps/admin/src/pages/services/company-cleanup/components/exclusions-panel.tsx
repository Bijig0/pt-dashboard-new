import { Alert, Button, Table, TextInput } from "flowbite-react";
import { useState } from "react";
import { HiSearch, HiTrash, HiClipboardCheck } from "react-icons/hi";
import {
  useGetExcludedCompanyNames,
  useRemoveExcludedCompanyName,
} from "../../../../hooks/useCompanyNameCorrections";
import { LoadingSpinner, useToastContext } from "../../../../context/ToastContext";

const ExclusionsPanel = () => {
  const { showToast } = useToastContext();
  const [searchQuery, setSearchQuery] = useState("");

  const { data: excludedNames, isLoading } = useGetExcludedCompanyNames();
  const removeExclusionMutation = useRemoveExcludedCompanyName();

  const handleRemove = async (name: string) => {
    try {
      await removeExclusionMutation.mutateAsync(name);
      showToast("success", `Removed "${name}" from exclusions`);
    } catch (error) {
      console.error("Error removing exclusion:", error);
      showToast("error", "Failed to remove exclusion");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const filteredNames = excludedNames?.filter((item) =>
    item.company_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-4">
      <Alert color="info">
        <p className="text-sm">
          These company names have been marked as "Keep Same" and will not appear in clustering suggestions.
          Remove them from this list to have them appear again.
        </p>
      </Alert>

      {excludedNames && excludedNames.length > 0 ? (
        <>
          <TextInput
            icon={HiSearch}
            placeholder="Search excluded names..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          <div className="overflow-x-auto">
            <Table>
              <Table.Head>
                <Table.HeadCell>Company Name</Table.HeadCell>
                <Table.HeadCell>Excluded On</Table.HeadCell>
                <Table.HeadCell className="w-24">Action</Table.HeadCell>
              </Table.Head>
              <Table.Body className="divide-y">
                {filteredNames?.map((item) => (
                  <Table.Row key={item.company_name}>
                    <Table.Cell className="font-medium text-gray-900 dark:text-white">
                      {item.company_name}
                    </Table.Cell>
                    <Table.Cell className="text-gray-500 dark:text-gray-400">
                      {formatDate(item.created_at)}
                    </Table.Cell>
                    <Table.Cell>
                      <Button
                        color="failure"
                        size="xs"
                        onClick={() => handleRemove(item.company_name)}
                        disabled={removeExclusionMutation.isPending}
                      >
                        <HiTrash className="mr-1 h-3 w-3" />
                        Remove
                      </Button>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </div>

          {filteredNames?.length === 0 && searchQuery && (
            <p className="text-center text-gray-500 dark:text-gray-400 py-4">
              No results found for "{searchQuery}"
            </p>
          )}
        </>
      ) : (
        <div className="rounded-lg border border-gray-200 p-8 text-center dark:border-gray-700">
          <HiClipboardCheck className="mx-auto h-12 w-12 text-green-500" />
          <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">
            No excluded names
          </h3>
          <p className="mt-1 text-gray-500 dark:text-gray-400">
            Company names marked as "Keep Same" will appear here.
          </p>
        </div>
      )}
    </div>
  );
};

export default ExclusionsPanel;
