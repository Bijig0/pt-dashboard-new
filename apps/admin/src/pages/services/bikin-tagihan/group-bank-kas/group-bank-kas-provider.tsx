import React, { createContext, useContext, useState, ReactNode } from "react";
import ExcelJS from "exceljs";
import { ItemsSchema } from "./lib/types";

export type ProcessedSheetData = {
  sheetName: string;
  items: ItemsSchema;
  total: number;
};

export type GroupedSheetData = {
  sheetName: string;
  groupedItems: ItemsSchema;
  total: number;
};

type ProcessingMode = "all" | "select";

type GroupBankKasContextType = {
  // Upload state
  uploadedFile: File | null;
  setUploadedFile: (file: File | null) => void;
  workbook: ExcelJS.Workbook | null;
  setWorkbook: (workbook: ExcelJS.Workbook | null) => void;

  // Processing mode
  processingMode: ProcessingMode;
  setProcessingMode: (mode: ProcessingMode) => void;

  // Sheet selection
  availableSheets: string[];
  setAvailableSheets: (sheets: string[]) => void;
  selectedSheets: string[];
  setSelectedSheets: (sheets: string[]) => void;

  // Preview data (parsed from selected sheets, before grouping)
  previewData: ProcessedSheetData[];
  setPreviewData: (data: ProcessedSheetData[]) => void;

  // Grouped results (after confirmation)
  groupedResults: GroupedSheetData[];
  setGroupedResults: (results: GroupedSheetData[]) => void;

  // Processing state
  isProcessing: boolean;
  setIsProcessing: (value: boolean) => void;

  // Error state
  errors: string[];
  addError: (error: string) => void;
  clearErrors: () => void;

  // Helper: Reset all state
  resetState: () => void;
};

const GroupBankKasContext = createContext<GroupBankKasContextType | undefined>(
  undefined
);

export const useGroupBankKasContext = () => {
  const context = useContext(GroupBankKasContext);
  if (!context) {
    throw new Error(
      "useGroupBankKasContext must be used within GroupBankKasProvider"
    );
  }
  return context;
};

type ProviderProps = {
  children: ReactNode;
};

export const GroupBankKasProvider = ({ children }: ProviderProps) => {
  // Upload state
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [workbook, setWorkbook] = useState<ExcelJS.Workbook | null>(null);

  // Processing mode
  const [processingMode, setProcessingMode] = useState<ProcessingMode>("all");

  // Sheet selection
  const [availableSheets, setAvailableSheets] = useState<string[]>([]);
  const [selectedSheets, setSelectedSheets] = useState<string[]>([]);

  // Preview data
  const [previewData, setPreviewData] = useState<ProcessedSheetData[]>([]);

  // Grouped results
  const [groupedResults, setGroupedResults] = useState<GroupedSheetData[]>([]);

  // Processing state
  const [isProcessing, setIsProcessing] = useState(false);

  // Error state
  const [errors, setErrors] = useState<string[]>([]);

  const addError = (error: string) => {
    setErrors((prev) => [...prev, error]);
  };

  const clearErrors = () => {
    setErrors([]);
  };

  const resetState = () => {
    setUploadedFile(null);
    setWorkbook(null);
    setProcessingMode("all");
    setAvailableSheets([]);
    setSelectedSheets([]);
    setPreviewData([]);
    setGroupedResults([]);
    setIsProcessing(false);
    setErrors([]);
  };

  const value: GroupBankKasContextType = {
    uploadedFile,
    setUploadedFile,
    workbook,
    setWorkbook,
    processingMode,
    setProcessingMode,
    availableSheets,
    setAvailableSheets,
    selectedSheets,
    setSelectedSheets,
    previewData,
    setPreviewData,
    groupedResults,
    setGroupedResults,
    isProcessing,
    setIsProcessing,
    errors,
    addError,
    clearErrors,
    resetState,
  };

  return (
    <GroupBankKasContext.Provider value={value}>
      {children}
    </GroupBankKasContext.Provider>
  );
};
