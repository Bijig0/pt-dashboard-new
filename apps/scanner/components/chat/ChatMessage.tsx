import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ChatMessage as ChatMessageType, TableModification } from '../../store/chatStore';

interface ChatMessageProps {
  message: ChatMessageType;
  getAffectedCount?: (modifications: TableModification[]) => number;
}

export function ChatMessage({ message, getAffectedCount }: ChatMessageProps) {
  const isUser = message.role === 'user';
  const hasModifications =
    message.modifications && message.modifications.length > 0;
  const isApplied = message.appliedAt !== undefined;

  return (
    <View
      className={`mb-3 ${isUser ? 'items-end' : 'items-start'}`}
    >
      <View
        className={`max-w-[85%] rounded-2xl px-4 py-3 ${
          isUser
            ? 'bg-blue-500 rounded-br-md'
            : 'bg-gray-100 rounded-bl-md'
        }`}
      >
        <Text
          className={`text-base ${isUser ? 'text-white' : 'text-gray-800'}`}
        >
          {message.content}
        </Text>

        {/* Show modification summary */}
        {hasModifications && (
          <View
            className={`mt-2 pt-2 border-t ${
              isUser ? 'border-blue-400' : 'border-gray-200'
            }`}
          >
            <View className="flex-row items-center">
              {isApplied ? (
                <>
                  <Ionicons
                    name="checkmark-circle"
                    size={16}
                    color={isUser ? '#93c5fd' : '#22c55e'}
                  />
                  <Text
                    className={`ml-1 text-sm ${
                      isUser ? 'text-blue-200' : 'text-green-600'
                    }`}
                  >
                    Changes applied
                  </Text>
                </>
              ) : (
                <>
                  <Ionicons
                    name="flash"
                    size={16}
                    color={isUser ? '#93c5fd' : '#f59e0b'}
                  />
                  <Text
                    className={`ml-1 text-sm ${
                      isUser ? 'text-blue-200' : 'text-amber-600'
                    }`}
                  >
                    {message.modifications!.length} change
                    {message.modifications!.length !== 1 ? 's' : ''}
                    {getAffectedCount && (
                      <Text>
                        {' '}
                        ({getAffectedCount(message.modifications!)} row
                        {getAffectedCount(message.modifications!) !== 1 ? 's' : ''})
                      </Text>
                    )}
                  </Text>
                </>
              )}
            </View>
          </View>
        )}
      </View>

      {/* Timestamp */}
      <Text className="text-xs text-gray-400 mt-1 px-1">
        {message.timestamp.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        })}
      </Text>
    </View>
  );
}
