import { create } from 'zustand';

// Modification types (matching backend schema)
export type FilterOperator =
  | 'equals'
  | 'notEquals'
  | 'contains'
  | 'startsWith'
  | 'endsWith'
  | 'greaterThan'
  | 'lessThan';

export interface TableFilter {
  field: 'date' | 'type' | 'companyName' | 'alatName' | 'amount';
  operator: FilterOperator;
  value: string | number;
}

export type TableModification =
  | {
      type: 'update_field';
      rowIndex: number;
      field: 'date' | 'type' | 'companyName' | 'alatName' | 'amount';
      value: string | number | null;
    }
  | {
      type: 'delete_rows';
      filter: TableFilter;
    }
  | {
      type: 'update_bulk';
      filter: TableFilter;
      updates: Record<string, string | number | null>;
    }
  | {
      type: 'add_row';
      data: {
        date?: string;
        type?: 'kirim' | 'terima';
        companyName?: string;
        alatName?: string;
        amount?: number | null;
      };
    };

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  modifications?: TableModification[];
  appliedAt?: Date;
  timestamp: Date;
}

interface ChatStore {
  // State
  messages: ChatMessage[];
  isProcessing: boolean;
  isOpen: boolean;

  // Actions
  addMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  markModificationsApplied: (messageId: string) => void;
  setProcessing: (processing: boolean) => void;
  setOpen: (open: boolean) => void;
  toggleOpen: () => void;
  clear: () => void;
}

// Simple UUID generator
function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export const useChatStore = create<ChatStore>((set) => ({
  // Initial state
  messages: [],
  isProcessing: false,
  isOpen: false,

  // Add a new message
  addMessage: (message) => {
    set((state) => ({
      messages: [
        ...state.messages,
        {
          ...message,
          id: generateUUID(),
          timestamp: new Date(),
        },
      ],
    }));
  },

  // Mark modifications as applied
  markModificationsApplied: (messageId) => {
    set((state) => ({
      messages: state.messages.map((msg) =>
        msg.id === messageId ? { ...msg, appliedAt: new Date() } : msg
      ),
    }));
  },

  // Set processing state
  setProcessing: (processing) => {
    set({ isProcessing: processing });
  },

  // Set open state
  setOpen: (open) => {
    set({ isOpen: open });
  },

  // Toggle open state
  toggleOpen: () => {
    set((state) => ({ isOpen: !state.isOpen }));
  },

  // Clear all messages
  clear: () => {
    set({
      messages: [],
      isProcessing: false,
    });
  },
}));
