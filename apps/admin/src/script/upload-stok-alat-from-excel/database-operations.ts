import { supabase } from "./supabase-client";
import { StokAlat } from "./types";

export const getCompanyNames = async (): Promise<string[]> => {
  const { data, error } = await supabase
    .from("company")
    .select("name");

  if (error) {
    throw new Error(
      `Failed to fetch company names from database: ${error.message}`
    );
  }

  return data.map((row) => row.name);
};

export const upsertCompanyNames = async (
  companies: string[]
): Promise<void> => {
  if (companies.length === 0) return;

  const uniqueCompanies = [...new Set(companies)];
  const toInsert = uniqueCompanies.map((name) => ({
    name,
  }));

  console.log(`   Upserting ${uniqueCompanies.length} company names...`);

  const { error } = await supabase.from("company").upsert(toInsert);

  if (error) {
    throw new Error(`Failed to upsert company names: ${error.message}`);
  }

  console.log(`   ✅ Upserted ${uniqueCompanies.length} company names`);
};

export const upsertAlatNames = async (
  alatNames: string[],
  companies: string[]
): Promise<void> => {
  if (alatNames.length === 0) return;

  const uniqueAlatNames = [...new Set(alatNames)];
  const toInsert: Array<{ name: string; company: string; harga: number }> = [];

  // Create alat records for each alat-company combination
  for (const alatName of uniqueAlatNames) {
    for (const company of companies) {
      toInsert.push({
        name: alatName,
        company,
        harga: -1, // Placeholder price
      });
    }
  }

  console.log(`   Upserting ${toInsert.length} alat records...`);

  const { error } = await supabase.from("alat").upsert(toInsert);

  if (error) {
    throw new Error(`Failed to upsert alat names: ${error.message}`);
  }

  console.log(`   ✅ Upserted ${toInsert.length} alat records`);
};

export const upsertStokAlatRecords = async (
  records: StokAlat[]
): Promise<number> => {
  if (records.length === 0) return 0;

  console.log(`   Upserting ${records.length} stok alat records...`);

  const { error, count } = await supabase.from("record").upsert(records);

  if (error) {
    throw new Error(`Failed to upsert stok alat records: ${error.message}`);
  }

  console.log(`   ✅ Upserted ${records.length} stok alat records`);

  return records.length;
};

export const clearStokAlatData = async (): Promise<void> => {
  console.log("   Clearing existing record data...");

  const { error } = await supabase.from("record").delete().neq("id", 0);

  if (error) {
    throw new Error(`Failed to clear record data: ${error.message}`);
  }

  console.log("   ✅ Cleared existing record data");
};
