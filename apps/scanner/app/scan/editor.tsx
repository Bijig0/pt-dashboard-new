import React, { useEffect, useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  Modal,
} from 'react-native';
import { router, Stack, Redirect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { Button, Card, Alert as AlertComponent } from '../../components/ui';
import { RecordTable, StatsCard, RecordRow, ValidationResults } from '../../components/table';
import { UploadPreviewModal } from '../../components/UploadPreviewModal';
import { ValidationSummaryModal } from '../../components/ValidationSummaryModal';
import { ChatBottomSheet } from '../../components/chat';
import { useScanStore, useTableStore, useAuthStore, useDevStore, useChatStore } from '../../store';
import { useExport, useAIChat, useNameValidation } from '../../hooks';
import { useRecordUpload } from '../../hooks/useRecordUpload';
import { isCompleted } from '../../types/ocr';
import { calculateAverageConfidence } from '../../utils/tableParser';
import { ExportFormat } from '../../utils/export';

export default function EditorScreen() {
  const { scanState, selectedImageUri, reset: resetScan } = useScanStore();
  const {
    currentTable,
    setTable,
    reset: resetTable,
  } = useTableStore();
  const { user } = useAuthStore();
  const { enableUpload } = useDevStore();
  const { upload, isUploading: recordUploadPending, lastResult: uploadResult, reset: resetUpload } = useRecordUpload();
  const exportMutation = useExport();
  const { validateRecords, refreshIfStale } = useNameValidation();

  const [showImagePreview, setShowImagePreview] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showUploadPreview, setShowUploadPreview] = useState(false);
  const [showValidationModal, setShowValidationModal] = useState(false);
  const [isMockUploading, setIsMockUploading] = useState(false);
  const [editedRecords, setEditedRecords] = useState<RecordRow[]>([]);
  const [validationResults, setValidationResults] = useState<ValidationResults | null>(null);
  const [recordsHistory, setRecordsHistory] = useState<RecordRow[][]>([]);
  const [pendingUploadAfterValidation, setPendingUploadAfterValidation] = useState(false);

  // Refresh validation data on mount
  useEffect(() => {
    refreshIfStale();
  }, [refreshIfStale]);

  // Full validation summary for upload blocking
  const uploadValidation = useMemo(() => {
    if (editedRecords.length === 0) return null;
    return validateRecords(editedRecords);
  }, [editedRecords, validateRecords]);

  // AI Chat hook
  const aiChat = useAIChat({
    records: editedRecords,
    onRecordsChange: setEditedRecords,
    recordsHistory,
    setRecordsHistory,
  });

  const isUploading = recordUploadPending || isMockUploading;
  const uploadSuccess = uploadResult?.success === true;
  const isExporting = exportMutation.isPending;

  // Initialize table from OCR result
  useEffect(() => {
    if (isCompleted(scanState)) {
      setTable(scanState.result.tableData);
    }
  }, [scanState]);

  // Clear upload success after showing
  useEffect(() => {
    if (uploadSuccess) {
      setShowUploadPreview(false);
      const timer = setTimeout(() => {
        resetUpload();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [uploadSuccess]);

  const handleUploadPress = () => {
    if (!currentTable || editedRecords.length === 0) return;

    // Check if validation has issues
    if (uploadValidation && !uploadValidation.isAllValid) {
      // Show validation modal first - user must fix issues before upload
      setPendingUploadAfterValidation(true);
      setShowValidationModal(true);
    } else {
      // No issues, proceed directly to upload preview
      setShowUploadPreview(true);
    }
  };

  const handleConfirmUpload = async () => {
    if (!currentTable || editedRecords.length === 0) return;

    if (!enableUpload) {
      // Mock mode - just simulate success
      setIsMockUploading(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setIsMockUploading(false);
      setShowUploadPreview(false);
      Alert.alert('Mock Upload', `Upload simulated for ${editedRecords.length} records (Enable Upload is off)`);
      return;
    }

    try {
      // Upload the edited records (including any company name corrections)
      upload(
        { records: editedRecords },
        {
          onSuccess: (result) => {
            if (result.success) {
              Alert.alert('Success', `Uploaded ${result.insertedIds.length} records successfully`);
            } else {
              Alert.alert('Upload Failed', result.error ?? 'Unknown error');
            }
          },
          onError: (error) => {
            Alert.alert('Upload Failed', error.message || 'Failed to upload records. Please try again.');
          },
        }
      );
    } catch (error) {
      Alert.alert('Upload Failed', 'Failed to upload records. Please try again.');
    }
  };

  const handleExport = (format: ExportFormat) => {
    if (!currentTable) return;

    setShowExportMenu(false);
    exportMutation.mutate(
      { tableData: currentTable, format },
      {
        onError: () => {
          Alert.alert('Export Failed', 'Failed to export table. Please try again.');
        },
      }
    );
  };

  const handleScanNew = () => {
    Alert.alert(
      'Scan New Document',
      'Are you sure you want to scan a new document? Current changes will be lost.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Scan New',
          onPress: () => {
            resetScan();
            resetTable();
            aiChat.clearChat();
            setRecordsHistory([]);
            router.replace('/(tabs)');
          },
        },
      ]
    );
  };

  // Handle applying corrections from validation modal
  const handleApplyCorrections = (corrections: Map<string, string>) => {
    setShowValidationModal(false);

    if (corrections.size === 0) {
      // No corrections needed - if we were pending upload, proceed directly
      if (pendingUploadAfterValidation) {
        setPendingUploadAfterValidation(false);
        setShowUploadPreview(true);
      }
      return;
    }

    // Apply corrections to records
    const updatedRecords = editedRecords.map(record => {
      let updated = { ...record };

      // Check if company name needs correction
      const companyCorrection = corrections.get(`company-${record.companyName}`);
      if (companyCorrection) {
        updated.companyName = companyCorrection;
      }

      // Check if alat name needs correction
      const alatCorrection = corrections.get(`alat-${record.alatName}`);
      if (alatCorrection) {
        updated.alatName = alatCorrection;
      }

      return updated;
    });

    setEditedRecords(updatedRecords);

    // If we were pending upload after validation, proceed to upload preview
    if (pendingUploadAfterValidation) {
      setPendingUploadAfterValidation(false);
      // Show success briefly, then open upload preview
      Alert.alert('Corrections Applied', `Applied ${corrections.size} correction(s). Proceeding to upload.`, [
        { text: 'OK', onPress: () => setShowUploadPreview(true) }
      ]);
    } else {
      Alert.alert('Success', `Applied ${corrections.size} correction(s)`);
    }
  };

  // Redirect to home if no table data is available (protects against direct URL access)
  if (!currentTable) {
    return <Redirect href="/(tabs)" />;
  }

  const confidence = calculateAverageConfidence(currentTable);

  return (
    <>
      <Stack.Screen
        options={{
          headerRight: () => (
            <View className="flex-row items-center">
              {/* Undo button */}
              {aiChat.canUndo && (
                <TouchableOpacity
                  onPress={aiChat.undo}
                  className="mr-4"
                >
                  <Ionicons name="arrow-undo" size={24} color="#6b7280" />
                </TouchableOpacity>
              )}
              {/* Export button */}
              <TouchableOpacity
                onPress={() => setShowExportMenu(true)}
                className="mr-4"
              >
                <Ionicons name="share-outline" size={24} color="#2563eb" />
              </TouchableOpacity>
            </View>
          ),
        }}
      />

      <ScrollView className="flex-1 bg-gray-50" contentContainerStyle={{ paddingBottom: 80 }}>
        <View className="p-4">
          {/* Success Alert */}
          {uploadSuccess && (
            <AlertComponent
              type="success"
              message="Table uploaded successfully!"
              className="mb-4"
            />
          )}

          {/* Stats Card */}
          <StatsCard
            rows={currentTable.rows}
            columns={currentTable.columns}
            confidence={confidence}
          />

          {/* Image Preview */}
          {selectedImageUri && (
            <TouchableOpacity
              onPress={() => setShowImagePreview(true)}
              activeOpacity={0.8}
            >
              <Card className="mb-4">
                <View className="flex-row items-center mb-3">
                  <Ionicons name="image-outline" size={20} color="#6b7280" />
                  <Text className="text-gray-500 ml-2">Original Image</Text>
                  <View className="flex-1" />
                  <Text className="text-blue-600 text-sm">Tap to enlarge</Text>
                </View>
                <Image
                  source={{ uri: selectedImageUri }}
                  className="w-full h-32 rounded-lg"
                  resizeMode="cover"
                />
              </Card>
            </TouchableOpacity>
          )}

          {/* Editable Table */}
          <Card className="mb-4">
            <Text className="text-lg font-semibold text-gray-900 mb-3">
              Extracted Data
            </Text>
            <RecordTable
              tableData={currentTable}
              records={editedRecords.length > 0 ? editedRecords : undefined}
              onDataChange={setEditedRecords}
              onValidationChange={setValidationResults}
            />
            <Text className="text-xs text-gray-400 mt-3">
              Tap a cell to edit. Use actions to duplicate or delete rows.
            </Text>
          </Card>

          {/* Action Buttons */}
          <View className="space-y-3">
            <Button
              title="Upload To Database"
              onPress={handleUploadPress}
              isLoading={isUploading}
              icon={<Ionicons name="server-outline" size={20} color="#fff" />}
              className="mb-3"
            />

            <Button
              title="Scan New Document"
              variant="outline"
              onPress={handleScanNew}
              icon={<Ionicons name="scan-outline" size={20} color="#2563eb" />}
            />
          </View>
        </View>
      </ScrollView>

      {/* Image Preview Modal */}
      <Modal
        visible={showImagePreview}
        transparent
        animationType="fade"
        onRequestClose={() => setShowImagePreview(false)}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => setShowImagePreview(false)}
          className="flex-1 bg-black/90 items-center justify-center"
        >
          <TouchableOpacity
            onPress={() => setShowImagePreview(false)}
            className="absolute top-12 right-4 p-2"
          >
            <Ionicons name="close" size={32} color="#fff" />
          </TouchableOpacity>
          {selectedImageUri && (
            <Image
              source={{ uri: selectedImageUri }}
              className="w-full h-3/4"
              resizeMode="contain"
            />
          )}
        </TouchableOpacity>
      </Modal>

      {/* Export Menu Modal */}
      <Modal
        visible={showExportMenu}
        transparent
        animationType="slide"
        onRequestClose={() => setShowExportMenu(false)}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => setShowExportMenu(false)}
          className="flex-1 justify-end bg-black/50"
        >
          <View className="bg-white rounded-t-3xl p-6">
            <Text className="text-xl font-bold text-gray-900 mb-4">
              Export Table
            </Text>

            <TouchableOpacity
              onPress={() => handleExport('json')}
              className="flex-row items-center py-4 border-b border-gray-100"
            >
              <View className="w-12 h-12 rounded-xl bg-blue-100 items-center justify-center">
                <Ionicons name="code-outline" size={24} color="#2563eb" />
              </View>
              <View className="ml-4">
                <Text className="text-lg font-medium text-gray-900">JSON</Text>
                <Text className="text-gray-500">Structured data format</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => handleExport('csv')}
              className="flex-row items-center py-4"
            >
              <View className="w-12 h-12 rounded-xl bg-green-100 items-center justify-center">
                <Ionicons name="document-text-outline" size={24} color="#16a34a" />
              </View>
              <View className="ml-4">
                <Text className="text-lg font-medium text-gray-900">CSV</Text>
                <Text className="text-gray-500">Spreadsheet compatible</Text>
              </View>
            </TouchableOpacity>

            <Button
              title="Cancel"
              variant="secondary"
              onPress={() => setShowExportMenu(false)}
              className="mt-4"
            />
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Upload Preview Modal */}
      <UploadPreviewModal
        visible={showUploadPreview}
        onClose={() => setShowUploadPreview(false)}
        onConfirm={handleConfirmUpload}
        tableData={currentTable}
        isUploading={isUploading}
        isMockMode={!enableUpload}
      />

      {/* Validation Summary Modal */}
      {uploadValidation && (
        <ValidationSummaryModal
          visible={showValidationModal}
          onClose={() => {
            setShowValidationModal(false);
            setPendingUploadAfterValidation(false);
          }}
          onConfirm={handleApplyCorrections}
          companyResults={uploadValidation.companyResults}
          alatResults={uploadValidation.alatResults}
        />
      )}

      {/* Floating Action Button for Validation */}
      {uploadValidation && !uploadValidation.isAllValid && (
        <TouchableOpacity
          onPress={() => setShowValidationModal(true)}
          style={{
            position: 'absolute',
            bottom: 80, // Raised to make room for chat bottom sheet
            left: 16,
            backgroundColor: uploadValidation.invalidCount > 0 ? '#dc2626' : '#f59e0b',
            borderRadius: 16,
            paddingVertical: 12,
            paddingHorizontal: 16,
            flexDirection: 'row',
            alignItems: 'center',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 4,
            elevation: 5,
          }}
        >
          <Ionicons name={uploadValidation.invalidCount > 0 ? 'alert-circle' : 'warning'} size={20} color="#fff" />
          <Text style={{ color: '#fff', fontWeight: '600', marginLeft: 8 }}>
            {uploadValidation.invalidCount + uploadValidation.warningCount} Issue{(uploadValidation.invalidCount + uploadValidation.warningCount) !== 1 ? 's' : ''}
          </Text>
          <Ionicons name="chevron-forward" size={16} color="#fff" style={{ marginLeft: 4 }} />
        </TouchableOpacity>
      )}

      {/* AI Chat Bottom Sheet */}
      <ChatBottomSheet
        isOpen={aiChat.isOpen}
        onToggle={aiChat.toggleChat}
        messages={aiChat.messages}
        isProcessing={aiChat.isProcessing}
        canUndo={aiChat.canUndo}
        onSend={aiChat.sendMessage}
        onUndo={aiChat.undo}
        onClear={aiChat.clearChat}
        getAffectedCount={aiChat.getAffectedCount}
      />
    </>
  );
}
