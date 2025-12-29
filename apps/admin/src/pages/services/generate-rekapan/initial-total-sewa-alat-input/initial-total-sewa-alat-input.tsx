import { addMonths } from "date-fns";
import { Alert, Card, Label, TextInput } from "flowbite-react";
import { useEffect, useState } from "react";
import { HiInformationCircle } from "react-icons/hi";
import { LoadingSpinner } from "../../../../context/ToastContext";
import useGetAlatNames from "../../../../hooks/useGetAlatNames";
import { InitialTotalSewaAlat } from "../../first-one/grid/handleGenerateRekapan/buildInitialRekapanFromValues/buildInitialRekapanFromValues";

type InitialTotalSewaAlatInputProps = {
  startDate: Date | undefined;
  initialValues: InitialTotalSewaAlat;
  onChange: (values: InitialTotalSewaAlat) => void;
};

const InitialTotalSewaAlatInput = (props: InitialTotalSewaAlatInputProps) => {
  const { startDate, initialValues, onChange } = props;

  if (!startDate) {
    return null;
  }

  const nextMonthDate = addMonths(startDate, 1);

  const {
    data: alatNames,
    isLoading,
    error,
  } = useGetAlatNames({
    startDate: startDate,
    endDate: nextMonthDate,
  });

  const handleValueChange = (alatName: string, value: string) => {
    const numericValue = value === '' ? 0 : parseInt(value) || 0;
    onChange({
      ...initialValues,
      [alatName]: numericValue,
    });
  };

  if (isLoading) {
    return (
      <Card>
        <div className="flex items-center justify-center py-8">
          <LoadingSpinner />
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <Alert color="failure" icon={HiInformationCircle}>
          <p className="text-sm">Error loading alat names: {error.message}</p>
        </Alert>
      </Card>
    );
  }

  if (!alatNames || alatNames.length === 0) {
    return (
      <Card>
        <Alert color="warning" icon={HiInformationCircle}>
          <p className="text-sm">
            No equipment data found for the selected start month. Please add
            data to the Stok Alat Editor first.
          </p>
        </Alert>
      </Card>
    );
  }

  return (
    <Card>
      <div className="space-y-4">
        <div className="pb-3 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Initial Total Sewa Alat Periode
          </h3>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Set the starting baseline for each equipment type. These values
            represent equipment already rented out before the start month.
          </p>
        </div>

        <Alert color="info" icon={HiInformationCircle}>
          <p className="text-sm">
            <strong>Found {alatNames.length} equipment types</strong> in the
            start month. Set initial totals below (defaults to 0).
          </p>
        </Alert>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {alatNames.map((alatName) => (
            <div key={alatName}>
              <Label
                htmlFor={`initial-${alatName}`}
                value={alatName}
                className="mb-2 block"
              />
              <TextInput
                id={`initial-${alatName}`}
                type="number"
                min="0"
                value={initialValues[alatName] ?? 0}
                onChange={(e) => handleValueChange(alatName, e.target.value)}
                placeholder="0"
                helperText={`Current value: ${initialValues[alatName] ?? 0} units`}
              />
            </div>
          ))}
        </div>

        <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-800">
          <p className="text-xs text-gray-600 dark:text-gray-400">
            <strong>Note:</strong> These values only apply to the first month
            of generation. Subsequent months will use calculated totals from
            previous months.
          </p>
        </div>
      </div>
    </Card>
  );
};

export default InitialTotalSewaAlatInput;
