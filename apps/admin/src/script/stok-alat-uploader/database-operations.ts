import { getSupabase } from "./supabase-client";
import type { StokAlatRecord, StokAlatRecordWithSource } from "./types";

const BATCH_SIZE = 1000;

export const getCompanyNames = async (): Promise<string[]> => {
  const { data, error } = await getSupabase().from("company").select("name");

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
  const toInsert = uniqueCompanies.map((name) => ({ name }));

  console.log(`   Upserting ${uniqueCompanies.length} company names...`);

  const { error } = await getSupabase().from("company").upsert(toInsert);

  if (error) {
    throw new Error(`Failed to upsert company names: ${error.message}`);
  }

  console.log(`   Upserted ${uniqueCompanies.length} company names`);
};

export const insertStokAlatRecords = async (
  records: StokAlatRecordWithSource[]
): Promise<number> => {
  if (records.length === 0) return 0;

  console.log(`   Inserting ${records.length} stok alat records...`);

  let insertedCount = 0;

  for (let i = 0; i < records.length; i += BATCH_SIZE) {
    const batchWithSource = records.slice(i, i + BATCH_SIZE);

    const batch: StokAlatRecord[] = batchWithSource.map(
      ({ _sourceFile, _sourceLine, ...record }) => record
    );

    const { error } = await getSupabase().from("record").insert(batch);

    if (error) {
      const batchNumber = Math.floor(i / BATCH_SIZE) + 1;
      console.error(`\n   Error in batch ${batchNumber}: ${error.message}`);

      const problematicRecords = batchWithSource.filter(
        (r) => r.masuk !== null && r.masuk !== 0 && r.keluar !== null && r.keluar !== 0
      );

      if (problematicRecords.length > 0) {
        console.error(`\n   Found ${problematicRecords.length} records with both masuk AND keluar non-zero:`);
        for (const record of problematicRecords) {
          console.error(`   - File: ${record._sourceFile}, Line: ${record._sourceLine}`);
          console.error(`     alat: ${record.alat_name}, company: ${record.company_name}`);
          console.error(`     tanggal: ${record.tanggal}, masuk: ${record.masuk}, keluar: ${record.keluar}`);
        }
      }

      throw new Error(
        `Failed to insert stok alat records (batch ${batchNumber}): ${error.message}`
      );
    }

    insertedCount += batch.length;
    console.log(
      `   Inserted batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(records.length / BATCH_SIZE)} (${insertedCount}/${records.length})`
    );
  }

  console.log(`   Inserted ${insertedCount} stok alat records`);

  return insertedCount;
};

export const deleteByBatchId = async (batchId: string): Promise<number> => {
  console.log(`   Deleting records with batch ID: ${batchId}...`);

  const { count, error } = await getSupabase()
    .from("record")
    .delete({ count: "exact" })
    .eq("upload_batch_id", batchId);

  if (error) {
    throw new Error(`Failed to delete records: ${error.message}`);
  }

  const deletedCount = count ?? 0;
  console.log(`   Deleted ${deletedCount} records`);

  return deletedCount;
};

export const getUploadBatches = async (): Promise<
  { batchId: string; count: number }[]
> => {
  const { data, error } = await getSupabase()
    .from("record")
    .select("upload_batch_id")
    .not("upload_batch_id", "is", null);

  if (error) {
    throw new Error(`Failed to fetch upload batches: ${error.message}`);
  }

  const batchCounts = new Map<string, number>();
  for (const row of data) {
    const batchId = row.upload_batch_id as string;
    batchCounts.set(batchId, (batchCounts.get(batchId) ?? 0) + 1);
  }

  return Array.from(batchCounts.entries()).map(([batchId, count]) => ({
    batchId,
    count,
  }));
};
