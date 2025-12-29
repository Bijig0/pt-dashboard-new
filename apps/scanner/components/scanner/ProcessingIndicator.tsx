import React, { useEffect, useState } from 'react';
import { View, Text, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const processingSteps = [
  { id: 1, text: 'Analyzing image...', icon: 'image-outline' as const },
  { id: 2, text: 'Recognizing text...', icon: 'text-outline' as const },
  { id: 3, text: 'Structuring table data...', icon: 'grid-outline' as const },
];

export function ProcessingIndicator() {
  const [currentStep, setCurrentStep] = useState(0);
  const spinValue = new Animated.Value(0);

  useEffect(() => {
    // Animate through steps
    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % processingSteps.length);
    }, 1500);

    return () => clearInterval(stepInterval);
  }, []);

  useEffect(() => {
    // Spin animation
    const spinAnimation = Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      })
    );
    spinAnimation.start();

    return () => spinAnimation.stop();
  }, []);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View className="flex-1 items-center justify-center bg-white px-8">
      {/* Spinning icon */}
      <Animated.View style={{ transform: [{ rotate: spin }] }}>
        <View className="w-20 h-20 rounded-full bg-blue-100 items-center justify-center">
          <Ionicons name="scan-outline" size={40} color="#2563eb" />
        </View>
      </Animated.View>

      {/* Processing text */}
      <Text className="text-xl font-semibold text-gray-900 mt-8 mb-6">
        Processing Image
      </Text>

      {/* Steps */}
      <View className="w-full max-w-xs">
        {processingSteps.map((step, index) => {
          const isActive = index === currentStep;
          const isComplete = index < currentStep;

          return (
            <View
              key={step.id}
              className={`flex-row items-center py-3 ${
                index < processingSteps.length - 1 ? 'border-b border-gray-100' : ''
              }`}
            >
              <View
                className={`w-8 h-8 rounded-full items-center justify-center ${
                  isComplete
                    ? 'bg-green-500'
                    : isActive
                    ? 'bg-blue-500'
                    : 'bg-gray-200'
                }`}
              >
                {isComplete ? (
                  <Ionicons name="checkmark" size={18} color="#fff" />
                ) : (
                  <Ionicons
                    name={step.icon}
                    size={16}
                    color={isActive ? '#fff' : '#9ca3af'}
                  />
                )}
              </View>
              <Text
                className={`ml-3 text-base ${
                  isActive ? 'text-blue-600 font-medium' : 'text-gray-500'
                }`}
              >
                {step.text}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}
