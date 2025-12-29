import { TableData } from './table';

/**
 * Represents the result of an OCR scan
 */
export interface OCRResult {
  imageUri: string;
  recognizedText: string;
  tableData: TableData;
  confidence: number; // 0-1 range, average confidence
  processingTime: number; // milliseconds
}

/**
 * Represents the current state of the scanning process
 */
export type ScanState =
  | { status: 'idle' }
  | { status: 'selecting' }
  | { status: 'processing' }
  | { status: 'completed'; result: OCRResult }
  | { status: 'error'; message: string };

/**
 * Create idle state
 */
export function idleState(): ScanState {
  return { status: 'idle' };
}

/**
 * Create selecting state
 */
export function selectingState(): ScanState {
  return { status: 'selecting' };
}

/**
 * Create processing state
 */
export function processingState(): ScanState {
  return { status: 'processing' };
}

/**
 * Create completed state
 */
export function completedState(result: OCRResult): ScanState {
  return { status: 'completed', result };
}

/**
 * Create error state
 */
export function errorState(message: string): ScanState {
  return { status: 'error', message };
}

/**
 * Check if scan state is idle
 */
export function isIdle(state: ScanState): state is { status: 'idle' } {
  return state.status === 'idle';
}

/**
 * Check if scan state is processing
 */
export function isProcessing(state: ScanState): state is { status: 'processing' } {
  return state.status === 'processing';
}

/**
 * Check if scan state is completed
 */
export function isCompleted(
  state: ScanState
): state is { status: 'completed'; result: OCRResult } {
  return state.status === 'completed';
}

/**
 * Check if scan state is error
 */
export function isError(
  state: ScanState
): state is { status: 'error'; message: string } {
  return state.status === 'error';
}

/**
 * Text block from ML Kit recognition
 */
export interface TextBlock {
  text: string;
  frame: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  lines: TextLine[];
}

/**
 * Text line from ML Kit recognition
 */
export interface TextLine {
  text: string;
  frame: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  elements: TextElement[];
}

/**
 * Text element (word) from ML Kit recognition
 */
export interface TextElement {
  text: string;
  frame: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

/**
 * OCR Error codes
 */
export type OCRErrorCode =
  | 'INVALID_IMAGE'
  | 'NO_TEXT_FOUND'
  | 'PROCESSING_FAILED'
  | 'IMAGE_CONVERSION_FAILED'
  | 'EDGE_FUNCTION_ERROR'
  | 'OCR_FAILED'
  | 'CLAUDE_OCR_FAILED';

/**
 * OCR Error types
 */
export class OCRError extends Error {
  constructor(
    message: string,
    public readonly code: OCRErrorCode
  ) {
    super(message);
    this.name = 'OCRError';
  }
}
