import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, Switch, Modal } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { Card, Button } from '../../components/ui';
import { useAuthStore, useSettingsStore, ThemePreference } from '../../store';
import { isMockMode } from '../../lib/supabase';

export default function SettingsScreen() {
  const { user, signOut, isLoading } = useAuthStore();
  const {
    themePreference,
    effectiveTheme,
    autoSaveEnabled,
    inlineValidationEnabled,
    setThemePreference,
    setAutoSaveEnabled,
    setInlineValidationEnabled,
  } = useSettingsStore();

  const [showThemeModal, setShowThemeModal] = useState(false);

  const handleSignOut = async () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut();
              router.replace('/(auth)/sign-in');
            } catch (error) {
              Alert.alert('Error', 'Failed to sign out. Please try again.');
            }
          },
        },
      ]
    );
  };

  const getThemeLabel = (preference: ThemePreference): string => {
    switch (preference) {
      case 'light': return 'Light';
      case 'dark': return 'Dark';
      case 'system': return 'System';
    }
  };

  const SettingItem = ({
    icon,
    title,
    subtitle,
    onPress,
    showChevron = true,
    rightElement,
  }: {
    icon: keyof typeof Ionicons.glyphMap;
    title: string;
    subtitle?: string;
    onPress?: () => void;
    showChevron?: boolean;
    rightElement?: React.ReactNode;
  }) => (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
      className="flex-row items-center py-3"
    >
      <View className="w-10 h-10 rounded-xl bg-gray-100 items-center justify-center">
        <Ionicons name={icon} size={20} color="#6b7280" />
      </View>
      <View className="ml-3 flex-1">
        <Text className="text-base font-medium text-gray-900">{title}</Text>
        {subtitle && (
          <Text className="text-sm text-gray-500">{subtitle}</Text>
        )}
      </View>
      {rightElement}
      {showChevron && onPress && !rightElement && (
        <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
      )}
    </TouchableOpacity>
  );

  const ThemeOption = ({ value, label }: { value: ThemePreference; label: string }) => (
    <TouchableOpacity
      onPress={() => {
        setThemePreference(value);
        setShowThemeModal(false);
      }}
      className={`flex-row items-center py-4 px-4 border-b border-gray-100 ${
        themePreference === value ? 'bg-blue-50' : ''
      }`}
    >
      <View className={`w-6 h-6 rounded-full border-2 items-center justify-center ${
        themePreference === value ? 'border-blue-600' : 'border-gray-300'
      }`}>
        {themePreference === value && (
          <View className="w-3 h-3 rounded-full bg-blue-600" />
        )}
      </View>
      <Text className={`ml-3 text-base ${
        themePreference === value ? 'text-blue-600 font-medium' : 'text-gray-900'
      }`}>
        {label}
      </Text>
      {value === 'system' && (
        <Text className="ml-2 text-gray-400 text-sm">
          (Currently {effectiveTheme})
        </Text>
      )}
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-gray-50">
      <View className="px-4 pt-4">
        {/* Profile Section */}
        <Card className="mb-4">
          <View className="items-center py-4">
            <View className="w-20 h-20 rounded-full bg-blue-100 items-center justify-center mb-3">
              <Ionicons name="person" size={36} color="#2563eb" />
            </View>
            <Text className="text-lg font-semibold text-gray-900">
              {user?.email || 'Demo User'}
            </Text>
            {isMockMode && (
              <View className="flex-row items-center mt-1">
                <Ionicons name="flask-outline" size={14} color="#f59e0b" />
                <Text className="text-sm text-amber-600 ml-1">Demo Mode</Text>
              </View>
            )}
          </View>
        </Card>

        {/* Appearance Section */}
        <Card className="mb-4">
          <Text className="text-sm font-medium text-gray-500 mb-2">
            APPEARANCE
          </Text>
          <SettingItem
            icon="moon-outline"
            title="Theme"
            subtitle={getThemeLabel(themePreference)}
            onPress={() => setShowThemeModal(true)}
          />
        </Card>

        {/* Editor Settings Section */}
        <Card className="mb-4">
          <Text className="text-sm font-medium text-gray-500 mb-2">
            EDITOR
          </Text>
          <SettingItem
            icon="save-outline"
            title="Auto-save Drafts"
            subtitle="Automatically save while editing"
            rightElement={
              <Switch
                value={autoSaveEnabled}
                onValueChange={setAutoSaveEnabled}
                trackColor={{ false: '#d1d5db', true: '#93c5fd' }}
                thumbColor={autoSaveEnabled ? '#2563eb' : '#f4f4f5'}
              />
            }
            showChevron={false}
          />
          <View className="h-px bg-gray-100 my-1" />
          <SettingItem
            icon="checkmark-circle-outline"
            title="Inline Validation"
            subtitle="Show validation while editing"
            rightElement={
              <Switch
                value={inlineValidationEnabled}
                onValueChange={setInlineValidationEnabled}
                trackColor={{ false: '#d1d5db', true: '#93c5fd' }}
                thumbColor={inlineValidationEnabled ? '#2563eb' : '#f4f4f5'}
              />
            }
            showChevron={false}
          />
        </Card>

        {/* About Section */}
        <Card className="mb-4">
          <Text className="text-sm font-medium text-gray-500 mb-2">ABOUT</Text>
          <SettingItem
            icon="information-circle-outline"
            title="Version"
            subtitle="1.0.0"
            showChevron={false}
          />
          <View className="h-px bg-gray-100 my-1" />
          <SettingItem
            icon="document-text-outline"
            title="Privacy Policy"
            onPress={() => Alert.alert('Privacy Policy', 'This would open the privacy policy.')}
          />
          <View className="h-px bg-gray-100 my-1" />
          <SettingItem
            icon="help-circle-outline"
            title="Help & Support"
            onPress={() => Alert.alert('Help', 'This would open help & support.')}
          />
        </Card>

        {/* Sign Out */}
        <Button
          title="Sign Out"
          variant="danger"
          onPress={handleSignOut}
          isLoading={isLoading}
          icon={<Ionicons name="log-out-outline" size={20} color="#fff" />}
        />
      </View>

      {/* Theme Selection Modal */}
      <Modal
        visible={showThemeModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowThemeModal(false)}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => setShowThemeModal(false)}
          className="flex-1 justify-end bg-black/50"
        >
          <TouchableOpacity activeOpacity={1} onPress={() => {}}>
            <View className="bg-white rounded-t-3xl">
              <View className="p-6 border-b border-gray-100">
                <Text className="text-xl font-bold text-gray-900">
                  Choose Theme
                </Text>
              </View>

              <ThemeOption value="light" label="Light" />
              <ThemeOption value="dark" label="Dark" />
              <ThemeOption value="system" label="System Default" />

              <View className="p-4">
                <Button
                  title="Cancel"
                  variant="secondary"
                  onPress={() => setShowThemeModal(false)}
                />
              </View>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}
