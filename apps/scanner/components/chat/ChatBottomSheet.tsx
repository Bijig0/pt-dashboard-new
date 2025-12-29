import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Animated,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import {
  ChatMessage as ChatMessageType,
  TableModification,
} from '../../store/chatStore';

interface ChatBottomSheetProps {
  isOpen: boolean;
  onToggle: () => void;
  messages: ChatMessageType[];
  isProcessing: boolean;
  canUndo: boolean;
  onSend: (message: string) => void;
  onUndo: () => void;
  onClear: () => void;
  getAffectedCount: (modifications: TableModification[]) => number;
}

const COLLAPSED_HEIGHT = 60;
const EXPANDED_HEIGHT = Dimensions.get('window').height * 0.6;

export function ChatBottomSheet({
  isOpen,
  onToggle,
  messages,
  isProcessing,
  canUndo,
  onSend,
  onUndo,
  onClear,
  getAffectedCount,
}: ChatBottomSheetProps) {
  const scrollViewRef = useRef<ScrollView>(null);
  const heightAnim = useRef(new Animated.Value(COLLAPSED_HEIGHT)).current;

  // Animate height on open/close
  useEffect(() => {
    Animated.spring(heightAnim, {
      toValue: isOpen ? EXPANDED_HEIGHT : COLLAPSED_HEIGHT,
      useNativeDriver: false,
      tension: 100,
      friction: 12,
    }).start();
  }, [isOpen, heightAnim]);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (isOpen && scrollViewRef.current) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages.length, isOpen]);

  return (
    <Animated.View
      style={{
        height: heightAnim,
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'white',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 20,
      }}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
        keyboardVerticalOffset={0}
      >
        {/* Handle bar and header */}
        <TouchableOpacity
          onPress={onToggle}
          className="items-center pt-2 pb-3 border-b border-gray-100"
          activeOpacity={0.7}
        >
          {/* Drag handle */}
          <View className="w-10 h-1 bg-gray-300 rounded-full mb-3" />

          <View className="flex-row items-center justify-between w-full px-4">
            <View className="flex-row items-center">
              <View className="w-8 h-8 rounded-full bg-blue-100 items-center justify-center">
                <Ionicons name="chatbubble-ellipses" size={16} color="#2563eb" />
              </View>
              <Text className="text-base font-semibold text-gray-900 ml-2">
                AI Assistant
              </Text>
              {messages.length > 0 && (
                <View className="bg-blue-100 px-2 py-0.5 rounded-full ml-2">
                  <Text className="text-xs text-blue-600 font-medium">
                    {messages.length}
                  </Text>
                </View>
              )}
            </View>

            <View className="flex-row items-center">
              {/* Undo button */}
              {canUndo && (
                <TouchableOpacity
                  onPress={onUndo}
                  className="mr-3 p-2"
                >
                  <Ionicons name="arrow-undo" size={20} color="#6b7280" />
                </TouchableOpacity>
              )}

              {/* Clear button */}
              {messages.length > 0 && (
                <TouchableOpacity
                  onPress={onClear}
                  className="mr-3 p-2"
                >
                  <Ionicons name="trash-outline" size={18} color="#6b7280" />
                </TouchableOpacity>
              )}

              {/* Expand/collapse icon */}
              <Ionicons
                name={isOpen ? 'chevron-down' : 'chevron-up'}
                size={20}
                color="#6b7280"
              />
            </View>
          </View>
        </TouchableOpacity>

        {/* Chat content (only visible when expanded) */}
        {isOpen && (
          <>
            {/* Messages */}
            <ScrollView
              ref={scrollViewRef}
              className="flex-1 px-4 pt-3"
              showsVerticalScrollIndicator={true}
              contentContainerStyle={{ paddingBottom: 16 }}
            >
              {messages.length === 0 ? (
                <View className="items-center py-8">
                  <View className="w-16 h-16 rounded-full bg-gray-100 items-center justify-center mb-4">
                    <Ionicons name="sparkles" size={32} color="#9ca3af" />
                  </View>
                  <Text className="text-lg font-medium text-gray-700 mb-2">
                    How can I help?
                  </Text>
                  <Text className="text-sm text-gray-500 text-center px-8">
                    Ask me to modify the table data. For example:
                  </Text>
                  <View className="mt-4 space-y-2">
                    <ExamplePrompt text='"Change all Idu Hiruta to IDU HIRUTA"' />
                    <ExamplePrompt text='"Delete rows where amount is 0"' />
                    <ExamplePrompt text='"Set date to 18/12 for TBP companies"' />
                  </View>
                </View>
              ) : (
                messages.map((msg) => (
                  <ChatMessage
                    key={msg.id}
                    message={msg}
                    getAffectedCount={getAffectedCount}
                  />
                ))
              )}

              {/* Processing indicator */}
              {isProcessing && (
                <View className="items-start mb-3">
                  <View className="bg-gray-100 rounded-2xl rounded-bl-md px-4 py-3">
                    <View className="flex-row items-center">
                      <View className="flex-row">
                        <Animated.View className="w-2 h-2 bg-gray-400 rounded-full mr-1" />
                        <Animated.View className="w-2 h-2 bg-gray-400 rounded-full mr-1" />
                        <Animated.View className="w-2 h-2 bg-gray-400 rounded-full" />
                      </View>
                      <Text className="text-sm text-gray-500 ml-2">
                        Thinking...
                      </Text>
                    </View>
                  </View>
                </View>
              )}
            </ScrollView>

            {/* Input */}
            <ChatInput
              onSend={onSend}
              isProcessing={isProcessing}
              placeholder="Ask AI to help edit the table..."
            />
          </>
        )}
      </KeyboardAvoidingView>
    </Animated.View>
  );
}

function ExamplePrompt({ text }: { text: string }) {
  return (
    <View className="bg-gray-50 rounded-lg px-3 py-2">
      <Text className="text-sm text-gray-600 italic">{text}</Text>
    </View>
  );
}
