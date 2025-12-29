import { FC, useContext } from "react";
import { useWizard } from "react-use-wizard";
import { Button } from "flowbite-react";
import { Dropzone } from "./dropzone";
import { FormatInfoModal } from "./format-info-modal";
import { useGroupBankKasContext } from "../group-bank-kas-provider";
import { excelFileToExcelJs } from "#src/helpers/excelFileToExcelJs";
import { ToastContext } from "#src/context/ToastContext";

export const UploadStep: FC = () => {
  const { nextStep } = useWizard();
  const { showToast } = useContext(ToastContext);

  const {
    uploadedFile,
    setUploadedFile,
    setWorkbook,
    setAvailableSheets,
    setIsProcessing,
    addError,
  } = useGroupBankKasContext();

  const validateFile = (file: File): string | null => {
    // File type validation
    const validTypes = [
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-excel",
    ];

    if (!validTypes.includes(file.type) && !file.name.match(/\.(xlsx|xls)$/i)) {
      return "Invalid file type. Please upload an Excel file (.xlsx or .xls)";
    }

    // File size validation (max 10MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return "File too large. Maximum size is 10MB";
    }

    return null;
  };

  const handleNext = async () => {
    if (!uploadedFile) {
      showToast("error", "Please upload a file first");
      return;
    }

    // Validate file
    const validationError = validateFile(uploadedFile);
    if (validationError) {
      showToast("error", validationError);
      addError(validationError);
      return;
    }

    setIsProcessing(true);
    showToast("loading", "Processing Excel file...");

    try {
      // Parse Excel file to ExcelJS workbook
      const parsedWorkbook = await excelFileToExcelJs(uploadedFile);

      // Validate workbook has sheets
      if (parsedWorkbook.worksheets.length === 0) {
        throw new Error("No worksheets found in the uploaded file");
      }

      // Extract available sheet names
      const sheetNames = parsedWorkbook.worksheets.map((sheet) => sheet.name);

      // Update state
      setWorkbook(parsedWorkbook);
      setAvailableSheets(sheetNames);

      showToast("success", "File uploaded successfully!");
      nextStep();
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to parse Excel file. Please check the file format.";
      showToast("error", errorMessage);
      addError(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Upload Bank KAS File
        </h2>
        <FormatInfoModal />
      </div>

      <Dropzone file={uploadedFile} setFile={setUploadedFile} />

      <div className="flex justify-end">
        <Button onClick={handleNext} disabled={!uploadedFile}>
          Next
        </Button>
      </div>
    </div>
  );
};
