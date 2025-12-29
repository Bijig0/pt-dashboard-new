import { AgGridReact } from "ag-grid-react";
import { Ref, useEffect } from "react";

const useAddRowsAutomatically = (
  worksheetName: string,
  worksheetData: any,
  gridRef: Ref<AgGridReact>
) => {
  const addRows = async () => {
    function generareEmptyRows(
      alatName: string,
      count: number = 100
    ): Array<{
      masuk: any;
      keluar: any;
      tanggal: any;
      company_name: any;
      alat_name: any;
    }> {
      let result = [];
      for (let i = 0; i < count; i++) {
        result.push({
          masuk: null,
          keluar: null,
          tanggal: null,
          company_name: null,
          alat_name: alatName,
        });
      }
      return result;
    }

    const emptyRows = generareEmptyRows(worksheetName, 100);
    gridRef?.current?.api.applyTransaction({ add: emptyRows });
  };

  useEffect(() => {
    if (!gridRef?.current?.api) return;
    // Add rows if worksheetData exists and is empty, or if worksheetData doesn't exist yet
    if (worksheetData === undefined || (worksheetData && worksheetData.length === 0)) {
      addRows();
    }
  }, [worksheetData, gridRef?.current]);
};

export default useAddRowsAutomatically;
