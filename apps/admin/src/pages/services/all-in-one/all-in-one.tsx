import { AgGridReact } from "ag-grid-react";
import { Row } from "exceljs";
import { FC, Ref, useEffect, useRef, useState } from "react";
import { useGetAlatNames } from "../../../hooks/useGetAlatNames";
import { useAvailableMonths } from "../../../hooks/useAvailableMonths";
import NavbarSidebarLayout from "../../../layouts/navbar-sidebar";
import MyGrid from "./all-in-one-grid";
import MetadataSidebar from "./all-in-one-sidebar";

const FirstOne: FC = function () {
  const { data: alatNames, isLoading, error } = useGetAlatNames();

  const gridRef = useRef<AgGridReact<Row>>(null);

  const { months: endOfMonths, isLoading: isLoadingMonths } = useAvailableMonths();

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Set initial selected date when months are loaded
  useEffect(() => {
    if (endOfMonths.length > 0 && !selectedDate) {
      setSelectedDate(endOfMonths[0]!);
    }
  }, [endOfMonths, selectedDate]);

  useEffect(() => {
    if (alatNames !== undefined && alatNames.length > 0) {
      if (alatNames[0] === undefined) return;
      setSelectedAlatName(alatNames[0]);
    }
  }, [alatNames]);

  const [selectedAlatName, setSelectedAlatName] = useState<string>("");

  //

  const worksheetName = selectedAlatName;

  gridRef as Ref<AgGridReact<Row>>;

  if (isLoading || isLoadingMonths) return;
  if (error) return;
  if (!alatNames) return;
  if (!selectedAlatName) return;
  if (!selectedDate) return;

  return (
    <NavbarSidebarLayout>
      <div className="px-4 pt-6">
        <h1 className="font-bold text-4xl dark:text-white">
          Hi, Welcome Back 👋
        </h1>
        <div className="my-4"></div>
        <div className="flex gap-x-4">
          <div className="">
            <MetadataSidebar
              ref={gridRef}
              alatNamesList={alatNames}
              selectedAlatName={selectedAlatName}
              setSelectedAlatName={setSelectedAlatName}
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              dates={endOfMonths}
            />
          </div>
          <div className="flex-1">
            <MyGrid
              worksheetName={worksheetName}
              selectedDate={selectedDate}
              ref={gridRef}
            />
          </div>
        </div>
        {/* <div>
          <Downloads />
        </div> */}
      </div>
    </NavbarSidebarLayout>
  );
};

export default FirstOne;
