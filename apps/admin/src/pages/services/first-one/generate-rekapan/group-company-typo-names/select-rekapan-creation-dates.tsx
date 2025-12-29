import { isSameDay } from "date-fns";
import { useFirstOneContext } from "../../first-one-provider";

type Props = {
  selectedDate: Date;
};
const SelectRekapanCreationDates = (props: Props) => {
  const { selectedDate } = props;
  const {
    setStartRekapanCreationDate,
    setEndRekapanCreationDate,
    startRekapanCreationDate,
    endRekapanCreationDate,
    isAnyDateSelectedForStartRekapanCreation,
    isAnyDateSelectedForEndRekapanCreation,
  } = useFirstOneContext();

  const isStartRekapanCreationDateChecked =
    startRekapanCreationDate === undefined
      ? false
      : isSameDay(startRekapanCreationDate, props.selectedDate);

  const handleSetStartRekapanCreationDate = () => {
    if (isStartRekapanCreationDateChecked) {
      setStartRekapanCreationDate(undefined);
      return;
    }
    setStartRekapanCreationDate(props.selectedDate);
    return;
  };

  const isEndRekapancreationDateChecked =
    endRekapanCreationDate === undefined
      ? false
      : isSameDay(endRekapanCreationDate, props.selectedDate);

  const handleSetEndRekapanCreationDate = () => {
    if (isEndRekapancreationDateChecked) {
      setEndRekapanCreationDate(undefined);
      return;
    }
    setEndRekapanCreationDate(props.selectedDate);
    return;
  };

  return (
    <div>
      <label htmlFor="startRekapanCreationDate" className="text-black font-xl">
        Select Month To Start Rekapan On
      </label>
      <input
        type="checkbox"
        checked={isStartRekapanCreationDateChecked}
        className="mr-2 h-4 w-4 rounded-full border-gray-300 bg-gray-50 p-2 text-sm font-medium text-gray-900 focus:ring-4 focus:ring-primary-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
        id="startRekapanCreationDate"
        name="startRekapanCreationDate"
        onChange={handleSetStartRekapanCreationDate}
      />
      {!isAnyDateSelectedForStartRekapanCreation && (
        <p className="text-sm text-red-500">
          No date selected please select a date for the rekapan start date.
          Generate rekapan will not work
        </p>
      )}
      <label htmlFor="startRekapanCreationDate" className="text-black font-xl">
        Select Month To End Rekapan Creation On
      </label>
      <input
        type="checkbox"
        checked={isEndRekapancreationDateChecked}
        className="mr-2 h-4 w-4 rounded-full border-gray-300 bg-gray-50 p-2 text-sm font-medium text-gray-900 focus:ring-4 focus:ring-primary-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
        id="startRekapanCreationDate"
        name="startRekapanCreationDate"
        onChange={handleSetEndRekapanCreationDate}
      />
      {!isAnyDateSelectedForStartRekapanCreation && (
        <p className="text-sm text-red-500">
          No date selected please select a date for the rekapan end date.
          Generate rekapan will not work
        </p>
      )}
    </div>
  );
};

export default SelectRekapanCreationDates;
