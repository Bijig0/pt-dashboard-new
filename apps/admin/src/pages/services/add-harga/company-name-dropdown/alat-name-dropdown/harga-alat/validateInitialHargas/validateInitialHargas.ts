import { HargaAlatSchema } from "#src/types/schemas.js";

type Args = {
  harga: HargaAlatSchema;
  selectedAlatName: string;
};

export const validateInitialStokValue = ({ harga, selectedAlatName }: Args) => {
  if (harga.length === 0)
    throw new Error(`No records found when searching for ${selectedAlatName}`);
  if (harga.length > 1)
    throw new Error(
      `More than one record found when searching for ${selectedAlatName}`
    );
  return;
};
