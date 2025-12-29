import { useMutation } from '@tanstack/react-query';
import { TableData } from '../types/table';
import { exportAndShare, ExportFormat } from '../utils/export';

interface ExportParams {
  tableData: TableData;
  format: ExportFormat;
}

async function performExport({ tableData, format }: ExportParams): Promise<void> {
  await exportAndShare(tableData, format);
}

export function useExport() {
  return useMutation({
    mutationFn: performExport,
    onSuccess: (_, variables) => {
      console.log('Export completed:', variables.format);
    },
    onError: (error) => {
      console.error('Export failed:', error);
    },
  });
}
