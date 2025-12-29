import React, { forwardRef } from 'react';
import { TextInput, TextInputProps, View, Text } from 'react-native';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerClassName?: string;
}

export const Input = forwardRef<TextInput, InputProps>(
  ({ label, error, containerClassName, className, ...props }, ref) => {
    return (
      <View className={containerClassName}>
        {label && (
          <Text className="text-gray-700 font-medium mb-1.5">{label}</Text>
        )}
        <TextInput
          ref={ref}
          className={`bg-gray-100 border rounded-xl px-4 py-3 text-base text-gray-900 ${
            error ? 'border-red-500' : 'border-gray-200'
          } ${className || ''}`}
          placeholderTextColor="#9ca3af"
          {...props}
        />
        {error && (
          <Text className="text-red-500 text-sm mt-1">{error}</Text>
        )}
      </View>
    );
  }
);

Input.displayName = 'Input';
