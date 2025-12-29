import { useCallback, useState } from 'react';
import { router } from 'expo-router';
import * as Crypto from 'expo-crypto';
import {
  streamOCR,
  isThinkingEvent,
  isProgressEvent,
  isResultEvent,
  isErrorEvent,
  type ResultData,
} from '../lib/streaming';
import { useStreamingStore, useScanStore, useDevStore } from '../store';
import { OCRResult } from '../types/ocr';
import { TableData, TableCell } from '../types/table';
import { calculateAverageConfidence, parseDate } from '../utils';
import { mockRecognizeText } from '../lib/claude-ocr';

/**
 * Convert streaming result data to OCRResult format
 */
function convertToOCRResult(
  resultData: ResultData,
  imageUri: string,
  startTime: number
): OCRResult {
  const rows = resultData.data.data;

  // Convert the row-based data to cells format
  // Columns: Date, Type, Company Name, Alat Name, Amount
  const cells: TableCell[] = [];
  let rowIndex = 0;

  // Add header row
  const headers = ['Date', 'Type', 'Company Name', 'Alat Name', 'Amount'];
  headers.forEach((header, colIndex) => {
    cells.push({
      id: Crypto.randomUUID(),
      row: rowIndex,
      column: colIndex,
      content: header,
      confidence: 1.0,
    });
  });
  rowIndex++;

  // Add data rows
  for (const row of rows) {
    // Parse date with error handling
    const dateValue = parseDate(row.date);

    const rowData = [
      dateValue,
      row.type,
      row.companyName,
      row.alatName,
      String(row.amount),
    ];

    rowData.forEach((content, colIndex) => {
      cells.push({
        id: Crypto.randomUUID(),
        row: rowIndex,
        column: colIndex,
        content,
        confidence: 0.9, // Default confidence for streamed results
      });
    });
    rowIndex++;
  }

  const tableData: TableData = {
    id: Crypto.randomUUID(),
    cells,
    rows: rowIndex,
    columns: 5,
    createdAt: new Date(),
    imageName: imageUri.split('/').pop(),
  };

  return {
    imageUri,
    recognizedText: rows
      .map((r) => `${r.date} ${r.type} ${r.companyName} ${r.alatName} ${r.amount}`)
      .join('\n'),
    tableData,
    confidence: calculateAverageConfidence(tableData),
    processingTime: Date.now() - startTime,
  };
}

export function useStreamingOCR() {
  const streamingStore = useStreamingStore();
  const scanStore = useScanStore();
  const { useMockOCR } = useDevStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const processImage = useCallback(
    async (imageUri: string) => {
      const startTime = Date.now();
      setIsProcessing(true);
      setError(null);
      streamingStore.reset();
      streamingStore.startStreaming();

      // Handle mock mode
      if (useMockOCR) {
        try {
          // Simulate streaming progress
          streamingStore.setProgress('Analyzing image...', 30);
          await new Promise((resolve) => setTimeout(resolve, 500));
          streamingStore.appendThinking('Looking at the handwritten document...\n');
          await new Promise((resolve) => setTimeout(resolve, 500));
          streamingStore.setProgress('Recognizing text...', 60);
          streamingStore.appendThinking('I can see several entries with dates and company names...\n');
          await new Promise((resolve) => setTimeout(resolve, 500));
          streamingStore.setProgress('Structuring data...', 90);

          const result = await mockRecognizeText(imageUri);
          streamingStore.setProgress('Complete!', 100);

          // Update scan store with result
          scanStore.completeProcessing(result);

          // Navigate to editor
          router.replace('/scan/editor');
        } catch (err) {
          const message = err instanceof Error ? err.message : 'Mock OCR failed';
          streamingStore.setError(message);
          setError(message);
        } finally {
          setIsProcessing(false);
        }
        return;
      }

      try {
        let result: OCRResult | null = null;

        // Process streaming events
        for await (const event of streamOCR(imageUri)) {
          if (isThinkingEvent(event)) {
            streamingStore.appendThinking(event.data.content);
          } else if (isProgressEvent(event)) {
            streamingStore.setProgress(event.data.step, event.data.percent);
          } else if (isResultEvent(event)) {
            result = convertToOCRResult(event.data, imageUri, startTime);
          } else if (isErrorEvent(event)) {
            throw new Error(event.data.message);
          }
        }

        if (!result) {
          throw new Error('No result received from OCR stream');
        }

        // Update scan store with result
        scanStore.completeProcessing(result);

        // Navigate to editor
        router.replace('/scan/editor');
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Streaming OCR failed';
        streamingStore.setError(message);
        setError(message);
        console.error('Streaming OCR error:', err);
      } finally {
        setIsProcessing(false);
      }
    },
    [streamingStore, scanStore, useMockOCR]
  );

  return {
    processImage,
    isProcessing,
    error,
    // Expose streaming state for UI
    thinkingText: streamingStore.thinkingText,
    currentStep: streamingStore.currentStep,
    progress: streamingStore.progress,
    isStreaming: streamingStore.isStreaming,
  };
}
