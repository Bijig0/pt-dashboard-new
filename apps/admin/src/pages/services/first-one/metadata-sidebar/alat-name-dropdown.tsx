import { SetStateAction } from "react";
import SearchableDropdown from "../../../../components/SearchableDropdown";

type Props = {
  selectedAlatName: string;
  setSelectedAlatName: React.Dispatch<SetStateAction<string | undefined>>;
  alatNames: string[];
};

const AlatNameDropdown = (props: Props) => {
  const { selectedAlatName, setSelectedAlatName, alatNames } = props;

  const options = alatNames.map((alatName) => ({
    value: alatName,
    label: alatName,
  }));

  return (
    <SearchableDropdown
      id="alat-name-choices"
      name="Alat Name Choices"
      value={selectedAlatName}
      options={options}
      onChange={(value) => setSelectedAlatName(value as string)}
      placeholder="Select alat name..."
    />
  );
};

export default AlatNameDropdown;
