/**
 * Seed Test Data Script
 *
 * This script seeds the test database with sample stok_alat data
 * for E2E testing.
 *
 * Run this script before running E2E tests to ensure test data exists.
 *
 * Usage:
 *   npx tsx src/pages/services/first-one/grid/__tests__/scripts/seed-test-data.ts
 */

import { createClient } from '@supabase/supabase-js';
import dayjs from 'dayjs';

// Test database credentials (from .env.test)
const SUPABASE_URL = 'https://lkxwausyseuiizopsrwi.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxreHdhdXN5c2V1aWl6b3BzcndpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDQ2Nzg0MDQsImV4cCI6MjAyMDI1NDQwNH0.qRzHq2F1qqky8Q-CoFdkr6VBFm48ra3aRo6oZu4vvnQ';

const TEST_USER_EMAIL = 'test@example.com';
const TEST_USER_PASSWORD = '12345678';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function seedTestData() {
  console.log('🌱 Starting test data seeding...');

  // Step 1: Authenticate as test user
  console.log('1️⃣  Authenticating as test user...');
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email: TEST_USER_EMAIL,
    password: TEST_USER_PASSWORD,
  });

  if (authError) {
    console.error('❌ Authentication failed:', authError.message);
    throw authError;
  }

  console.log('✅ Authenticated successfully as:', TEST_USER_EMAIL);

  // Step 2: Ensure test alat_name exists
  console.log('2️⃣  Checking if test alat_name exists...');
  const TEST_ALAT_NAME = 'Test Scaffolding';

  const { data: existingAlat, error: alatCheckError } = await supabase
    .from('alat_names')
    .select('alat_name')
    .eq('alat_name', TEST_ALAT_NAME)
    .single();

  if (alatCheckError && alatCheckError.code !== 'PGRST116') {
    // PGRST116 is "not found" error, which is fine
    console.error('❌ Error checking alat_name:', alatCheckError.message);
    throw alatCheckError;
  }

  if (!existingAlat) {
    console.log('   Creating test alat_name...');
    const { error: insertAlatError } = await supabase
      .from('alat_names')
      .insert({ alat_name: TEST_ALAT_NAME });

    if (insertAlatError) {
      console.error('❌ Error creating alat_name:', insertAlatError.message);
      throw insertAlatError;
    }
    console.log('✅ Test alat_name created');
  } else {
    console.log('✅ Test alat_name already exists');
  }

  // Step 3: Ensure test company_name exists
  console.log('3️⃣  Checking if test company_name exists...');
  const TEST_COMPANY_NAME = 'Test Construction Company';

  const { data: existingCompany, error: companyCheckError } = await supabase
    .from('company_names')
    .select('company_name')
    .eq('company_name', TEST_COMPANY_NAME)
    .single();

  if (companyCheckError && companyCheckError.code !== 'PGRST116') {
    console.error('❌ Error checking company_name:', companyCheckError.message);
    throw companyCheckError;
  }

  if (!existingCompany) {
    console.log('   Creating test company_name...');
    const { error: insertCompanyError } = await supabase
      .from('company_names')
      .insert({ company_name: TEST_COMPANY_NAME });

    if (insertCompanyError) {
      console.error('❌ Error creating company_name:', insertCompanyError.message);
      throw insertCompanyError;
    }
    console.log('✅ Test company_name created');
  } else {
    console.log('✅ Test company_name already exists');
  }

  // Step 4: Clear existing test data
  console.log('4️⃣  Clearing existing test data...');
  const { error: deleteError } = await supabase
    .from('stok_alat')
    .delete()
    .eq('alat_name', TEST_ALAT_NAME);

  if (deleteError) {
    console.error('❌ Error clearing test data:', deleteError.message);
    throw deleteError;
  }
  console.log('✅ Existing test data cleared');

  // Step 5: Insert test stok_alat records
  console.log('5️⃣  Inserting test stok_alat records...');

  // Create test data for the current month
  const today = dayjs();
  const currentMonthStart = today.startOf('month');

  const testRecords = [
    {
      alat_name: TEST_ALAT_NAME,
      company_name: TEST_COMPANY_NAME,
      tanggal: currentMonthStart.format('YYYY-MM-DD'),
      masuk: 10,
      keluar: 0,
    },
    {
      alat_name: TEST_ALAT_NAME,
      company_name: TEST_COMPANY_NAME,
      tanggal: currentMonthStart.add(5, 'days').format('YYYY-MM-DD'),
      masuk: 5,
      keluar: 2,
    },
    {
      alat_name: TEST_ALAT_NAME,
      company_name: TEST_COMPANY_NAME,
      tanggal: currentMonthStart.add(10, 'days').format('YYYY-MM-DD'),
      masuk: 0,
      keluar: 3,
    },
  ];

  const { data: insertedRecords, error: insertError } = await supabase
    .from('stok_alat')
    .insert(testRecords)
    .select();

  if (insertError) {
    console.error('❌ Error inserting test records:', insertError.message);
    throw insertError;
  }

  console.log('✅ Inserted test records:', insertedRecords?.length);

  // Step 6: Verify data was inserted
  console.log('6️⃣  Verifying test data...');
  const { data: verifyData, error: verifyError } = await supabase
    .from('stok_alat')
    .select('*')
    .eq('alat_name', TEST_ALAT_NAME);

  if (verifyError) {
    console.error('❌ Error verifying test data:', verifyError.message);
    throw verifyError;
  }

  console.log('✅ Verification complete. Found records:', verifyData?.length);
  console.log('\n📊 Test data summary:');
  console.log('   Alat Name:', TEST_ALAT_NAME);
  console.log('   Company Name:', TEST_COMPANY_NAME);
  console.log('   Records:', verifyData?.length);

  console.log('\n🎉 Test data seeding completed successfully!');
  console.log('\n💡 You can now run E2E tests:');
  console.log('   Headless: npm run test:e2e');
  console.log('   Headed:   npm run test:e2e:headed');
}

// Run the seeding
seedTestData().catch((error) => {
  console.error('💥 Seeding failed:', error);
  process.exit(1);
});
