import React, { useEffect, useRef } from 'react';
import { View, Text, ScrollView, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface StreamingProcessingIndicatorProps {
  thinkingText: string;
  currentStep: string;
  progress: number;
  error?: string | null;
}

export function StreamingProcessingIndicator({
  thinkingText,
  currentStep,
  progress,
  error,
}: StreamingProcessingIndicatorProps) {
  const scrollViewRef = useRef<ScrollView>(null);
  const spinValue = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  // Auto-scroll to bottom when thinking text updates
  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [thinkingText]);

  // Animate progress bar
  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: progress,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [progress, progressAnim]);

  // Spin animation
  useEffect(() => {
    const spinAnimation = Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      })
    );
    spinAnimation.start();

    return () => spinAnimation.stop();
  }, [spinValue]);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  if (error) {
    return (
      <View className="flex-1 items-center justify-center bg-white px-8">
        <View className="w-20 h-20 rounded-full bg-red-100 items-center justify-center">
          <Ionicons name="alert-circle-outline" size={40} color="#dc2626" />
        </View>
        <Text className="text-xl font-semibold text-gray-900 mt-8 mb-4">
          Processing Failed
        </Text>
        <Text className="text-base text-red-600 text-center">{error}</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white px-6 pt-8">
      {/* Header with spinner */}
      <View className="items-center mb-6">
        <Animated.View style={{ transform: [{ rotate: spin }] }}>
          <View className="w-16 h-16 rounded-full bg-blue-100 items-center justify-center">
            <Ionicons name="scan-outline" size={32} color="#2563eb" />
          </View>
        </Animated.View>

        <Text className="text-xl font-semibold text-gray-900 mt-4">
          Processing Image
        </Text>

        {/* Current step */}
        <Text className="text-base text-blue-600 mt-2">{currentStep}</Text>
      </View>

      {/* Progress bar */}
      <View className="mb-6">
        <View className="flex-row justify-between mb-2">
          <Text className="text-sm text-gray-500">Progress</Text>
          <Text className="text-sm font-medium text-gray-700">
            {Math.round(progress)}%
          </Text>
        </View>
        <View className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <Animated.View
            className="h-full bg-blue-500 rounded-full"
            style={{ width: progressWidth }}
          />
        </View>
      </View>

      {/* Claude's thinking output */}
      <View className="flex-1 mb-4">
        <View className="flex-row items-center mb-3">
          <Ionicons name="bulb-outline" size={18} color="#6b7280" />
          <Text className="text-sm font-medium text-gray-600 ml-2">
            Claude's Thinking
          </Text>
        </View>

        <ScrollView
          ref={scrollViewRef}
          className="flex-1 bg-gray-50 rounded-xl p-4"
          showsVerticalScrollIndicator={true}
          contentContainerStyle={{ paddingBottom: 20 }}
        >
          {thinkingText ? (
            <Text className="text-sm text-gray-700 font-mono leading-relaxed">
              {thinkingText}
            </Text>
          ) : (
            <View className="items-center py-8">
              <Ionicons name="hourglass-outline" size={24} color="#9ca3af" />
              <Text className="text-sm text-gray-400 mt-2">
                Waiting for Claude to start thinking...
              </Text>
            </View>
          )}
        </ScrollView>
      </View>

      {/* Processing tips */}
      <View className="bg-blue-50 rounded-xl p-4 mb-6">
        <View className="flex-row items-start">
          <Ionicons name="information-circle" size={20} color="#2563eb" />
          <Text className="text-sm text-blue-700 ml-2 flex-1">
            Claude is analyzing your handwritten document and extracting
            structured data. This may take a moment for complex documents.
          </Text>
        </View>
      </View>
    </View>
  );
}
