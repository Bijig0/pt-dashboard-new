import "../global.css";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Ionicons } from '@expo/vector-icons';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { QueryClientProvider } from '@tanstack/react-query';
import { useFonts } from 'expo-font';
import { Stack, Redirect, useSegments, useRootNavigationState } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import 'react-native-reanimated';

import { useAuthStore, useSettingsStore } from '../store';
import { DevPanel } from '../components/DevPanel';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { queryClient } from '../lib/queryClient';

// Re-export ErrorBoundary for expo-router
export { ErrorBoundary } from '../components/ErrorBoundary';

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

// Check if running in browser (not SSR)
const isBrowser = typeof window !== 'undefined';

// Loading screen component
function LoadingScreen({ message }: { message?: string }) {
  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#2563eb" />
      {message && <Text style={styles.loadingText}>{message}</Text>}
    </View>
  );
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
    ...Ionicons.font,
  });

  const { initialize, isInitialized } = useAuthStore();

  // Initialize auth (with timeout protection in authStore)
  useEffect(() => {
    initialize();
  }, [initialize]);

  // Handle font loading errors gracefully
  useEffect(() => {
    if (fontError) {
      console.error('[RootLayout] Font loading error:', fontError);
      // Don't throw - allow app to work without custom fonts
    }
  }, [fontError]);

  // Hide splash screen when ready
  useEffect(() => {
    if (fontsLoaded && isInitialized) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, isInitialized]);

  // Show loading while fonts load (auth has its own timeout)
  if (!fontsLoaded && !fontError) {
    return <LoadingScreen message="Loading..." />;
  }

  // Show loading while auth initializes (max 5 seconds due to timeout)
  if (!isInitialized) {
    return <LoadingScreen message="Initializing..." />;
  }

  return (
    <ErrorBoundary>
      <RootLayoutNav />
    </ErrorBoundary>
  );
}

function RootLayoutNav() {
  const { effectiveTheme } = useSettingsStore();
  const { session, isInitialized } = useAuthStore();
  const segments = useSegments();
  const navigationState = useRootNavigationState();

  // Check if user is authenticated
  const isAuthenticated = !!session;

  // Check which segment group we're in
  const inAuthGroup = segments[0] === '(auth)';

  // Wait for navigation to be ready (with fallback for SSR)
  if (!isBrowser) {
    // During SSR, render the navigation structure
    return (
      <QueryClientProvider client={queryClient}>
        <ThemeProvider value={effectiveTheme === 'dark' ? DarkTheme : DefaultTheme}>
          <NavigationContent />
        </ThemeProvider>
      </QueryClientProvider>
    );
  }

  // On client, wait for navigation state
  if (!navigationState?.key) {
    return <LoadingScreen message="Loading navigation..." />;
  }

  // Redirect logic based on authentication state (only when auth is initialized)
  if (isInitialized) {
    // If not authenticated and not in auth group, redirect to sign-in
    if (!isAuthenticated && !inAuthGroup) {
      return <Redirect href="/(auth)/sign-in" />;
    }

    // If authenticated and in auth group, redirect to home
    if (isAuthenticated && inAuthGroup) {
      return <Redirect href="/(tabs)" />;
    }
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider value={effectiveTheme === 'dark' ? DarkTheme : DefaultTheme}>
        <NavigationContent />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

function NavigationContent() {
  return (
    <View style={styles.container}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="scan/processing"
          options={{
            presentation: 'fullScreenModal',
            gestureEnabled: false,
          }}
        />
        <Stack.Screen
          name="scan/editor"
          options={{
            presentation: 'card',
            headerShown: true,
            headerTitle: 'Edit Table',
          }}
        />
        <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
      </Stack>
      <DevPanel />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#6b7280',
  },
});
