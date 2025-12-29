// Simple UUID generator for React Native (crypto.randomUUID not available in Hermes)
function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Represents a single cell in the table
 */
export interface TableCell {
  id: string;
  row: number;
  column: number;
  content: string;
  confidence: number; // 0-1 range
}

/**
 * Represents the complete table data extracted from an image
 */
export interface TableData {
  id: string;
  cells: TableCell[];
  rows: number;
  columns: number;
  createdAt: Date;
  imageName?: string;
  userId?: string; // For Supabase RLS
}

/**
 * Create a new TableCell with defaults
 */
export function createTableCell(
  row: number,
  column: number,
  content: string,
  confidence: number = 1.0,
  id?: string
): TableCell {
  return {
    id: id ?? generateUUID(),
    row,
    column,
    content,
    confidence,
  };
}

/**
 * Create a new TableData with defaults
 */
export function createTableData(
  cells: TableCell[] = [],
  rows: number = 0,
  columns: number = 0,
  imageName?: string,
  id?: string
): TableData {
  return {
    id: id ?? generateUUID(),
    cells,
    rows,
    columns,
    createdAt: new Date(),
    imageName,
  };
}

/**
 * Get cell at specific row and column
 */
export function getCellAt(
  tableData: TableData,
  row: number,
  column: number
): TableCell | undefined {
  return tableData.cells.find((cell) => cell.row === row && cell.column === column);
}

/**
 * Get all cells in a specific row, sorted by column
 */
export function getCellsInRow(tableData: TableData, row: number): TableCell[] {
  return tableData.cells
    .filter((cell) => cell.row === row)
    .sort((a, b) => a.column - b.column);
}

/**
 * Get all cells in a specific column, sorted by row
 */
export function getCellsInColumn(tableData: TableData, column: number): TableCell[] {
  return tableData.cells
    .filter((cell) => cell.column === column)
    .sort((a, b) => a.row - b.row);
}

/**
 * Convert TableData to Supabase format
 */
export function tableDataToSupabase(tableData: TableData): Record<string, unknown> {
  return {
    id: tableData.id,
    rows: tableData.rows,
    columns: tableData.columns,
    created_at: tableData.createdAt.toISOString(),
    image_name: tableData.imageName ?? null,
    user_id: tableData.userId ?? null,
  };
}

/**
 * Convert TableCell to Supabase format
 */
export function tableCellToSupabase(
  cell: TableCell,
  tableId: string
): Record<string, unknown> {
  return {
    id: cell.id,
    table_id: tableId,
    row: cell.row,
    column: cell.column,
    content: cell.content,
    confidence: cell.confidence,
  };
}

/**
 * Supabase response type for table_data
 */
export interface TableDataRow {
  id: string;
  rows: number;
  columns: number;
  created_at: string;
  image_name: string | null;
  user_id: string | null;
}

/**
 * Supabase response type for table_cells
 */
export interface TableCellRow {
  id: string;
  table_id: string;
  row: number;
  column: number;
  content: string;
  confidence: number;
}

/**
 * Convert Supabase response to TableData
 */
export function tableDataFromSupabase(
  row: TableDataRow,
  cellRows: TableCellRow[]
): TableData {
  return {
    id: row.id,
    cells: cellRows.map((cellRow) => ({
      id: cellRow.id,
      row: cellRow.row,
      column: cellRow.column,
      content: cellRow.content,
      confidence: cellRow.confidence,
    })),
    rows: row.rows,
    columns: row.columns,
    createdAt: new Date(row.created_at),
    imageName: row.image_name ?? undefined,
    userId: row.user_id ?? undefined,
  };
}
