import React from 'react';
import { Platform } from 'react-native';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { useColorScheme } from '@/components/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#2563eb',
        tabBarInactiveTintColor: isDark ? '#6b7280' : '#9ca3af',
        tabBarStyle: {
          backgroundColor: isDark ? '#111827' : '#ffffff',
          borderTopWidth: 1,
          borderTopColor: isDark ? '#1f2937' : '#f3f4f6',
          height: Platform.OS === 'web' ? 70 : 85,
          paddingTop: 10,
          paddingBottom: Platform.OS === 'web' ? 10 : 25,
        },
        tabBarIconStyle: {
          marginBottom: 2,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
        headerStyle: {
          backgroundColor: isDark ? '#111827' : '#ffffff',
          borderBottomWidth: 1,
          borderBottomColor: isDark ? '#1f2937' : '#f3f4f6',
        },
        headerTintColor: isDark ? '#ffffff' : '#111827',
        headerTitleStyle: {
          fontSize: 18,
          fontWeight: '700',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Scan',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "scan" : "scan-outline"}
              size={28}
              color={color}
            />
          ),
          headerTitle: 'Handwriting Scanner',
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'History',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "time" : "time-outline"}
              size={28}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "settings" : "settings-outline"}
              size={28}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
