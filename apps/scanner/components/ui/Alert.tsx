import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface AlertProps {
  type: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  message: string;
  className?: string;
}

const alertConfig = {
  success: {
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    textColor: 'text-green-800',
    icon: 'checkmark-circle' as const,
    iconColor: '#16a34a',
  },
  error: {
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    textColor: 'text-red-800',
    icon: 'close-circle' as const,
    iconColor: '#dc2626',
  },
  warning: {
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200',
    textColor: 'text-yellow-800',
    icon: 'warning' as const,
    iconColor: '#ca8a04',
  },
  info: {
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    textColor: 'text-blue-800',
    icon: 'information-circle' as const,
    iconColor: '#2563eb',
  },
};

export function Alert({ type, title, message, className }: AlertProps) {
  const config = alertConfig[type];

  return (
    <View
      className={`flex-row items-start p-4 rounded-xl border ${config.bgColor} ${config.borderColor} ${className || ''}`}
    >
      <Ionicons name={config.icon} size={24} color={config.iconColor} />
      <View className="flex-1 ml-3">
        {title && (
          <Text className={`font-semibold ${config.textColor} mb-1`}>
            {title}
          </Text>
        )}
        <Text className={config.textColor}>{message}</Text>
      </View>
    </View>
  );
}
