import React from 'react';
import {
  Pressable,
  Text,
  ActivityIndicator,
  PressableProps,
  Platform,
} from 'react-native';

interface ButtonProps extends PressableProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  icon?: React.ReactNode;
}

export function Button({
  title,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  icon,
  disabled,
  className,
  ...props
}: ButtonProps) {
  const baseClasses = 'flex-row items-center justify-center rounded-xl';

  const variantClasses = {
    primary: 'bg-blue-600 active:bg-blue-700',
    secondary: 'bg-gray-200 active:bg-gray-300',
    outline: 'border-2 border-blue-600 bg-transparent active:bg-blue-50',
    danger: 'bg-red-600 active:bg-red-700',
  };

  const textVariantClasses = {
    primary: 'text-white',
    secondary: 'text-gray-900',
    outline: 'text-blue-600',
    danger: 'text-white',
  };

  const sizeClasses = {
    sm: 'px-3 py-2',
    md: 'px-4 py-3',
    lg: 'px-6 py-4',
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };

  const isDisabled = disabled || isLoading;
  const disabledClasses = isDisabled ? 'opacity-50' : '';

  // Web-specific style to ensure clickability
  const webStyle = Platform.OS === 'web' ? { cursor: isDisabled ? 'not-allowed' : 'pointer' } : {};

  return (
    <Pressable
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${disabledClasses} ${className || ''}`}
      disabled={isDisabled}
      style={webStyle}
      {...props}
    >
      {isLoading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'outline' || variant === 'secondary' ? '#2563eb' : '#fff'}
        />
      ) : (
        <>
          {icon && <>{icon}</>}
          <Text
            className={`font-semibold ${textVariantClasses[variant]} ${textSizeClasses[size]} ${icon ? 'ml-2' : ''}`}
          >
            {title}
          </Text>
        </>
      )}
    </Pressable>
  );
}
