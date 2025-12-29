import React from 'react';
import { View, ViewProps, Text } from 'react-native';

interface CardProps extends ViewProps {
  title?: string;
  children: React.ReactNode;
}

export function Card({ title, children, className, ...props }: CardProps) {
  return (
    <View
      className={`bg-white rounded-2xl p-4 shadow-sm ${className || ''}`}
      {...props}
    >
      {title && (
        <Text className="text-lg font-semibold text-gray-900 mb-3">{title}</Text>
      )}
      {children}
    </View>
  );
}
