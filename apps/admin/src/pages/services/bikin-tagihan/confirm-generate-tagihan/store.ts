import { create } from "zustand";
import { AlatData } from "./confirm-generate-tagihan-modal/modal-body/modal-body";

type Store = {
  allHargas: Record<string, AlatData>;
  updateAllHargas: (newData: Record<string, AlatData>) => void;
  updateHargaHarian: ({
    alatName,
    hargaHarian,
  }: {
    alatName: string;
    hargaHarian: number;
  }) => void;
  resetStore: () => void;
};

export const useGenerateTagihanStore = create<Store>((set, get) => ({
  allHargas: {},
  updateAllHargas: (newData: Record<string, AlatData>) =>
    set((state) => ({
      allHargas: { ...state.allHargas, ...newData },
    })),
  updateHargaHarian: ({ alatName, hargaHarian }) =>
    set((state) => {
      if (!(alatName in state.allHargas)) {
        throw new Error(`Alat with name ${alatName} not found in allHargas`);
      }
      return {
        allHargas: {
          ...state.allHargas,
          [alatName]: {
            ...state.allHargas[alatName],
            hargaHarian: hargaHarian,
          } as AlatData,
        },
      };
    }),
  resetStore: () => set({ allHargas: {} }),
}));
