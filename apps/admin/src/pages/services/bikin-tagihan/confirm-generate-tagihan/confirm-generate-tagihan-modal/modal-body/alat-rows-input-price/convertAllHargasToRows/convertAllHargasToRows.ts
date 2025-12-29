import { AlatData } from "../../modal-body";

export const convertAllHargasToRows = (
  allHargas: Record<string, AlatData>
): AlatData[] => {
  return Object.values(allHargas);
};

