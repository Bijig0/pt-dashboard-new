import React, { useEffect, useCallback, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  RefreshControl,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { Card } from '../../components/ui';
import { useHistoryStore, useAuthStore, useScanStore, useTableStore, HistoryTab } from '../../store';
import { ScanRecord } from '../../lib/scanRecordService';

export default function HistoryScreen() {
  const { user } = useAuthStore();
  const {
    completedRecords,
    draftRecords,
    activeTab,
    searchQuery,
    isLoading,
    error,
    hasMore,
    setActiveTab,
    setSearchQuery,
    fetchRecords,
    fetchMore,
    refresh,
    deleteRecord,
  } = useHistoryStore();

  const { setSelectedImage } = useScanStore();
  const { setTable } = useTableStore();

  const [localSearch, setLocalSearch] = useState(searchQuery);

  // Fetch records on mount and when user changes
  useEffect(() => {
    if (user) {
      fetchRecords();
    }
  }, [user?.id]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localSearch !== searchQuery) {
        setSearchQuery(localSearch);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [localSearch]);

  const records = activeTab === 'completed' ? completedRecords : draftRecords;

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleRecordPress = useCallback((record: ScanRecord) => {
    if (activeTab === 'drafts') {
      // Re-edit draft
      handleReEdit(record);
    } else {
      // View completed record details
      Alert.alert(
        record.name || 'Scan Record',
        `${record.rowCount} rows × ${record.columnCount} columns\n` +
        `Uploaded: ${formatDate(record.uploadedAt || record.createdAt)}`,
        [
          { text: 'Close', style: 'cancel' },
          {
            text: 'Re-edit',
            onPress: () => handleReEdit(record),
          },
        ]
      );
    }
  }, [activeTab]);

  const handleReEdit = useCallback((record: ScanRecord) => {
    if (!record.tableData) {
      Alert.alert('Error', 'No table data available for this record');
      return;
    }

    // Set the image and table data in stores
    if (record.imageUri) {
      setSelectedImage(record.imageUri);
    }
    setTable(record.tableData);

    // Navigate to editor
    router.push('/scan/editor');
  }, []);

  const handleDelete = useCallback((record: ScanRecord) => {
    Alert.alert(
      'Delete Record',
      `Are you sure you want to delete "${record.name || 'this record'}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteRecord(record.id);
            } catch (err) {
              Alert.alert('Error', 'Failed to delete record');
            }
          },
        },
      ]
    );
  }, [deleteRecord]);

  const renderItem = useCallback(({ item }: { item: ScanRecord }) => (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => handleRecordPress(item)}
      onLongPress={() => handleDelete(item)}
    >
      <Card className="mb-3">
        <View className="flex-row items-center">
          <View className={`w-12 h-12 rounded-xl items-center justify-center ${
            item.status === 'draft' ? 'bg-amber-100' :
            item.status === 'failed' ? 'bg-red-100' : 'bg-blue-100'
          }`}>
            <Ionicons
              name={
                item.status === 'draft' ? 'document-outline' :
                item.status === 'failed' ? 'alert-circle-outline' : 'checkmark-circle-outline'
              }
              size={24}
              color={
                item.status === 'draft' ? '#f59e0b' :
                item.status === 'failed' ? '#ef4444' : '#2563eb'
              }
            />
          </View>
          <View className="ml-4 flex-1">
            <Text className="text-lg font-semibold text-gray-900" numberOfLines={1}>
              {item.name || 'Untitled Scan'}
            </Text>
            <Text className="text-gray-500 text-sm">
              {item.rowCount} rows × {item.columnCount} columns
              {item.confidence > 0 && ` • ${Math.round(item.confidence * 100)}% confidence`}
            </Text>
            {item.status === 'failed' && item.errorMessage && (
              <Text className="text-red-500 text-xs mt-1" numberOfLines={1}>
                {item.errorMessage}
              </Text>
            )}
          </View>
          <View className="items-end">
            <Text className="text-gray-400 text-sm">{formatDate(item.createdAt)}</Text>
            <Text className="text-gray-300 text-xs">{formatTime(item.createdAt)}</Text>
            <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  ), [handleRecordPress, handleDelete]);

  const renderEmpty = () => (
    <View className="flex-1 items-center justify-center px-6 py-12">
      <View className="w-20 h-20 rounded-full bg-gray-100 items-center justify-center mb-4">
        <Ionicons
          name={activeTab === 'drafts' ? 'document-outline' : 'time-outline'}
          size={40}
          color="#9ca3af"
        />
      </View>
      <Text className="text-xl font-semibold text-gray-900 mb-2">
        {activeTab === 'drafts' ? 'No Drafts' : 'No History Yet'}
      </Text>
      <Text className="text-gray-500 text-center">
        {activeTab === 'drafts'
          ? 'Scans that haven\'t been uploaded will appear here'
          : 'Your uploaded scans will appear here'}
      </Text>
    </View>
  );

  const renderFooter = () => {
    if (!hasMore || records.length === 0) return null;
    return (
      <View className="py-4 items-center">
        <ActivityIndicator size="small" color="#2563eb" />
      </View>
    );
  };

  const TabButton = ({ tab, label, count }: { tab: HistoryTab; label: string; count: number }) => (
    <TouchableOpacity
      onPress={() => setActiveTab(tab)}
      className={`flex-1 py-3 px-4 rounded-lg ${
        activeTab === tab ? 'bg-blue-600' : 'bg-gray-100'
      }`}
    >
      <Text className={`text-center font-medium ${
        activeTab === tab ? 'text-white' : 'text-gray-600'
      }`}>
        {label} {count > 0 && `(${count})`}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-gray-50">
      {/* Search Bar */}
      <View className="px-4 pt-4 pb-2">
        <View className="flex-row items-center bg-white rounded-xl px-4 py-3 border border-gray-200">
          <Ionicons name="search-outline" size={20} color="#9ca3af" />
          <TextInput
            className="flex-1 ml-3 text-base text-gray-900"
            placeholder="Search records..."
            placeholderTextColor="#9ca3af"
            value={localSearch}
            onChangeText={setLocalSearch}
            returnKeyType="search"
          />
          {localSearch.length > 0 && (
            <TouchableOpacity onPress={() => setLocalSearch('')}>
              <Ionicons name="close-circle" size={20} color="#9ca3af" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Tabs */}
      <View className="px-4 pb-4">
        <View className="flex-row gap-2">
          <TabButton tab="completed" label="Uploaded" count={completedRecords.length} />
          <TabButton tab="drafts" label="Drafts" count={draftRecords.length} />
        </View>
      </View>

      {/* Error Display */}
      {error && (
        <View className="mx-4 mb-4 p-4 bg-red-50 rounded-xl">
          <Text className="text-red-600">{error}</Text>
        </View>
      )}

      {/* Records List */}
      <FlatList
        data={records}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{
          padding: 16,
          paddingTop: 0,
          flexGrow: records.length === 0 ? 1 : undefined,
        }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={!isLoading ? renderEmpty : null}
        ListFooterComponent={renderFooter}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={refresh} />
        }
        onEndReached={fetchMore}
        onEndReachedThreshold={0.5}
      />

      {/* Long press hint */}
      {records.length > 0 && (
        <View className="absolute bottom-4 left-4 right-4">
          <Text className="text-center text-gray-400 text-xs">
            Long press to delete • Tap to {activeTab === 'drafts' ? 'continue editing' : 'view details'}
          </Text>
        </View>
      )}
    </View>
  );
}
