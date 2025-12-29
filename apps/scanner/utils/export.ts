import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import { TableData, getCellsInRow } from '../types/table';

/**
 * Export format options
 */
export type ExportFormat = 'json' | 'csv';

/**
 * Export table data as JSON string
 */
export function exportAsJSON(tableData: TableData): string {
  const exportData = {
    id: tableData.id,
    rows: tableData.rows,
    columns: tableData.columns,
    createdAt: tableData.createdAt.toISOString(),
    imageName: tableData.imageName,
    cells: tableData.cells.map((cell) => ({
      row: cell.row,
      column: cell.column,
      content: cell.content,
      confidence: cell.confidence,
    })),
  };

  return JSON.stringify(exportData, null, 2);
}

/**
 * Export table data as CSV string
 */
export function exportAsCSV(tableData: TableData): string {
  const rows: string[] = [];

  for (let r = 0; r < tableData.rows; r++) {
    const rowCells = getCellsInRow(tableData, r);
    const rowValues = rowCells.map((cell) => escapeCSVValue(cell.content));
    rows.push(rowValues.join(','));
  }

  return rows.join('\n');
}

/**
 * Escape a value for CSV format
 * - Wrap in quotes if contains comma, quote, or newline
 * - Double any quotes inside the value
 */
function escapeCSVValue(value: string): string {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

/**
 * Export table data to a file and share it
 */
export async function exportAndShare(
  tableData: TableData,
  format: ExportFormat
): Promise<void> {
  const content = format === 'json' ? exportAsJSON(tableData) : exportAsCSV(tableData);
  const extension = format === 'json' ? 'json' : 'csv';
  const mimeType = format === 'json' ? 'application/json' : 'text/csv';

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const fileName = `table-export-${timestamp}.${extension}`;
  const fileUri = `${FileSystem.cacheDirectory}${fileName}`;

  // Write to file
  await FileSystem.writeAsStringAsync(fileUri, content, {
    encoding: FileSystem.EncodingType.UTF8,
  });

  // Check if sharing is available
  const isAvailable = await Sharing.isAvailableAsync();
  if (!isAvailable) {
    throw new Error('Sharing is not available on this device');
  }

  // Share the file
  await Sharing.shareAsync(fileUri, {
    mimeType,
    dialogTitle: `Export as ${format.toUpperCase()}`,
    UTI: format === 'json' ? 'public.json' : 'public.comma-separated-values-text',
  });
}

/**
 * Get export preview (first few lines)
 */
export function getExportPreview(
  tableData: TableData,
  format: ExportFormat,
  maxLines: number = 5
): string {
  const content = format === 'json' ? exportAsJSON(tableData) : exportAsCSV(tableData);
  const lines = content.split('\n');

  if (lines.length <= maxLines) {
    return content;
  }

  return lines.slice(0, maxLines).join('\n') + '\n...';
}
