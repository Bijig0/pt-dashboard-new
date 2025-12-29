import * as FileSystem from 'expo-file-system/legacy';
import * as ImageManipulator from 'expo-image-manipulator';
import { Platform } from 'react-native';
import { supabase } from './supabase';
import { OCRResult, OCRError } from '../types/ocr';
import { TableData, TableCell } from '../types/table';
import { calculateAverageConfidence } from '../utils/tableParser';

const MAX_IMAGE_SIZE = 1024; // Max dimension for Claude API

// Simple UUID generator for React Native
function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

interface ClaudeOCRResponse {
  success: boolean;
  text?: string;
  cells?: Array<{
    row: number;
    column: number;
    content: string;
    confidence: number;
  }>;
  rows?: number;
  columns?: number;
  error?: string;
}

/**
 * Resize image for OCR processing
 */
async function resizeImage(imageUri: string): Promise<string> {
  try {
    console.log('Resizing image:', imageUri);
    const result = await ImageManipulator.manipulateAsync(
      imageUri,
      [{ resize: { width: MAX_IMAGE_SIZE } }],
      { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
    );
    console.log('Resized image URI:', result.uri);
    return result.uri;
  } catch (error) {
    console.warn('Failed to resize image, using original:', error);
    return imageUri;
  }
}

/**
 * Convert blob URL to base64 on web platform
 */
async function blobUrlToBase64(blobUrl: string): Promise<string> {
  const response = await fetch(blobUrl);
  const blob = await response.blob();

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      // Remove data URL prefix (e.g., "data:image/jpeg;base64,")
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

/**
 * Convert image URI to base64
 * Handles both file:// and content:// URIs on Android, and blob URLs on web
 */
async function imageToBase64(imageUri: string): Promise<string> {
  try {
    console.log('Converting image to base64:', imageUri);

    // First resize the image to reduce size
    const resizedUri = await resizeImage(imageUri);

    // On web, use fetch + FileReader for blob URLs
    if (Platform.OS === 'web') {
      const base64 = await blobUrlToBase64(resizedUri);
      console.log('Base64 length:', base64.length);
      return base64;
    }

    // On native, use expo-file-system
    const base64 = await FileSystem.readAsStringAsync(resizedUri, {
      encoding: 'base64',
    });

    console.log('Base64 length:', base64.length);
    return base64;
  } catch (error) {
    console.error('Failed to convert image to base64:', error);
    throw new OCRError(
      `Failed to process image: ${error instanceof Error ? error.message : 'Unknown error'}`,
      'IMAGE_CONVERSION_FAILED'
    );
  }
}

/**
 * Get MIME type from image URI
 */
function getMimeType(imageUri: string): string {
  const extension = imageUri.split('.').pop()?.toLowerCase();
  switch (extension) {
    case 'jpg':
    case 'jpeg':
      return 'image/jpeg';
    case 'png':
      return 'image/png';
    case 'gif':
      return 'image/gif';
    case 'webp':
      return 'image/webp';
    default:
      return 'image/jpeg';
  }
}

/**
 * Recognize handwritten text using Claude via Supabase Edge Function
 */
export async function recognizeTextWithClaude(imageUri: string): Promise<OCRResult> {
  const startTime = Date.now();

  try {
    // Convert image to base64
    const base64Image = await imageToBase64(imageUri);
    const mimeType = getMimeType(imageUri);

    // Call Supabase Edge Function - always JPEG after resize
    console.log('Calling edge function with image size:', base64Image.length);

    const { data, error } = await supabase.functions.invoke('ocr-claude', {
      body: {
        image: base64Image,
        mimeType: 'image/jpeg',
      },
    });

    console.log('Edge function response:', { data, error });

    if (error) {
      console.error('Edge function error:', error);
      console.error('Error context:', error.context);
      throw new OCRError(
        `Edge function error: ${error.message}`,
        'EDGE_FUNCTION_ERROR'
      );
    }

    // Check if data contains an error from our function
    const response = data as ClaudeOCRResponse;

    if (!response.success) {
      console.error('OCR failed:', response.error);
      throw new OCRError(
        `OCR failed: ${response.error || 'Unknown error'}`,
        'OCR_FAILED'
      );
    }

    // Convert response to TableData format
    const cells: TableCell[] = (response.cells || []).map((cell, index) => ({
      id: generateUUID(),
      row: cell.row,
      column: cell.column,
      content: cell.content,
      confidence: cell.confidence,
    }));

    const tableData: TableData = {
      id: generateUUID(),
      cells,
      rows: response.rows || 1,
      columns: response.columns || 1,
      createdAt: new Date(),
      imageName: imageUri.split('/').pop(),
    };

    const processingTime = Date.now() - startTime;

    return {
      imageUri,
      recognizedText: response.text || '',
      tableData,
      confidence: calculateAverageConfidence(tableData),
      processingTime,
    };
  } catch (error) {
    if (error instanceof OCRError) {
      throw error;
    }

    console.error('Claude OCR error:', error);
    throw new OCRError(
      'Failed to process handwriting with Claude',
      'CLAUDE_OCR_FAILED'
    );
  }
}

/**
 * Mock OCR for development/testing without calling the actual API
 */
export async function mockRecognizeText(imageUri: string): Promise<OCRResult> {
  const startTime = Date.now();

  // Simulate processing delay
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // Create mock table data
  const mockCells: TableCell[] = [
    { id: generateUUID(), row: 0, column: 0, content: 'Name', confidence: 0.95 },
    { id: generateUUID(), row: 0, column: 1, content: 'Value', confidence: 0.92 },
    { id: generateUUID(), row: 0, column: 2, content: 'Date', confidence: 0.88 },
    { id: generateUUID(), row: 1, column: 0, content: 'Item A', confidence: 0.85 },
    { id: generateUUID(), row: 1, column: 1, content: '100', confidence: 0.90 },
    { id: generateUUID(), row: 1, column: 2, content: '2024-01-15', confidence: 0.78 },
    { id: generateUUID(), row: 2, column: 0, content: 'Item B', confidence: 0.65 },
    { id: generateUUID(), row: 2, column: 1, content: '250', confidence: 0.82 },
    { id: generateUUID(), row: 2, column: 2, content: '2024-01-16', confidence: 0.91 },
  ];

  const tableData: TableData = {
    id: generateUUID(),
    cells: mockCells,
    rows: 3,
    columns: 3,
    createdAt: new Date(),
    imageName: imageUri.split('/').pop(),
  };

  const processingTime = Date.now() - startTime;
  const recognizedText = mockCells.map((c) => c.content).join(' ');

  return {
    imageUri,
    recognizedText,
    tableData,
    confidence: calculateAverageConfidence(tableData),
    processingTime,
  };
}
