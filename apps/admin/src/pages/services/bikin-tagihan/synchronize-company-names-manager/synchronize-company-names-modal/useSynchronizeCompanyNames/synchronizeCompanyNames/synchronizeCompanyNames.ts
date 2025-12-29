import console from "console";
import { supabase } from "../../../../../../../supabase";

type Args = {
  companyNames: string[];
};

export const synchronizeCompanyNames = async ({ companyNames }: Args) => {
  const toInsert = companyNames.map((companyName) => ({
    name: companyName,
  }));

  console.log({ toInsert });

  const { error } = await supabase.from("company").insert(toInsert);

  console.log({ error });

  if (error) throw error;
};
