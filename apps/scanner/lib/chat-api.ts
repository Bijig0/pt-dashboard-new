import { Platform } from 'react-native';
import * as Crypto from 'expo-crypto';
import { TableModification, ChatMessage } from '../store/chatStore';
import { RecordRow } from '@pt-dashboard/shared';

export type { RecordRow } from '@pt-dashboard/shared';

interface ChatRequest {
  message: string;
  tableData: RecordRow[];
  history: Array<{ role: 'user' | 'assistant'; content: string }>;
}

interface ChatResponse {
  response: string;
  modifications: TableModification[];
}

// Get the chat API URL
const getChatApiUrl = (): string => {
  // In development, use local Deno server (configurable via env)
  if (__DEV__) {
    const devUrl = process.env.EXPO_PUBLIC_DEV_CHAT_URL || 'http://localhost:8087';
    return devUrl;
  }
  // In production, use Supabase Edge Function URL
  const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
  return `${supabaseUrl}/functions/v1/chat-assistant`;
};

export async function sendChatMessage(
  message: string,
  tableData: RecordRow[],
  history: ChatMessage[]
): Promise<ChatResponse> {
  const url = getChatApiUrl();
  console.log('Sending chat message to:', url);

  // Convert history to simple format
  const simpleHistory = history.map((msg) => ({
    role: msg.role,
    content: msg.content,
  }));

  const request: ChatRequest = {
    message,
    tableData,
    history: simpleHistory,
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Chat API error: ${response.status} - ${errorText}`);
  }

  return response.json();
}

/**
 * Apply modifications to table data
 */
export function applyModifications(
  records: RecordRow[],
  modifications: TableModification[]
): RecordRow[] {
  let result = [...records];

  for (const mod of modifications) {
    switch (mod.type) {
      case 'update_field': {
        if (mod.rowIndex >= 0 && mod.rowIndex < result.length) {
          result = result.map((row, index) =>
            index === mod.rowIndex
              ? { ...row, [mod.field]: mod.value }
              : row
          );
        }
        break;
      }

      case 'delete_rows': {
        result = result.filter((row) => !matchesFilter(row, mod.filter));
        break;
      }

      case 'update_bulk': {
        result = result.map((row) =>
          matchesFilter(row, mod.filter)
            ? { ...row, ...mod.updates }
            : row
        );
        break;
      }

      case 'add_row': {
        const newRow: RecordRow = {
          id: Crypto.randomUUID(),
          date: mod.data.date || '',
          type: mod.data.type || 'kirim',
          companyName: mod.data.companyName || '',
          alatName: mod.data.alatName || '',
          amount: mod.data.amount ?? 0,
        };
        result.push(newRow);
        break;
      }
    }
  }

  return result;
}

/**
 * Check if a row matches a filter
 */
function matchesFilter(
  row: RecordRow,
  filter: { field: string; operator: string; value: string | number }
): boolean {
  const fieldValue = row[filter.field as keyof RecordRow];
  const filterValue = filter.value;

  switch (filter.operator) {
    case 'equals':
      return fieldValue === filterValue;

    case 'notEquals':
      return fieldValue !== filterValue;

    case 'contains':
      return String(fieldValue)
        .toLowerCase()
        .includes(String(filterValue).toLowerCase());

    case 'startsWith':
      return String(fieldValue)
        .toLowerCase()
        .startsWith(String(filterValue).toLowerCase());

    case 'endsWith':
      return String(fieldValue)
        .toLowerCase()
        .endsWith(String(filterValue).toLowerCase());

    case 'greaterThan':
      return Number(fieldValue) > Number(filterValue);

    case 'lessThan':
      return Number(fieldValue) < Number(filterValue);

    default:
      return false;
  }
}

/**
 * Count how many rows would be affected by modifications
 */
export function countAffectedRows(
  records: RecordRow[],
  modifications: TableModification[]
): number {
  let count = 0;

  for (const mod of modifications) {
    switch (mod.type) {
      case 'update_field':
        count += 1;
        break;

      case 'delete_rows':
        count += records.filter((row) => matchesFilter(row, mod.filter)).length;
        break;

      case 'update_bulk':
        count += records.filter((row) => matchesFilter(row, mod.filter)).length;
        break;

      case 'add_row':
        count += 1;
        break;
    }
  }

  return count;
}

