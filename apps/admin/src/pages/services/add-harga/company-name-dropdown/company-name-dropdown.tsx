import { SetStateAction } from "react";
import SearchableDropdown from "../../../../components/SearchableDropdown";

type Props = {
  selectedCompanyName: string | undefined;
  setUserInputCompanyName: React.Dispatch<SetStateAction<string | undefined>>;
  companyNames: string[];
};

export const CompanyNameDropdown = (props: Props) => {
  const { selectedCompanyName, setUserInputCompanyName, companyNames } = props;

  if (selectedCompanyName === undefined) return <p>No company selected</p>;

  const options = companyNames.map((companyName) => ({
    value: companyName,
    label: companyName,
  }));

  return (
    <SearchableDropdown
      id="selected-proyek"
      name="Proyek Choices"
      value={selectedCompanyName}
      options={options}
      onChange={(value) => setUserInputCompanyName(value as string)}
      placeholder="Select company..."
    />
  );
};
