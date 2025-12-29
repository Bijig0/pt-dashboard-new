import { AgGridReact } from "ag-grid-react";
import { Button } from "flowbite-react";
import { ForwardedRef } from "react";
import { Row } from "../../../../types/globals";

type ActionsProps = {
  worksheetName: string;
  gridRef: ForwardedRef<AgGridReact<Row>>;
};

const AddRowButton = (props: ActionsProps) => {
  const { worksheetName, gridRef } = props;

  const handleAddRows = async () => {
    function generareEmptyRows(
      alatName: string,
      count: number = 50
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

    const emptyRows = generareEmptyRows(worksheetName);
    // @ts-ignore
    gridRef?.current?.api.applyTransaction({ add: emptyRows });
  };

  return (
    <Button className="w-full" onClick={handleAddRows}>
      Add rows
    </Button>
  );
};

export default AddRowButton;
