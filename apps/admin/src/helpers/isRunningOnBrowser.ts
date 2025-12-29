const isRunningOnBrowser = typeof window !== "undefined";

const isRunningOnServer = !isRunningOnBrowser;

const isJestRunningTheCode = process.env["JEST_WORKER_ID"] !== undefined;

const isUserRunningTheCode = !isJestRunningTheCode;

export const isMainModule = isRunningOnServer && isUserRunningTheCode;
