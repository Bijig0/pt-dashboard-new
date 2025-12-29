import { Label, TextInput } from "flowbite-react";
import { SetStateAction } from "react";
import SearchableDropdown from "../../../../../components/SearchableDropdown";

type Props = {
  selectedAlatName: string | undefined;
  setUserInputAlatName: React.Dispatch<SetStateAction<string | undefined>>;
  alatNames: string[];
  mode: 'view' | 'create';
};

export const AlatNameDropdown = (props: Props) => {
  const { selectedAlatName, alatNames, setUserInputAlatName, mode } = props;

  if (mode === 'create') {
    return (
      <div className="mb-4">
        <Label htmlFor="new-alat-name" className="text-sm font-normal text-gray-600 dark:text-gray-400">
          Alat Name
        </Label>
        <TextInput
          id="new-alat-name"
          placeholder="Enter new alat name"
          value={selectedAlatName || ''}
          onChange={(e) => setUserInputAlatName(e.target.value)}
        />
      </div>
    );
  }

  // Existing dropdown logic for view mode
  if (selectedAlatName === undefined) return <p>No alat selected</p>;

  if (alatNames.length === 0) return <p>No alats found</p>;

  const options = alatNames.map((alatName) => ({
    value: alatName,
    label: alatName,
  }));

  return (
    <div className="mb-4">
      <Label htmlFor="selected-alat" className="text-sm font-normal text-gray-600 dark:text-gray-400">
        Select Alat
      </Label>
      <SearchableDropdown
        id="selected-alat"
        name="Alat Choices"
        value={selectedAlatName}
        options={options}
        onChange={(value) => setUserInputAlatName(value as string)}
        placeholder="Select alat..."
      />
    </div>
  );
};
