/**
 * Rollback stok alat upload by batch ID
 *
 * Usage:
 *   npx tsx src/script/upload-stok-alat-from-csv/rollback.ts <batchId>
 *
 * Example:
 *   npx tsx src/script/upload-stok-alat-from-csv/rollback.ts stokalat2025
 *
 * To list all batches:
 *   npx tsx src/script/upload-stok-alat-from-csv/rollback.ts --list
 */
import { deleteByBatchId, getUploadBatches } from "./database-operations";
import { authenticateSupabase } from "./supabase-client";

const main = async () => {
  const arg = process.argv[2];

  if (!arg) {
    console.log("Usage:");
    console.log(
      "  npx tsx src/script/upload-stok-alat-from-csv/rollback.ts <batchId>"
    );
    console.log(
      "  npx tsx src/script/upload-stok-alat-from-csv/rollback.ts --list"
    );
    process.exit(1);
  }

  try {
    console.log("Authenticating with Supabase...");
    await authenticateSupabase();
    console.log("Authenticated successfully\n");

    if (arg === "--list") {
      console.log("Fetching upload batches...\n");
      const batches = await getUploadBatches();

      if (batches.length === 0) {
        console.log("No upload batches found.");
        return;
      }

      console.log("Upload batches:");
      for (const batch of batches) {
        console.log(`  - ${batch.batchId}: ${batch.count} records`);
      }
      return;
    }

    const batchId = arg;
    console.log(`Rolling back batch: ${batchId}\n`);

    const deletedCount = await deleteByBatchId(batchId);

    if (deletedCount === 0) {
      console.log(`No records found with batch ID: ${batchId}`);
    } else {
      console.log(`\nRollback complete!`);
      console.log(`   Deleted ${deletedCount} records with batch ID: ${batchId}`);
    }
  } catch (error) {
    console.error(
      "\nRollback failed:",
      error instanceof Error ? error.message : String(error)
    );
    process.exit(1);
  }
};

main();
