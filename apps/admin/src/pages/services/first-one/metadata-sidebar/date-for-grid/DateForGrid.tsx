import dayjs from "dayjs";
import { SetStateAction } from "react";
import SearchableDropdown from "../../../../../components/SearchableDropdown";

type DateForGridProps = {
  dates: Date[];
  selectedDate: Date;
  setSelectedDate: React.Dispatch<SetStateAction<Date>>;
};
export const formatDate = (date: Date) => {
  return dayjs.utc(date).format("D MMMM YYYY");
};

export const DateForGrid = (props: DateForGridProps) => {
  const { dates, selectedDate, setSelectedDate } = props;

  const formattedDates = dates.map((date) => formatDate(date));

  const formattedSelectedDate = formatDate(selectedDate);

  const options = formattedDates.map((formattedDate) => ({
    value: formattedDate,
    label: formattedDate,
  }));

  const handleChange = (value: string | number) => {
    console.log({ date: value });
    const newSelectedDate = new Date(`${value} EDT`);
    console.log({ newSelectedDate });
    setSelectedDate(newSelectedDate);
  };

  return (
    <form className="gap-y-2 flex flex-col" data-onboarding="date-selector">
      <h4 className="text-sm font-normal text-gray-600 dark:text-gray-400">
        Date for input
      </h4>
      <SearchableDropdown
        id="date"
        name="date"
        value={formattedSelectedDate}
        options={options}
        onChange={handleChange}
        placeholder="Select date..."
      />
    </form>
  );
};
