import { afterEach, beforeEach, vi } from "bun:test";

beforeEach(() => {
  // Clear all mocks before each test
  vi.clearAllMocks();
});

afterEach(() => {
  // Reset all mocks after each test
  vi.resetAllMocks();
});
