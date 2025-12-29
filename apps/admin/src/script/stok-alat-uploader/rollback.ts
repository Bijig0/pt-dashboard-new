/**
 * Stok Alat Rollback - Delete records by batch ID
 *
 * Removes all records uploaded with a specific batch ID.
 *
 * Usage:
 *   npx tsx src/script/stok-alat-uploader/rollback.ts <batchId>
 *
 * Example:
 *   npx tsx src/script/stok-alat-uploader/rollback.ts stokalat2025
 *
 * To list all batches:
 *   npx tsx src/script/stok-alat-uploader/rollback.ts --list
 */
import { deleteByBatchId, getUploadBatches } from "./database-operations";
import {
  authenticateSupabase,
  initSupabase,
  parseEnvironment,
  getEnvLabel,
} from "./supabase-client";

const parseBatchIdArg = (args: string[]): string | null => {
  const nonFlagArgs = args.filter((arg) => !arg.startsWith("--"));
  return nonFlagArgs[0] || null;
};

const main = async () => {
  const args = process.argv.slice(2);
  const env = parseEnvironment(args);
  const batchIdArg = parseBatchIdArg(args);

  initSupabase(env);

  console.log("=".repeat(50));
  console.log("  STOK ALAT ROLLBACK");
  console.log("=".repeat(50));
  console.log(`\nEnvironment: ${getEnvLabel(env)}\n`);

  try {
    // Authenticate
    console.log("Authenticating with Supabase...");
    await authenticateSupabase();
    console.log("   Authenticated successfully\n");

    // List mode
    if (args.includes("--list") || !batchIdArg) {
      console.log("Fetching upload batches...\n");
      const batches = await getUploadBatches();

      if (batches.length === 0) {
        console.log("No upload batches found in the database.");
        return;
      }

      console.log("Upload batches:");
      console.log("─".repeat(40));
      for (const batch of batches) {
        console.log(`   ${batch.batchId}: ${batch.count} records`);
      }
      console.log("─".repeat(40));
      console.log(`\nTo rollback a batch, run:`);
      console.log(`   npx tsx src/script/stok-alat-uploader/rollback.ts <batchId> --dev|--prod`);
      return;
    }

    // Rollback mode
    const batchId = batchIdArg;
    console.log(`Rolling back batch: ${batchId}\n`);

    const deletedCount = await deleteByBatchId(batchId);

    console.log("\n" + "=".repeat(50));
    console.log("  ROLLBACK COMPLETE!");
    console.log("=".repeat(50));
    console.log(`   Batch ID: ${batchId}`);
    console.log(`   Records deleted: ${deletedCount}`);
  } catch (error) {
    console.error(
      "\nRollback failed:",
      error instanceof Error ? error.message : String(error)
    );
    process.exit(1);
  }
};

main();
