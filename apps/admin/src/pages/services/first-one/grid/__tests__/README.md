# E2E Tests for Grid Masuk/Keluar Editing

This directory contains end-to-end (E2E) tests for the grid's masuk/keluar editing functionality using Puppeteer.

## Overview

The E2E tests verify that:
1. A test user can successfully log in
2. Navigate to the first-one service page
3. Edit masuk and keluar values in the AG Grid
4. Save the changes without errors
5. Verify the changes are persisted

## Test Database

These tests run against the **test database** (not production):
- Database URL: `lkxwausyseuiizopsrwi.supabase.co`
- Test user: `test@example.com` / `12345678`
- Configuration: `.env.test`

## Prerequisites

Before running the tests, ensure:

1. **Test user exists**: The test user `test@example.com` should exist in the test database
2. **Test data is seeded**: Run the seed script to populate test data
3. **Dev server is running**: The app should be running on `http://localhost:5173`

## Quick Start

### 1. Seed Test Data

Before running E2E tests for the first time (or to reset test data):

```bash
npm run test:e2e:seed
```

This will:
- Create a test alat_name: "Test Scaffolding"
- Create a test company_name: "Test Construction Company"
- Insert 3 sample stok_alat records for the current month
- Clear any existing test data

### 2. Start the Development Server

In one terminal, start the dev server with test environment:

```bash
npm run dev
```

The app will run on `http://localhost:5173` using `.env.test` credentials.

### 3. Run the E2E Tests

In another terminal, run the tests:

#### Headless Mode (default, faster)
```bash
npm run test:e2e
```

#### Headed Mode (shows browser, slower, better for debugging)
```bash
npm run test:e2e:headed
```

#### Watch Mode (reruns on file changes)
```bash
npm run test:e2e:watch
```

## Test Structure

### Main Test File
- **`edit-masuk-keluar.e2e.test.ts`**: Contains the E2E test scenarios

### Helper Scripts
- **`scripts/seed-test-data.ts`**: Seeds the test database with sample data

## What the Tests Do

### Test 1: Edit and Save Masuk Value
1. Log in as test user
2. Navigate to `/services/first-one`
3. Wait for AG Grid to load
4. Double-click on the first masuk cell
5. Clear the value and enter a random number (1-100)
6. Press Enter to save
7. Wait for success toast or verify no error occurred
8. Verify the value was updated in the grid

### Test 2: Edit and Save Keluar Value
1. (Assumes still logged in from Test 1)
2. Double-click on the first keluar cell
3. Clear the value and enter a random number (1-50)
4. Press Enter to save
5. Wait for success toast or verify no error occurred
6. Verify the value was updated

## Debugging

### Headed Mode
Run tests with `npm run test:e2e:headed` to see the browser in action. The browser will:
- Open visibly
- Run slightly slower (50ms delay between actions)
- Log console messages from the page
- Stay open on failures

### Console Logs
The test outputs detailed console logs for each step:
```
Step 1: Navigating to login page...
Step 2: Logging in as test user...
Step 3: Waiting for dashboard to load...
...
✅ Test completed successfully!
```

### Common Issues

**Issue**: Test fails with "Could not find masuk cell"
- **Solution**: Ensure the dev server is running and the grid is displaying data

**Issue**: Test fails with "Authentication failed"
- **Solution**: Verify the test user exists in the test database with correct credentials

**Issue**: Test fails with "Save failed - error toast was shown"
- **Solution**: Check the browser console (in headed mode) for database errors

**Issue**: Tests timeout
- **Solution**: Increase the timeout in the test file or ensure your network connection is stable

## Configuration

### Environment Variables

The tests use environment variables to configure behavior:

- **`HEADED`**: Set to `'true'` to run in headed mode
  ```bash
  HEADED=true npm run test:e2e
  ```

- **`VITE_APP_URL`**: Override the base URL (default: `http://localhost:5173`)
  ```bash
  VITE_APP_URL=http://localhost:3000 npm run test:e2e
  ```

### Test Credentials

Test user credentials are defined in the test file:
```typescript
const TEST_USER_EMAIL = 'test@example.com';
const TEST_USER_PASSWORD = '12345678';
```

### Timeouts

Default timeout is 30 seconds. Adjust in the test file if needed:
```typescript
const TIMEOUT = 30000; // 30 seconds
```

## CI/CD Integration

To run these tests in CI/CD:

1. Ensure the test database is accessible
2. Start the dev server in the background
3. Run the tests in headless mode

Example GitHub Actions workflow:
```yaml
- name: Install dependencies
  run: npm ci

- name: Seed test data
  run: npm run test:e2e:seed

- name: Start dev server
  run: npm run dev &
  env:
    NODE_ENV: test

- name: Wait for server
  run: npx wait-on http://localhost:5173

- name: Run E2E tests
  run: npm run test:e2e
```

## Maintenance

### Updating Test Data

To modify the test data structure, edit `scripts/seed-test-data.ts`:

```typescript
const testRecords = [
  {
    alat_name: TEST_ALAT_NAME,
    company_name: TEST_COMPANY_NAME,
    tanggal: currentMonthStart.format('YYYY-MM-DD'),
    masuk: 10,  // Modify these values
    keluar: 0,
  },
  // Add more records...
];
```

Then re-run the seed script:
```bash
npm run test:e2e:seed
```

### Adding New Tests

To add new E2E test scenarios:

1. Open `edit-masuk-keluar.e2e.test.ts`
2. Add a new `it()` block within the `describe()` block
3. Follow the same pattern as existing tests
4. Run tests to verify

Example:
```typescript
it('should handle invalid input gracefully', async () => {
  // Your test logic here
}, TIMEOUT);
```

## Troubleshooting

### View Browser Console in Headed Mode

```bash
npm run test:e2e:headed
```

The browser will open and you can see all console logs, network requests, and errors.

### Check Test Database

To verify test data exists:

1. Log into Supabase dashboard for the test project
2. Navigate to Table Editor > stok_alat
3. Filter by `alat_name = 'Test Scaffolding'`

### Reset Test Data

If tests are failing due to corrupted data:

```bash
npm run test:e2e:seed
```

This will clear and re-seed all test data.

## Resources

- [Puppeteer Documentation](https://pptr.dev/)
- [Vitest Documentation](https://vitest.dev/)
- [AG Grid Documentation](https://www.ag-grid.com/)
- [Supabase Documentation](https://supabase.com/docs)
