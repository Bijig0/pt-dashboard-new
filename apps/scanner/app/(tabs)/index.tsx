import React, { useState, useRef, useEffect, useCallback } from 'react';
import { View, Text, Alert as RNAlert, Platform } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

import { Button, Card } from '../../components/ui';
import { useScanStore, useStreamingStore } from '../../store';

// Cross-platform alert helper
const showAlert = (title: string, message: string) => {
  if (Platform.OS === 'web') {
    window.alert(`${title}\n\n${message}`);
  } else {
    RNAlert.alert(title, message);
  }
};

export default function ScannerScreen() {
  const { setSelectedImage } = useScanStore();
  const { reset: resetStreaming, isStreaming } = useStreamingStore();
  const [isNavigating, setIsNavigating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showWebFileFallback, setShowWebFileFallback] = useState(false);

  // Timer ref for web file picker timeout
  const webFallbackTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Handle file selection from fallback web input
  const handleWebFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    if (webFallbackTimerRef.current) {
      clearTimeout(webFallbackTimerRef.current);
      webFallbackTimerRef.current = null;
    }
    const file = event.target.files?.[0];
    if (file) {
      console.log('[Scanner] Web file selected via fallback:', file.name);
      setShowWebFileFallback(false);
      const url = URL.createObjectURL(file);
      // We need to call processImage but it's defined later - inline it here
      resetStreaming();
      setSelectedImage(url);
      setIsNavigating(true);
      router.push('/scan/processing');
      setTimeout(() => setIsNavigating(false), 500);
    }
    // Reset input so same file can be selected again
    if (event.target) {
      event.target.value = '';
    }
  }, [resetStreaming, setSelectedImage]);

  const handleSelectFromLibrary = async () => {
    console.log('[Scanner] Select from library clicked');

    // On web, use native file input for better compatibility
    if (Platform.OS === 'web') {
      console.log('[Scanner] Web platform detected, creating dynamic file input');
      setShowWebFileFallback(false);
      if (webFallbackTimerRef.current) {
        clearTimeout(webFallbackTimerRef.current);
        webFallbackTimerRef.current = null;
      }

      // Create input dynamically for maximum browser compatibility
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.style.display = 'none';

      input.onchange = (e) => {
        const target = e.target as HTMLInputElement;
        const file = target.files?.[0];
        if (file) {
          console.log('[Scanner] File selected via dynamic input:', file.name);
          const url = URL.createObjectURL(file);
          processImage(url);
        }
        // Clean up
        document.body.removeChild(input);
      };

      // Handle cancel (input loses focus without selection)
      input.oncancel = () => {
        console.log('[Scanner] File selection cancelled');
        document.body.removeChild(input);
      };

      document.body.appendChild(input);
      input.click();

      // Fallback cleanup after timeout
      webFallbackTimerRef.current = setTimeout(() => {
        if (document.body.contains(input)) {
          document.body.removeChild(input);
        }
        setShowWebFileFallback(true);
      }, 60000); // 60 second timeout for file selection

      return;
    }

    setIsLoading(true);

    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      console.log('[Scanner] Permission result:', permissionResult);

      if (!permissionResult.granted) {
        showAlert(
          'Permission Required',
          'Please allow access to your photo library to select images.'
        );
        setIsLoading(false);
        return;
      }

      console.log('[Scanner] Launching image library...');
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        quality: 1,
        allowsEditing: false,
      });
      console.log('[Scanner] Image picker result:', result);

      if (!result.canceled && result.assets && result.assets[0]) {
        console.log('[Scanner] Image selected:', result.assets[0].uri);
        processImage(result.assets[0].uri);
      } else {
        console.log('[Scanner] Image selection cancelled or no assets');
      }
    } catch (error) {
      console.error('[Scanner] Error selecting image:', error);
      showAlert('Error', `Failed to select image: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTakePhoto = async () => {
    console.log('[Scanner] Take photo clicked');
    setIsLoading(true);

    try {
      // Camera is not available on web
      if (Platform.OS === 'web') {
        showAlert('Not Available', 'Camera is not available in the web browser. Please use "Select from Library" instead.');
        setIsLoading(false);
        return;
      }

      const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
      console.log('[Scanner] Camera permission result:', permissionResult);

      if (!permissionResult.granted) {
        showAlert(
          'Permission Required',
          'Please allow access to your camera to take photos.'
        );
        setIsLoading(false);
        return;
      }

      console.log('[Scanner] Launching camera...');
      const result = await ImagePicker.launchCameraAsync({
        quality: 1,
        allowsEditing: false,
      });
      console.log('[Scanner] Camera result:', result);

      if (!result.canceled && result.assets && result.assets[0]) {
        console.log('[Scanner] Photo taken:', result.assets[0].uri);
        processImage(result.assets[0].uri);
      } else {
        console.log('[Scanner] Photo cancelled or no assets');
      }
    } catch (error) {
      console.error('[Scanner] Error taking photo:', error);
      showAlert('Error', `Failed to take photo: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const processImage = (imageUri: string) => {
    // Reset streaming state before starting new processing
    resetStreaming();
    setSelectedImage(imageUri);
    setIsNavigating(true);

    // Navigate to processing screen (processing will start there)
    router.push('/scan/processing');

    // Reset navigation state after a delay
    setTimeout(() => setIsNavigating(false), 500);
  };

  const isProcessing = isStreaming || isNavigating || isLoading;

  useEffect(() => {
    return () => {
      if (webFallbackTimerRef.current) {
        clearTimeout(webFallbackTimerRef.current);
        webFallbackTimerRef.current = null;
      }
    };
  }, []);

  return (
    <View className="flex-1 bg-gray-50">
      <View className="flex-1 px-6 pt-8">
        {/* Hero Section */}
        <View className="items-center mb-10">
          <View className="w-24 h-24 rounded-3xl bg-blue-100 items-center justify-center mb-6">
            <Ionicons name="scan" size={48} color="#2563eb" />
          </View>
          <Text className="text-2xl font-bold text-gray-900 text-center">
            Scan Handwritten Documents
          </Text>
          <Text className="text-gray-500 mt-2 text-center px-4">
            Convert handwritten tables and notes into editable digital data
          </Text>
        </View>

        {/* Action Cards */}
        <Card className="mb-4">
          <View className="flex-row items-center mb-4">
            <View className="w-12 h-12 rounded-xl bg-blue-100 items-center justify-center">
              <Ionicons name="images-outline" size={24} color="#2563eb" />
            </View>
            <View className="ml-4 flex-1">
              <Text className="text-lg font-semibold text-gray-900">
                Photo Library
              </Text>
              <Text className="text-gray-500 text-sm">
                Select an existing photo
              </Text>
            </View>
          </View>
          <Button
            title="Select from Library"
            onPress={handleSelectFromLibrary}
            icon={<Ionicons name="folder-open-outline" size={20} color="#fff" />}
            disabled={isProcessing}
          />
          {Platform.OS === 'web' && showWebFileFallback && (
            <View className="mt-3 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2">
              <Text className="text-xs text-blue-900 mb-2">
                If the file picker did not open, use this fallback:
              </Text>
              <input
                type="file"
                accept="image/*"
                onChange={handleWebFileSelect}
                style={{
                  width: '100%',
                  padding: '8px 10px',
                  borderRadius: 8,
                  border: '1px solid #93c5fd',
                  background: '#fff',
                  fontSize: 12,
                }}
              />
            </View>
          )}
        </Card>

        <Card>
          <View className="flex-row items-center mb-4">
            <View className="w-12 h-12 rounded-xl bg-green-100 items-center justify-center">
              <Ionicons name="camera-outline" size={24} color="#16a34a" />
            </View>
            <View className="ml-4 flex-1">
              <Text className="text-lg font-semibold text-gray-900">
                Camera
              </Text>
              <Text className="text-gray-500 text-sm">
                Take a new photo
              </Text>
            </View>
          </View>
          <Button
            title="Take Photo"
            variant="secondary"
            onPress={handleTakePhoto}
            icon={<Ionicons name="camera-outline" size={20} color="#111827" />}
            disabled={isProcessing}
          />
        </Card>

        {/* Tips */}
        <View className="mt-8 px-2">
          <Text className="text-sm text-gray-500 mb-2">Tips for best results:</Text>
          <View className="flex-row items-start mb-1">
            <Ionicons name="checkmark-circle" size={16} color="#22c55e" />
            <Text className="text-sm text-gray-500 ml-2 flex-1">
              Ensure good lighting and focus
            </Text>
          </View>
          <View className="flex-row items-start mb-1">
            <Ionicons name="checkmark-circle" size={16} color="#22c55e" />
            <Text className="text-sm text-gray-500 ml-2 flex-1">
              Keep the document flat and straight
            </Text>
          </View>
          <View className="flex-row items-start">
            <Ionicons name="checkmark-circle" size={16} color="#22c55e" />
            <Text className="text-sm text-gray-500 ml-2 flex-1">
              Write clearly with dark ink
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}
