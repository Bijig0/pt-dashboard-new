import { useCallback } from 'react';
import { useMutation } from '@tanstack/react-query';
import {
  sendChatMessage,
  applyModifications,
  countAffectedRows,
  type RecordRow,
} from '../lib/chat-api';
import { useChatStore, type TableModification } from '../store/chatStore';

interface UseAIChatOptions {
  records: RecordRow[];
  onRecordsChange: (records: RecordRow[]) => void;
  recordsHistory: RecordRow[][];
  setRecordsHistory: React.Dispatch<React.SetStateAction<RecordRow[][]>>;
}

export function useAIChat({
  records,
  onRecordsChange,
  recordsHistory,
  setRecordsHistory,
}: UseAIChatOptions) {
  const chatStore = useChatStore();

  // Mutation for sending messages
  const mutation = useMutation({
    mutationFn: async (message: string) => {
      chatStore.setProcessing(true);

      // Add user message to chat
      chatStore.addMessage({
        role: 'user',
        content: message,
      });

      // Send to API
      const response = await sendChatMessage(
        message,
        records,
        chatStore.messages
      );

      return response;
    },
    onSuccess: (response) => {
      // Add assistant message with modifications
      chatStore.addMessage({
        role: 'assistant',
        content: response.response,
        modifications: response.modifications,
      });

      // If there are modifications, apply them directly
      if (response.modifications.length > 0) {
        applyModificationsToRecords(response.modifications);
      }

      chatStore.setProcessing(false);
    },
    onError: (error) => {
      console.error('Chat error:', error);

      // Add error message
      chatStore.addMessage({
        role: 'assistant',
        content: `Sorry, I encountered an error: ${error.message}`,
      });

      chatStore.setProcessing(false);
    },
  });

  // Push current state to history for undo
  const pushToHistory = useCallback(() => {
    setRecordsHistory((prev) => [...prev, records]);
  }, [records, setRecordsHistory]);

  // Apply modifications to records
  const applyModificationsToRecords = useCallback(
    (modifications: TableModification[]) => {
      // Push current state to history before applying
      pushToHistory();

      // Apply modifications
      const newRecords = applyModifications(records, modifications);
      onRecordsChange(newRecords);

      // Mark the latest assistant message as applied
      const lastMessage = chatStore.messages[chatStore.messages.length - 1];
      if (lastMessage?.role === 'assistant' && lastMessage.modifications) {
        chatStore.markModificationsApplied(lastMessage.id);
      }
    },
    [records, onRecordsChange, pushToHistory, chatStore]
  );

  // Undo last change
  const undo = useCallback(() => {
    if (recordsHistory.length > 0) {
      const previousRecords = recordsHistory[recordsHistory.length - 1];
      setRecordsHistory((prev) => prev.slice(0, -1));
      onRecordsChange(previousRecords);
    }
  }, [recordsHistory, setRecordsHistory, onRecordsChange]);

  // Send a message
  const sendMessage = useCallback(
    (message: string) => {
      if (!message.trim()) return;
      mutation.mutate(message.trim());
    },
    [mutation]
  );

  // Get affected rows count for pending modifications
  const getAffectedCount = useCallback(
    (modifications: TableModification[]) => {
      return countAffectedRows(records, modifications);
    },
    [records]
  );

  return {
    // Actions
    sendMessage,
    undo,
    applyModifications: applyModificationsToRecords,

    // State
    messages: chatStore.messages,
    isProcessing: chatStore.isProcessing,
    isOpen: chatStore.isOpen,
    canUndo: recordsHistory.length > 0,

    // UI controls
    toggleChat: chatStore.toggleOpen,
    openChat: () => chatStore.setOpen(true),
    closeChat: () => chatStore.setOpen(false),
    clearChat: chatStore.clear,

    // Utilities
    getAffectedCount,
  };
}
