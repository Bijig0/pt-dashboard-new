import { FC, useState, useContext } from "react";
import { Button } from "flowbite-react";
import { HiDownload } from "react-icons/hi";
import dayjs from "dayjs";
import downloadExcelFile from "#src/helpers/downloadExcelFile";
import { createOutputWorkbook } from "../lib/createOutputWorkbook";
import { GroupedSheetData } from "../group-bank-kas-provider";
import { ToastContext } from "#src/context/ToastContext";

type Props = {
  groupedResults: GroupedSheetData[];
  originalFileName: string;
};

export const DownloadButton: FC<Props> = ({
  groupedResults,
  originalFileName,
}) => {
  const { showToast } = useContext(ToastContext);
  const [isDownloading, setIsDownloading] = useState(false);

  const createDownloadFilename = (): string => {
    const baseName = originalFileName.replace(/\.xlsx?$/i, "");
    const timestamp = dayjs().format("YYYY-MM-DD-HHmmss");
    return `${baseName}-grouped-${timestamp}.xlsx`;
  };

  const handleDownload = async () => {
    setIsDownloading(true);
    showToast("loading", "Generating Excel file...");

    try {
      const workbook = await createOutputWorkbook(groupedResults);
      const filename = createDownloadFilename();

      await downloadExcelFile(workbook, filename);

      showToast("success", `Downloaded ${filename} successfully!`);
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to generate download file";
      showToast("error", errorMessage);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <Button
      onClick={handleDownload}
      disabled={isDownloading}
      className="w-full"
      size="lg"
    >
      <HiDownload className="mr-2 h-5 w-5" />
      {isDownloading ? "Generating..." : "Download as Excel (.xlsx)"}
    </Button>
  );
};
