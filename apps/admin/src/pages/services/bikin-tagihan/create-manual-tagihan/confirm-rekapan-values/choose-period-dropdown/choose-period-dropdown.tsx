import { Dayjs } from "dayjs";
import { SetStateAction } from "react";
import SearchableDropdown from "../../../../../../components/SearchableDropdown";

type DateForGridProps = {
  periods: Dayjs[];
  selectedPeriod: Dayjs;
  setSelectedPeriod: React.Dispatch<SetStateAction<Dayjs>>;
};

export const formatDate = (date: Dayjs) => {
  return date.format("D MMMM YYYY");
};

export const ChoosePeriodDropDown = (props: DateForGridProps) => {
  const { periods, selectedPeriod, setSelectedPeriod } = props;

  console.log({ selectedPeriod });

  const options = periods.map((date) => ({
    value: date.valueOf(),
    label: formatDate(date),
  }));

  const handleChange = (value: string | number) => {
    const selectedDate = periods.find((date) => date.valueOf() === value);
    if (selectedDate) {
      setSelectedPeriod(selectedDate);
    }
  };

  return (
    <form className="gap-y-2 flex flex-col">
      <h4 className="text-sm font-normal text-gray-600 dark:text-gray-400">
        Dayjs for input
      </h4>
      <SearchableDropdown
        id="manual-create-tagihan-date-dropdown"
        name="manual-create-tagihan-date-dropdown"
        value={selectedPeriod.valueOf()}
        options={options}
        onChange={handleChange}
        placeholder="Select period..."
      />
    </form>
  );
};
