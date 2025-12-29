import React, { useEffect, useRef } from 'react';
import { View } from 'react-native';
import { Redirect } from 'expo-router';
import { StreamingProcessingIndicator } from '../../components/scanner';
import { useStreamingStore, useScanStore } from '../../store';
import { useStreamingOCR } from '../../hooks';

export default function ProcessingScreen() {
  const { selectedImageUri } = useScanStore();
  const { thinkingText, currentStep, progress, error } = useStreamingStore();
  const { processImage } = useStreamingOCR();
  const hasStarted = useRef(false);

  // Start processing when screen loads
  useEffect(() => {
    if (selectedImageUri && !hasStarted.current) {
      hasStarted.current = true;
      processImage(selectedImageUri);
    }
  }, [selectedImageUri, processImage]);

  // Redirect to home if no image is selected (protects against direct URL access)
  if (!selectedImageUri) {
    return <Redirect href="/(tabs)" />;
  }

  return (
    <View className="flex-1 bg-white">
      <StreamingProcessingIndicator
        thinkingText={thinkingText}
        currentStep={currentStep}
        progress={progress}
        error={error}
      />
    </View>
  );
}
