import bikinTagihan from "#src/helpers/createTagihan/generateTagihan/generateTagihan.js";
import downloadExcelFile from "#src/helpers/downloadExcelFile.js";
import { SingleHargaAlatSchema } from "#src/types/schemas.js";
import { Dayjs } from "dayjs";
import { Button } from "flowbite-react";
import { cleanWorksheetData } from "../../confirm-generate-tagihan/confirm-generate-tagihan-modal/confirm-generate-tagihan-modal";
import { convertAllHargasToRows } from "../../confirm-generate-tagihan/confirm-generate-tagihan-modal/modal-body/alat-rows-input-price/convertAllHargasToRows/convertAllHargasToRows";
import { useGenerateTagihanStore } from "../../confirm-generate-tagihan/store";

type Props = {
  rekapanData: any;
  periodToCreateTagihanFor: Dayjs;
};

export const ConfirmCreateManualTagihan = (props: Props) => {
  const { rekapanData, periodToCreateTagihanFor } = props;

  const { allHargas, allHargasAsRows } = useGenerateTagihanStore((state) => ({
    allHargas: state.allHargas,
    allHargasAsRows: convertAllHargasToRows(state.allHargas),
  }));

  console.log({ allHargas, allHargasAsRows });

  const handleCreateManualTagihan = () => {
    const alatPricesFormatted = allHargasAsRows.map(
      ({ hargaBulanan, hargaHarian, alatName }) =>
        ({
          name: alatName,
          harga_bulanan: hargaBulanan,
          harga_harian: hargaHarian,
        }) satisfies SingleHargaAlatSchema
    );
    const cleanedWorksheetData = cleanWorksheetData(
      rekapanData,
      alatPricesFormatted
    );
    console.log({ cleanedWorksheetData });
    const tagihan = bikinTagihan({
      rekapanData: cleanedWorksheetData,
      periodToCreateTagihanFor,
    });

    downloadExcelFile(tagihan, "tagihan.xlsx");
  };

  return (
    <div>
      <p>Rekapan Data:</p>
      {JSON.stringify(rekapanData)}
      <p>Alat Prices</p>
      {allHargasAsRows.map((harga) => {
        return (
          <div key={JSON.stringify(harga)}>
            <p>Alat Name</p>
            <p>{harga.alatName}</p>
            <p>Harga Bulanan</p>
            <p>{harga.hargaBulanan}</p>
            <p>Harga Harian</p>
            <p>{harga.hargaHarian}</p>
          </div>
        );
      })}
      <Button color="primary" onClick={handleCreateManualTagihan}>
        Create Tagihan
      </Button>
    </div>
  );
};
