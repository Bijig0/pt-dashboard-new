import * as FileSystem from 'expo-file-system/legacy';
import * as ImageManipulator from 'expo-image-manipulator';
import { Platform } from 'react-native';
import { OCRError } from '../types/ocr';

const MAX_IMAGE_SIZE = 1024;

// Get the edge function URL from environment or use local dev
const getStreamingOCRUrl = (): string => {
  // In development, use local Deno server (configurable via env)
  if (__DEV__) {
    const devUrl = process.env.EXPO_PUBLIC_DEV_OCR_URL || 'http://localhost:8086';
    return devUrl;
  }
  // In production, use Supabase Edge Function URL
  const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
  return `${supabaseUrl}/functions/v1/ocr-claude-stream`;
};

export interface StreamEvent {
  type: 'thinking' | 'progress' | 'result' | 'error';
  data: ThinkingData | ProgressData | ResultData | ErrorData;
}

export interface ThinkingData {
  content: string;
}

export interface ProgressData {
  step: string;
  percent: number;
}

export interface ResultData {
  data: {
    data: Array<{
      date: string | Date;
      alatName: string;
      companyName: string;
      type: 'KIRIM' | 'RETUR';
      amount: number;
    }>;
  };
}

export interface ErrorData {
  message: string;
}

/**
 * Resize image for OCR processing
 */
async function resizeImage(imageUri: string): Promise<string> {
  try {
    const result = await ImageManipulator.manipulateAsync(
      imageUri,
      [{ resize: { width: MAX_IMAGE_SIZE } }],
      { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
    );
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
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

/**
 * Convert image URI to base64
 */
async function imageToBase64(imageUri: string): Promise<string> {
  try {
    const resizedUri = await resizeImage(imageUri);

    if (Platform.OS === 'web') {
      return await blobUrlToBase64(resizedUri);
    }

    return await FileSystem.readAsStringAsync(resizedUri, {
      encoding: 'base64',
    });
  } catch (error) {
    throw new OCRError(
      `Failed to process image: ${error instanceof Error ? error.message : 'Unknown error'}`,
      'IMAGE_CONVERSION_FAILED'
    );
  }
}

/**
 * Parse SSE lines into events
 */
function parseSSELine(line: string): { event?: string; data?: string } {
  if (line.startsWith('event: ')) {
    return { event: line.slice(7) };
  }
  if (line.startsWith('data: ')) {
    return { data: line.slice(6) };
  }
  return {};
}

/**
 * Stream OCR processing from edge function
 * Yields events as they arrive from the server
 */
export async function* streamOCR(
  imageUri: string
): AsyncGenerator<StreamEvent, void, unknown> {
  const url = getStreamingOCRUrl();
  console.log('Streaming OCR from:', url);

  // Convert image to base64
  const base64Image = await imageToBase64(imageUri);

  // Make streaming request
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      image: base64Image,
      mimeType: 'image/jpeg',
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new OCRError(
      `Streaming request failed: ${response.status} - ${errorText}`,
      'STREAMING_FAILED'
    );
  }

  if (!response.body) {
    throw new OCRError('No response body for streaming', 'STREAMING_FAILED');
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  let currentEvent = '';

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });

      // Process complete lines
      const lines = buffer.split('\n');
      buffer = lines.pop() || ''; // Keep incomplete line in buffer

      for (const line of lines) {
        const trimmedLine = line.trim();
        if (!trimmedLine) {
          // Empty line signals end of event
          continue;
        }

        const { event, data } = parseSSELine(trimmedLine);

        if (event) {
          currentEvent = event;
        } else if (data && currentEvent) {
          try {
            const parsedData = JSON.parse(data);
            yield {
              type: currentEvent as StreamEvent['type'],
              data: parsedData,
            };
          } catch (parseError) {
            console.warn('Failed to parse SSE data:', data);
          }
        }
      }
    }
  } finally {
    reader.releaseLock();
  }
}

/**
 * Type guards for stream events
 */
export function isThinkingEvent(
  event: StreamEvent
): event is { type: 'thinking'; data: ThinkingData } {
  return event.type === 'thinking';
}

export function isProgressEvent(
  event: StreamEvent
): event is { type: 'progress'; data: ProgressData } {
  return event.type === 'progress';
}

export function isResultEvent(
  event: StreamEvent
): event is { type: 'result'; data: ResultData } {
  return event.type === 'result';
}

export function isErrorEvent(
  event: StreamEvent
): event is { type: 'error'; data: ErrorData } {
  return event.type === 'error';
}
