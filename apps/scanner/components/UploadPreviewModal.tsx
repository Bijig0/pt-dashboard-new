import React from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TableData } from '../types/table';
import { Button } from './ui';
import { SpreadsheetPreview } from './SpreadsheetPreview';

interface UploadPreviewModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  tableData: TableData | null;
  isUploading: boolean;
  isMockMode?: boolean;
}

export function UploadPreviewModal({
  visible,
  onClose,
  onConfirm,
  tableData,
  isUploading,
  isMockMode = false,
}: UploadPreviewModalProps) {
  if (!tableData) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.5)',
          justifyContent: 'flex-end',
        }}
      >
        <View
          style={{
            backgroundColor: '#fff',
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            maxHeight: '75%',
            flex: 1,
          }}
        >
          {/* Header */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: 16,
              borderBottomWidth: 1,
              borderBottomColor: '#e5e7eb',
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Ionicons name="server-outline" size={24} color="#2563eb" />
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: '600',
                  color: '#111827',
                  marginLeft: 8,
                }}
              >
                Upload Preview
              </Text>
              {isMockMode && (
                <View
                  style={{
                    backgroundColor: '#fbbf24',
                    paddingHorizontal: 8,
                    paddingVertical: 2,
                    borderRadius: 4,
                    marginLeft: 8,
                  }}
                >
                  <Text style={{ fontSize: 10, fontWeight: '600', color: '#78350f' }}>
                    MOCK
                  </Text>
                </View>
              )}
            </View>
            <TouchableOpacity onPress={onClose} disabled={isUploading}>
              <Ionicons name="close" size={24} color="#6b7280" />
            </TouchableOpacity>
          </View>

          {/* Stats */}
          <View
            style={{
              flexDirection: 'row',
              padding: 16,
              backgroundColor: '#f9fafb',
            }}
          >
            <View style={{ flex: 1, alignItems: 'center' }}>
              <Text style={{ fontSize: 24, fontWeight: '700', color: '#2563eb' }}>
                {tableData.rows}
              </Text>
              <Text style={{ fontSize: 12, color: '#6b7280' }}>Rows</Text>
            </View>
            <View style={{ flex: 1, alignItems: 'center' }}>
              <Text style={{ fontSize: 24, fontWeight: '700', color: '#2563eb' }}>
                {tableData.columns}
              </Text>
              <Text style={{ fontSize: 12, color: '#6b7280' }}>Columns</Text>
            </View>
            <View style={{ flex: 1, alignItems: 'center' }}>
              <Text style={{ fontSize: 24, fontWeight: '700', color: '#2563eb' }}>
                {tableData.cells.length}
              </Text>
              <Text style={{ fontSize: 12, color: '#6b7280' }}>Cells</Text>
            </View>
          </View>

          {/* Spreadsheet Preview */}
          <View style={{ padding: 16, flex: 1 }}>
            <SpreadsheetPreview tableData={tableData} />
          </View>

          {/* Actions */}
          <View style={{ padding: 16, gap: 12 }}>
            <Button
              title={isUploading ? 'Uploading...' : 'Confirm Upload'}
              onPress={onConfirm}
              disabled={isUploading}
              icon={
                isUploading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Ionicons name="cloud-upload" size={20} color="#fff" />
                )
              }
            />
            <Button
              title="Cancel"
              variant="secondary"
              onPress={onClose}
              disabled={isUploading}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}
