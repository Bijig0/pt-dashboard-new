import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { zustandStorage, STORAGE_KEYS } from '../lib/storage';
import {
  ScanRecord,
  getScanRecords,
  getDrafts,
  getCompletedRecords,
  deleteScanRecord,
  createScanRecord,
  updateScanRecord,
  CreateScanRecordInput,
  UpdateScanRecordInput,
} from '../lib/scanRecordService';
import { useAuthStore } from './authStore';

export type HistoryTab = 'completed' | 'drafts';

interface HistoryState {
  // Data
  completedRecords: ScanRecord[];
  draftRecords: ScanRecord[];

  // UI State
  activeTab: HistoryTab;
  searchQuery: string;
  isLoading: boolean;
  error: string | null;

  // Pagination
  hasMore: boolean;
  offset: number;
}

interface HistoryActions {
  // Tab management
  setActiveTab: (tab: HistoryTab) => void;
  setSearchQuery: (query: string) => void;

  // Data fetching
  fetchRecords: () => Promise<void>;
  fetchMore: () => Promise<void>;
  refresh: () => Promise<void>;

  // CRUD operations
  createDraft: (input: CreateScanRecordInput) => Promise<ScanRecord>;
  updateRecord: (id: string, input: UpdateScanRecordInput) => Promise<void>;
  deleteRecord: (id: string) => Promise<void>;

  // Helpers
  getRecordById: (id: string) => ScanRecord | undefined;
  clearError: () => void;
  reset: () => void;
}

type HistoryStore = HistoryState & HistoryActions;

const PAGE_SIZE = 20;

const initialState: HistoryState = {
  completedRecords: [],
  draftRecords: [],
  activeTab: 'completed',
  searchQuery: '',
  isLoading: false,
  error: null,
  hasMore: true,
  offset: 0,
};

export const useHistoryStore = create<HistoryStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      setActiveTab: (tab: HistoryTab) => {
        set({ activeTab: tab, offset: 0, hasMore: true });
        get().fetchRecords();
      },

      setSearchQuery: (query: string) => {
        set({ searchQuery: query, offset: 0, hasMore: true });
        // Debounced fetch would be better, but for now just fetch
        get().fetchRecords();
      },

      fetchRecords: async () => {
        const { activeTab, searchQuery } = get();
        const userId = useAuthStore.getState().user?.id;

        if (!userId) {
          set({ error: 'Not authenticated' });
          return;
        }

        set({ isLoading: true, error: null, offset: 0 });

        try {
          const records = await getScanRecords(userId, {
            status: activeTab === 'completed' ? 'completed' : 'draft',
            limit: PAGE_SIZE,
            search: searchQuery || undefined,
          });

          if (activeTab === 'completed') {
            set({
              completedRecords: records,
              hasMore: records.length >= PAGE_SIZE,
            });
          } else {
            set({
              draftRecords: records,
              hasMore: records.length >= PAGE_SIZE,
            });
          }
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to fetch records',
          });
        } finally {
          set({ isLoading: false });
        }
      },

      fetchMore: async () => {
        const { activeTab, searchQuery, offset, hasMore, isLoading } = get();
        const userId = useAuthStore.getState().user?.id;

        if (!userId || !hasMore || isLoading) return;

        const newOffset = offset + PAGE_SIZE;
        set({ isLoading: true, error: null });

        try {
          const records = await getScanRecords(userId, {
            status: activeTab === 'completed' ? 'completed' : 'draft',
            limit: PAGE_SIZE,
            offset: newOffset,
            search: searchQuery || undefined,
          });

          if (activeTab === 'completed') {
            set((state) => ({
              completedRecords: [...state.completedRecords, ...records],
              hasMore: records.length >= PAGE_SIZE,
              offset: newOffset,
            }));
          } else {
            set((state) => ({
              draftRecords: [...state.draftRecords, ...records],
              hasMore: records.length >= PAGE_SIZE,
              offset: newOffset,
            }));
          }
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to fetch more records',
          });
        } finally {
          set({ isLoading: false });
        }
      },

      refresh: async () => {
        set({ offset: 0, hasMore: true });
        await get().fetchRecords();
      },

      createDraft: async (input: CreateScanRecordInput) => {
        const userId = useAuthStore.getState().user?.id;

        if (!userId) {
          throw new Error('Not authenticated');
        }

        const record = await createScanRecord(userId, {
          ...input,
          status: 'draft',
        });

        set((state) => ({
          draftRecords: [record, ...state.draftRecords],
        }));

        return record;
      },

      updateRecord: async (id: string, input: UpdateScanRecordInput) => {
        const updatedRecord = await updateScanRecord(id, input);

        set((state) => {
          // Update in both lists
          const updateList = (list: ScanRecord[]) =>
            list.map((r) => (r.id === id ? updatedRecord : r));

          // If status changed, move between lists
          if (input.status === 'completed') {
            return {
              draftRecords: state.draftRecords.filter((r) => r.id !== id),
              completedRecords: [updatedRecord, ...state.completedRecords],
            };
          }

          return {
            completedRecords: updateList(state.completedRecords),
            draftRecords: updateList(state.draftRecords),
          };
        });
      },

      deleteRecord: async (id: string) => {
        await deleteScanRecord(id);

        set((state) => ({
          completedRecords: state.completedRecords.filter((r) => r.id !== id),
          draftRecords: state.draftRecords.filter((r) => r.id !== id),
        }));
      },

      getRecordById: (id: string) => {
        const { completedRecords, draftRecords } = get();
        return (
          completedRecords.find((r) => r.id === id) ||
          draftRecords.find((r) => r.id === id)
        );
      },

      clearError: () => set({ error: null }),

      reset: () => set(initialState),
    }),
    {
      name: STORAGE_KEYS.SCAN_HISTORY,
      storage: createJSONStorage(() => zustandStorage),
      partialize: (state) => ({
        // Only persist the records, not UI state
        completedRecords: state.completedRecords,
        draftRecords: state.draftRecords,
      }),
    }
  )
);
