import React from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { usePushHistory, useUndoPush } from '../hooks/useRecordUpload';
import { PushLogEntry, RecordRow } from '@pt-dashboard/shared';

interface PushHistoryModalProps {
  visible: boolean;
  onClose: () => void;
}

export function PushHistoryModal({ visible, onClose }: PushHistoryModalProps) {
  const { history, isLoading, error, refetch } = usePushHistory();
  const { undo, isUndoing } = useUndoPush();

  const handleUndo = (entry: PushLogEntry) => {
    Alert.alert(
      'Undo Push',
      `Are you sure you want to undo this push?\n\nThis will delete ${entry.records_count} records.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Undo',
          style: 'destructive',
          onPress: () => {
            undo(entry.batch_id, {
              onSuccess: (result) => {
                if (result.success) {
                  Alert.alert('Success', `Deleted ${result.deletedCount} records`);
                  refetch();
                } else {
                  Alert.alert('Error', result.error ?? 'Failed to undo');
                }
              },
              onError: (err) => {
                Alert.alert('Error', err.message);
              },
            });
          },
        },
      ]
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <View style={styles.header}>
            <Text style={styles.title}>Push History</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>

          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#3b82f6" />
              <Text style={styles.loadingText}>Loading history...</Text>
            </View>
          ) : error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>Failed to load history</Text>
              <TouchableOpacity style={styles.retryButton} onPress={() => refetch()}>
                <Text style={styles.retryText}>Retry</Text>
              </TouchableOpacity>
            </View>
          ) : history.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No push history yet</Text>
              <Text style={styles.emptySubtext}>
                Records you push will appear here
              </Text>
            </View>
          ) : (
            <ScrollView style={styles.content}>
              {history.map((entry) => (
                <View
                  key={entry.batch_id}
                  style={[
                    styles.historyCard,
                    entry.rolled_back_at && styles.historyCardUndone,
                  ]}
                >
                  <View style={styles.cardHeader}>
                    <View style={styles.cardInfo}>
                      <Text style={styles.recordCount}>
                        {entry.records_count} records
                      </Text>
                      <Text style={styles.cardDate}>
                        {formatDate(entry.created_at)}
                      </Text>
                    </View>
                    {entry.rolled_back_at ? (
                      <View style={styles.undoneTag}>
                        <Text style={styles.undoneText}>Undone</Text>
                      </View>
                    ) : (
                      <TouchableOpacity
                        style={styles.undoButton}
                        onPress={() => handleUndo(entry)}
                        disabled={isUndoing}
                      >
                        {isUndoing ? (
                          <ActivityIndicator size="small" color="#dc2626" />
                        ) : (
                          <Text style={styles.undoButtonText}>Undo</Text>
                        )}
                      </TouchableOpacity>
                    )}
                  </View>

                  {/* Preview of records */}
                  <View style={styles.recordPreview}>
                    {(entry.records_data as RecordRow[]).slice(0, 3).map((record, i) => (
                      <Text key={i} style={styles.previewText} numberOfLines={1}>
                        {record.date} • {record.companyName} • {record.alatName} •{' '}
                        {record.type === 'kirim' ? '→' : '←'} {record.amount}
                      </Text>
                    ))}
                    {entry.records_count > 3 && (
                      <Text style={styles.moreText}>
                        +{entry.records_count - 3} more
                      </Text>
                    )}
                  </View>
                </View>
              ))}
            </ScrollView>
          )}

          <View style={styles.footer}>
            <TouchableOpacity style={styles.doneButton} onPress={onClose}>
              <Text style={styles.doneButtonText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modal: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '85%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
  closeButton: {
    padding: 8,
  },
  closeText: {
    fontSize: 20,
    color: '#9ca3af',
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    color: '#6b7280',
  },
  errorContainer: {
    padding: 40,
    alignItems: 'center',
  },
  errorText: {
    color: '#dc2626',
    marginBottom: 12,
  },
  retryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
  },
  retryText: {
    color: '#4b5563',
    fontWeight: '500',
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 4,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#9ca3af',
  },
  content: {
    padding: 16,
  },
  historyCard: {
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  historyCardUndone: {
    opacity: 0.6,
    backgroundColor: '#fef2f2',
    borderColor: '#fecaca',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardInfo: {
    flex: 1,
  },
  recordCount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  cardDate: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
  undoButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#fee2e2',
    borderRadius: 6,
  },
  undoButtonText: {
    color: '#dc2626',
    fontWeight: '600',
    fontSize: 13,
  },
  undoneTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#fee2e2',
    borderRadius: 4,
  },
  undoneText: {
    color: '#dc2626',
    fontSize: 12,
    fontWeight: '500',
  },
  recordPreview: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 8,
  },
  previewText: {
    fontSize: 12,
    color: '#4b5563',
    marginBottom: 2,
    fontFamily: 'monospace',
  },
  moreText: {
    fontSize: 12,
    color: '#9ca3af',
    fontStyle: 'italic',
    marginTop: 4,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  doneButton: {
    padding: 14,
    borderRadius: 10,
    backgroundColor: '#3b82f6',
    alignItems: 'center',
  },
  doneButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});
