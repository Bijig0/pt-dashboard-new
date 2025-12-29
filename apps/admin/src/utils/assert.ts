class AssertionError extends Error {
  constructor(message: string) {
    super(`Assertion Error: ${message}`);
    this.name = "AssertionError";
    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AssertionError);
    }
  }
}

export function assert(condition: boolean, message?: string): void {
  if (!condition) {
    throw new AssertionError(message ?? "");
  }
}
