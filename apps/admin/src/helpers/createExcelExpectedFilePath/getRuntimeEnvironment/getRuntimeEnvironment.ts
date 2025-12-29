export function isRunningInBun(): boolean {
  return Boolean(
    // @ts-ignore
    typeof process !== "undefined" && process.versions && process.versions.bun
  );
}

function isRunningInVitest(): boolean {
  return Boolean(
    // @ts-ignore
    typeof process !== "undefined" && process.env.VITEST !== undefined
  );
}

export function getRuntimeEnvironment(): "bun" | "vitest" | "unknown" {
  if (isRunningInBun()) {
    return "bun";
  } else if (isRunningInVitest()) {
    return "vitest";
  } else {
    return "unknown";
  }
}

// @ts-ignore
if (import.meta.main) {
  const runTimeEnvironment = getRuntimeEnvironment();
  console.log({ runTimeEnvironment });
}
