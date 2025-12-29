import { StokAlat } from "#src/script/stok-alat-to-js/cleaned-stok-alat-to-js/cleaned-stok-alat-to-js.js";
import { AgGridReact } from "ag-grid-react";
import { Button, Label, Select } from "flowbite-react";
import { createColDefs } from "./createColDefs";
import useUploadStokAlatData from "./useUploadStokAlatData/useUploadStokAlatData";

type Props = {
  show: boolean;
  stokAlat: StokAlat[];
  allowedCompanyNames: string[];
};

const worksheets = ["Sheet1", "Sheet2", "Sheet3"] as const;

const ConfirmAddStokAlatModal = (props: Props) => {
  const { show, stokAlat, allowedCompanyNames } = props;

  console.log({ show });

  const colDefs = createColDefs({ companyNames: allowedCompanyNames });

  const { mutate: uploadStokAlatData } = useUploadStokAlatData({
    onSuccess: () => {
      console.log("Successfully uploaded stok alat data");
    },
    onError: (error) => {
      console.log("Error uploading stok alat data", error);
    },
  });

  const handleSelectWorksheetChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    console.log({ e });
  };

  const handleUploadStokAlatData = () => {
    uploadStokAlatData();
  };

  if (!show) return null;

  return (
    <div>
      <Label
        htmlFor="worksheets-choices"
        className="text-sm font-normal text-gray-600 dark:text-gray-400"
      >
        Workbook date
      </Label>
      <Select
        id="worksheets-choices"
        name="date"
        onChange={handleSelectWorksheetChange}
      >
        {worksheets.map((worksheet) => (
          <option className="w-full" key={worksheet} value={worksheet}>
            {worksheet}
          </option>
        ))}
      </Select>
      <AgGridReact
        //   @ts-ignore
        columnDefs={colDefs}
        rowData={stokAlat}
      />
      <Button color="primary" onClick={handleUploadStokAlatData}>
        Upload
      </Button>
    </div>
  );
};

export default ConfirmAddStokAlatModal;
