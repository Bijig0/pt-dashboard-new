import { create } from 'zustand';
import {
  TableData,
  TableCell,
  createTableCell,
  tableDataToSupabase,
  tableCellToSupabase,
} from '../types/table';
import { supabase, isMockMode } from '../lib/supabase';

interface TableStore {
  // State
  currentTable: TableData | null;
  isUploading: boolean;
  uploadSuccess: boolean;

  // Actions
  setTable: (table: TableData) => void;
  updateCell: (cellId: string, content: string) => void;
  addRow: () => void;
  addColumn: () => void;
  deleteRow: (rowIndex: number) => void;
  deleteColumn: (columnIndex: number) => void;
  uploadToSupabase: (userId: string) => Promise<void>;
  clearUploadSuccess: () => void;
  reset: () => void;
}

export const useTableStore = create<TableStore>((set, get) => ({
  // Initial state
  currentTable: null,
  isUploading: false,
  uploadSuccess: false,

  // Set the current table
  setTable: (table: TableData) => {
    set({ currentTable: table, uploadSuccess: false });
  },

  // Update a cell's content
  updateCell: (cellId: string, content: string) => {
    const { currentTable } = get();
    if (!currentTable) return;

    const updatedCells = currentTable.cells.map((cell) =>
      cell.id === cellId ? { ...cell, content } : cell
    );

    set({
      currentTable: { ...currentTable, cells: updatedCells },
    });
  },

  // Add a new row at the end
  addRow: () => {
    const { currentTable } = get();
    if (!currentTable) return;

    const newRowIndex = currentTable.rows;
    const newCells: TableCell[] = [];

    // Create empty cells for each column
    for (let col = 0; col < currentTable.columns; col++) {
      newCells.push(createTableCell(newRowIndex, col, ''));
    }

    set({
      currentTable: {
        ...currentTable,
        cells: [...currentTable.cells, ...newCells],
        rows: currentTable.rows + 1,
      },
    });
  },

  // Add a new column at the end
  addColumn: () => {
    const { currentTable } = get();
    if (!currentTable) return;

    const newColIndex = currentTable.columns;
    const newCells: TableCell[] = [];

    // Create empty cells for each row
    for (let row = 0; row < currentTable.rows; row++) {
      newCells.push(createTableCell(row, newColIndex, ''));
    }

    set({
      currentTable: {
        ...currentTable,
        cells: [...currentTable.cells, ...newCells],
        columns: currentTable.columns + 1,
      },
    });
  },

  // Delete a row and reindex remaining cells
  deleteRow: (rowIndex: number) => {
    const { currentTable } = get();
    if (!currentTable || currentTable.rows <= 1) return;

    // Remove cells in the row and reindex cells below
    const updatedCells = currentTable.cells
      .filter((cell) => cell.row !== rowIndex)
      .map((cell) => ({
        ...cell,
        row: cell.row > rowIndex ? cell.row - 1 : cell.row,
      }));

    set({
      currentTable: {
        ...currentTable,
        cells: updatedCells,
        rows: currentTable.rows - 1,
      },
    });
  },

  // Delete a column and reindex remaining cells
  deleteColumn: (columnIndex: number) => {
    const { currentTable } = get();
    if (!currentTable || currentTable.columns <= 1) return;

    // Remove cells in the column and reindex cells to the right
    const updatedCells = currentTable.cells
      .filter((cell) => cell.column !== columnIndex)
      .map((cell) => ({
        ...cell,
        column: cell.column > columnIndex ? cell.column - 1 : cell.column,
      }));

    set({
      currentTable: {
        ...currentTable,
        cells: updatedCells,
        columns: currentTable.columns - 1,
      },
    });
  },

  // Upload table to Supabase
  uploadToSupabase: async (userId: string) => {
    const { currentTable } = get();
    if (!currentTable) return;

    set({ isUploading: true, uploadSuccess: false });

    try {
      if (isMockMode) {
        // Mock mode: simulate upload
        console.log('Mock mode: Simulating upload for table', currentTable.id);
        await new Promise((resolve) => setTimeout(resolve, 1500));
        set({ isUploading: false, uploadSuccess: true });
        return;
      }

      // Add userId to table
      const tableWithUser = { ...currentTable, userId };

      // Insert table metadata
      const { error: tableError } = await supabase
        .from('table_data')
        .insert(tableDataToSupabase(tableWithUser));

      if (tableError) {
        throw tableError;
      }

      // Insert all cells
      const cellsData = currentTable.cells.map((cell) =>
        tableCellToSupabase(cell, currentTable.id)
      );

      const { error: cellsError } = await supabase
        .from('table_cells')
        .insert(cellsData);

      if (cellsError) {
        // Rollback: delete the table if cells insertion fails
        await supabase.from('table_data').delete().eq('id', currentTable.id);
        throw cellsError;
      }

      set({ isUploading: false, uploadSuccess: true });
    } catch (error) {
      set({ isUploading: false });
      throw error;
    }
  },

  // Clear upload success flag
  clearUploadSuccess: () => {
    set({ uploadSuccess: false });
  },

  // Reset the store
  reset: () => {
    set({
      currentTable: null,
      isUploading: false,
      uploadSuccess: false,
    });
  },
}));
