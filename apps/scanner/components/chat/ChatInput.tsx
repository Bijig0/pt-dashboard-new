import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ChatInputProps {
  onSend: (message: string) => void;
  isProcessing: boolean;
  placeholder?: string;
}

export function ChatInput({
  onSend,
  isProcessing,
  placeholder = 'Ask AI to help edit...',
}: ChatInputProps) {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (message.trim() && !isProcessing) {
      onSend(message.trim());
      setMessage('');
    }
  };

  const handleKeyPress = (e: { nativeEvent: { key: string } }) => {
    if (e.nativeEvent.key === 'Enter' && !isProcessing) {
      handleSend();
    }
  };

  return (
    <View className="flex-row items-end bg-white border-t border-gray-200 px-4 py-3">
      <View className="flex-1 flex-row items-end bg-gray-100 rounded-2xl px-4 py-2 mr-2">
        <TextInput
          value={message}
          onChangeText={setMessage}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          placeholderTextColor="#9ca3af"
          multiline
          maxLength={500}
          editable={!isProcessing}
          className="flex-1 text-base text-gray-900 max-h-24"
          style={{ minHeight: 24 }}
        />
      </View>

      <TouchableOpacity
        onPress={handleSend}
        disabled={!message.trim() || isProcessing}
        className={`w-10 h-10 rounded-full items-center justify-center ${
          message.trim() && !isProcessing
            ? 'bg-blue-500'
            : 'bg-gray-300'
        }`}
      >
        {isProcessing ? (
          <ActivityIndicator color="#fff" size="small" />
        ) : (
          <Ionicons
            name="send"
            size={18}
            color="#fff"
          />
        )}
      </TouchableOpacity>
    </View>
  );
}
