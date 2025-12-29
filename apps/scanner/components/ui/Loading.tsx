import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';

interface LoadingProps {
  message?: string;
  size?: 'small' | 'large';
}

export function Loading({ message, size = 'large' }: LoadingProps) {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <ActivityIndicator size={size} color="#2563eb" />
      {message && (
        <Text className="text-gray-600 mt-4 text-center">{message}</Text>
      )}
    </View>
  );
}

interface LoadingOverlayProps {
  visible: boolean;
  message?: string;
}

export function LoadingOverlay({ visible, message }: LoadingOverlayProps) {
  if (!visible) return null;

  return (
    <View className="absolute inset-0 bg-black/50 items-center justify-center z-50">
      <View className="bg-white rounded-2xl p-6 items-center mx-8">
        <ActivityIndicator size="large" color="#2563eb" />
        {message && (
          <Text className="text-gray-700 mt-4 text-center font-medium">
            {message}
          </Text>
        )}
      </View>
    </View>
  );
}
