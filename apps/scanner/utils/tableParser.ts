import { TableCell, TableData, createTableCell, createTableData } from '../types/table';
import { TextBlock, TextLine, TextElement } from '../types/ocr';

/**
 * Text item with position information for table parsing
 */
interface TextItem {
  text: string;
  frame: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  confidence: number;
}

/**
 * Parse ML Kit text blocks into a structured table
 *
 * This algorithm:
 * 1. Flattens all text elements from blocks/lines
 * 2. Sorts by Y position (top to bottom)
 * 3. Groups elements into rows based on Y proximity
 * 4. Sorts elements within rows by X position (left to right)
 * 5. Creates TableCell objects with row/column indices
 */
export function parseTextToTable(
  blocks: TextBlock[],
  imageHeight: number = 1000
): TableData {
  // Flatten all text elements with their positions
  const textItems: TextItem[] = [];

  for (const block of blocks) {
    for (const line of block.lines) {
      // Use line-level for table detection (better for handwritten content)
      textItems.push({
        text: line.text,
        frame: line.frame,
        confidence: 1.0, // ML Kit doesn't expose confidence per element
      });
    }
  }

  return parseTextItemsToTable(textItems, imageHeight);
}

/**
 * Parse array of text items into table structure
 * Can be used with different OCR outputs
 */
export function parseTextItemsToTable(
  textItems: TextItem[],
  imageHeight: number = 1000
): TableData {
  if (textItems.length === 0) {
    return createTableData([], 0, 0);
  }

  // Calculate row threshold based on image height
  // For pixel coordinates, use a percentage of average line height
  const avgHeight = textItems.reduce((sum, item) => sum + item.frame.height, 0) / textItems.length;
  const rowThreshold = avgHeight * 0.5; // Items within half line height are same row

  // Sort text items by their vertical position (top to bottom)
  // Higher Y value = lower on screen for most coordinate systems
  const sortedByY = [...textItems].sort((a, b) => a.frame.y - b.frame.y);

  // Group text items into rows based on Y-coordinate proximity
  const rows: TextItem[][] = [];
  let currentRow: TextItem[] = [];
  let lastY: number | null = null;

  for (const item of sortedByY) {
    const itemY = item.frame.y;

    if (lastY !== null && Math.abs(itemY - lastY) > rowThreshold) {
      if (currentRow.length > 0) {
        rows.push(currentRow);
        currentRow = [];
      }
    }

    currentRow.push(item);
    lastY = itemY;
  }

  // Don't forget the last row
  if (currentRow.length > 0) {
    rows.push(currentRow);
  }

  // Sort items within each row by X-coordinate (left to right)
  const sortedRows = rows.map((row) =>
    [...row].sort((a, b) => a.frame.x - b.frame.x)
  );

  // Determine the maximum number of columns
  const maxColumns = Math.max(...sortedRows.map((row) => row.length), 0);

  // Create table cells
  const cells: TableCell[] = [];

  for (let rowIndex = 0; rowIndex < sortedRows.length; rowIndex++) {
    const row = sortedRows[rowIndex];
    for (let colIndex = 0; colIndex < row.length; colIndex++) {
      const item = row[colIndex];
      cells.push(
        createTableCell(rowIndex, colIndex, item.text, item.confidence)
      );
    }
  }

  return createTableData(cells, sortedRows.length, maxColumns);
}

/**
 * Calculate average confidence from table cells
 */
export function calculateAverageConfidence(tableData: TableData): number {
  if (tableData.cells.length === 0) {
    return 0;
  }

  const sum = tableData.cells.reduce((acc, cell) => acc + cell.confidence, 0);
  return sum / tableData.cells.length;
}

/**
 * Get all text from table as a single string
 */
export function getTableText(tableData: TableData): string {
  const rows: string[] = [];

  for (let r = 0; r < tableData.rows; r++) {
    const rowCells = tableData.cells
      .filter((cell) => cell.row === r)
      .sort((a, b) => a.column - b.column);

    rows.push(rowCells.map((cell) => cell.content).join(' '));
  }

  return rows.join('\n');
}

/**
 * Normalize bounding box from Vision (0-1 normalized, origin bottom-left)
 * to pixel coordinates (origin top-left)
 */
export function normalizeVisionBoundingBox(
  boundingBox: { x: number; y: number; width: number; height: number },
  imageWidth: number,
  imageHeight: number
): { x: number; y: number; width: number; height: number } {
  return {
    x: boundingBox.x * imageWidth,
    // Vision uses bottom-left origin, so flip Y
    y: (1 - boundingBox.y - boundingBox.height) * imageHeight,
    width: boundingBox.width * imageWidth,
    height: boundingBox.height * imageHeight,
  };
}
