import { defineConfig } from "@playwright/test";

export default defineConfig({
  webServer: {
    env: {
      PORT: "3000",
    },
    command: "pnpm run dev",
    port: 3000,
  },
  testDir: "./tests",
});
