import { queryClient } from "../../../../../../../../react-query";
import { supabase } from "../../../../../../../../supabase";
import { AlatData } from "../../modal-body";

type Args = {
  selectedCompanyName: string;
  alatData: AlatData[];
  onComplete: () => void;
};

export const handleConfirmUpdateHargas = async ({
  alatData,
  onComplete,
  selectedCompanyName,
}: Args) => {
  // console.log({ alatData });
  const asSupabaseColumns = alatData.map(
    ({ alatName, hargaBulanan, hargaHarian }) => ({
      name: alatName,
      harga_bulanan: hargaBulanan,
      harga_harian: hargaHarian,
      company: selectedCompanyName,
    })
  );

  console.log({ asSupabaseColumns });

  const { error } = await supabase.from("alat").insert(asSupabaseColumns);

  if (error) throw error;

  queryClient.invalidateQueries({ queryKey: ["companyAlatsDetails"] });

  onComplete();
};
