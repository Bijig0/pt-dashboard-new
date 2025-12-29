import { useMutation } from '@tanstack/react-query';
import { recognizeTextWithClaude, mockRecognizeText } from '../lib/claude-ocr';
import { OCRResult } from '../types/ocr';
import { useDevStore } from '../store';

interface OCRParams {
  imageUri: string;
  useMock?: boolean;
}

async function performOCR({ imageUri, useMock }: OCRParams): Promise<OCRResult> {
  if (useMock) {
    return mockRecognizeText(imageUri);
  }
  return recognizeTextWithClaude(imageUri);
}

export function useOCR() {
  const { useMockOCR } = useDevStore();

  return useMutation({
    mutationFn: (imageUri: string) => performOCR({ imageUri, useMock: useMockOCR }),
    onSuccess: (data) => {
      console.log('OCR completed:', {
        rows: data.tableData.rows,
        columns: data.tableData.columns,
        cells: data.tableData.cells.length,
        processingTime: data.processingTime,
      });
    },
    onError: (error) => {
      console.error('OCR failed:', error);
    },
  });
}
