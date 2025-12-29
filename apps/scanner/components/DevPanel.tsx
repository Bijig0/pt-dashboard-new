import React, { useState } from 'react';
import { View, Text, Pressable, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useDevStore } from '../store';

export function DevPanel() {
  const [isExpanded, setIsExpanded] = useState(true);
  const { useMockOCR, toggleUseMockOCR, enableUpload, toggleEnableUpload, showDevPanel } = useDevStore();

  // Only render on web
  if (Platform.OS !== 'web' || !showDevPanel) {
    return null;
  }

  if (!isExpanded) {
    return (
      <Pressable
        onPress={() => setIsExpanded(true)}
        style={{
          position: 'absolute',
          bottom: 20,
          right: 20,
          width: 48,
          height: 48,
          borderRadius: 24,
          backgroundColor: '#1f2937',
          alignItems: 'center',
          justifyContent: 'center',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 4,
          zIndex: 9999,
        }}
      >
        <Ionicons name="code-slash" size={24} color="#fff" />
      </Pressable>
    );
  }

  return (
    <View
      style={{
        position: 'absolute',
        bottom: 20,
        right: 20,
        width: 280,
        backgroundColor: '#1f2937',
        borderRadius: 12,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        zIndex: 9999,
      }}
    >
      {/* Header */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Ionicons name="code-slash" size={18} color="#60a5fa" />
          <Text style={{ color: '#fff', fontWeight: '600', fontSize: 14, marginLeft: 8 }}>
            Dev Panel
          </Text>
        </View>
        <Pressable onPress={() => setIsExpanded(false)}>
          <Ionicons name="chevron-down" size={20} color="#9ca3af" />
        </Pressable>
      </View>

      {/* Mock OCR Toggle */}
      <Pressable
        onPress={toggleUseMockOCR}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: '#374151',
          borderRadius: 8,
          padding: 12,
          marginBottom: 8,
        }}
      >
        <View style={{ flex: 1 }}>
          <Text style={{ color: '#fff', fontSize: 14, fontWeight: '500' }}>
            Use Mock OCR
          </Text>
          <Text style={{ color: '#9ca3af', fontSize: 12, marginTop: 2 }}>
            Skip Claude API calls
          </Text>
        </View>
        <View
          style={{
            width: 44,
            height: 24,
            borderRadius: 12,
            backgroundColor: useMockOCR ? '#22c55e' : '#4b5563',
            justifyContent: 'center',
            paddingHorizontal: 2,
          }}
        >
          <View
            style={{
              width: 20,
              height: 20,
              borderRadius: 10,
              backgroundColor: '#fff',
              alignSelf: useMockOCR ? 'flex-end' : 'flex-start',
            }}
          />
        </View>
      </Pressable>

      {/* Enable Upload Toggle */}
      <Pressable
        onPress={toggleEnableUpload}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: '#374151',
          borderRadius: 8,
          padding: 12,
        }}
      >
        <View style={{ flex: 1 }}>
          <Text style={{ color: '#fff', fontSize: 14, fontWeight: '500' }}>
            Enable Upload
          </Text>
          <Text style={{ color: '#9ca3af', fontSize: 12, marginTop: 2 }}>
            Upload to Supabase
          </Text>
        </View>
        <View
          style={{
            width: 44,
            height: 24,
            borderRadius: 12,
            backgroundColor: enableUpload ? '#22c55e' : '#4b5563',
            justifyContent: 'center',
            paddingHorizontal: 2,
          }}
        >
          <View
            style={{
              width: 20,
              height: 20,
              borderRadius: 10,
              backgroundColor: '#fff',
              alignSelf: enableUpload ? 'flex-end' : 'flex-start',
            }}
          />
        </View>
      </Pressable>

      {/* Status indicators */}
      <View style={{ marginTop: 12, gap: 6 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View
            style={{
              width: 8,
              height: 8,
              borderRadius: 4,
              backgroundColor: useMockOCR ? '#fbbf24' : '#22c55e',
              marginRight: 8,
            }}
          />
          <Text style={{ color: '#9ca3af', fontSize: 12 }}>
            {useMockOCR ? 'Mock OCR' : 'Live OCR'}
          </Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View
            style={{
              width: 8,
              height: 8,
              borderRadius: 4,
              backgroundColor: enableUpload ? '#22c55e' : '#ef4444',
              marginRight: 8,
            }}
          />
          <Text style={{ color: '#9ca3af', fontSize: 12 }}>
            {enableUpload ? 'Upload enabled' : 'Upload disabled'}
          </Text>
        </View>
      </View>
    </View>
  );
}
