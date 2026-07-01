import { defineConfig, devices } from "@playwright/test";
import path from "node:path";

const frontendUrl = process.env.E2E_FRONTEND_URL || "http://localhost:4174";
const backendUrl = process.env.E2E_BACKEND_URL || "http://localhost:4000";

export default defineConfig({
  testDir: "./e2e",
  timeout: 45_000,
  expect: {
    timeout: 8_000
  },
  workers: 1,
  fullyParallel: false,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [["list"], ["html", { open: "never" }]] : [["list"], ["html", { open: "never" }]],
  globalSetup: "./e2e/global-setup.ts",
  use: {
    baseURL: frontendUrl,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    extraHTTPHeaders: {
      "x-rentcity-e2e": "true"
    }
  },
  webServer: {
    command: "npm start -- --port 4174",
    cwd: path.join(process.cwd(), "front-end"),
    env: {
      VITE_API_BASE_URL: backendUrl
    },
    url: frontendUrl,
    reuseExistingServer: true,
    timeout: 120_000
  },
  projects: [
    {
      name: "desktop",
      use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 960 } }
    },
    {
      name: "phone",
      use: { ...devices["Pixel 7"], viewport: { width: 412, height: 915 } }
    }
  ]
});
