/// <reference types="vitest" />
/// <reference types="vite/client" />

import { sentryVitePlugin } from "@sentry/vite-plugin";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { nodePolyfills } from "vite-plugin-node-polyfills";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [
    react(),
    nodePolyfills(),
    tsconfigPaths(),
    // Only use Sentry plugin if auth token is available
    process.env.SENTRY_AUTH_TOKEN &&
      sentryVitePlugin({
        org: "swiftqu",
        project: "pt-dashboard",
        authToken: process.env.SENTRY_AUTH_TOKEN,
      }),
  ].filter(Boolean),
  build: {
    sourcemap: true,
    target: "ES2022",
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/setupTests.ts"],
  },
});
