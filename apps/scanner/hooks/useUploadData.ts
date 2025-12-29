import { useMutation } from '@tanstack/react-query';
import { supabase, isMockMode } from '../lib/supabase';
import { TableData, tableDataToSupabase, tableCellToSupabase } from '../types/table';

interface UploadParams {
  tableData: TableData;
  userId: string;
}

interface UploadResult {
  success: boolean;
  tableId: string;
  cellsCount: number;
}

async function uploadTableData({ tableData, userId }: UploadParams): Promise<UploadResult> {
  if (isMockMode) {
    // Mock mode: simulate upload
    console.log('Mock mode: Simulating upload for table', tableData.id);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    return {
      success: true,
      tableId: tableData.id,
      cellsCount: tableData.cells.length,
    };
  }

  // Add userId to table
  const tableWithUser = { ...tableData, userId };

  // Insert table metadata
  const { error: tableError } = await supabase
    .from('table_data')
    .insert(tableDataToSupabase(tableWithUser));

  if (tableError) {
    throw new Error(`Failed to insert table: ${tableError.message}`);
  }

  // Insert all cells
  const cellsData = tableData.cells.map((cell) =>
    tableCellToSupabase(cell, tableData.id)
  );

  const { error: cellsError } = await supabase
    .from('table_cells')
    .insert(cellsData);

  if (cellsError) {
    // Rollback: delete the table if cells insertion fails
    await supabase.from('table_data').delete().eq('id', tableData.id);
    throw new Error(`Failed to insert cells: ${cellsError.message}`);
  }

  return {
    success: true,
    tableId: tableData.id,
    cellsCount: tableData.cells.length,
  };
}

export function useUploadData() {
  return useMutation({
    mutationFn: uploadTableData,
    onSuccess: (data) => {
      console.log('Upload successful:', data);
    },
    onError: (error) => {
      console.error('Upload failed:', error);
    },
  });
}
