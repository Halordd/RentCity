import { request, type FullConfig } from "@playwright/test";

const backendUrl = process.env.E2E_BACKEND_URL || "http://localhost:4000";

export default async function globalSetup(_config: FullConfig) {
  const api = await request.newContext({ baseURL: backendUrl });
  const deadline = Date.now() + 60_000;
  let lastError = "";

  while (Date.now() < deadline) {
    try {
      const response = await api.get("/health/ready", { timeout: 5_000 });
      if (response.ok()) {
        await api.dispose();
        return;
      }
      lastError = `${response.status()} ${await response.text()}`;
    } catch (error) {
      lastError = error instanceof Error ? error.message : String(error);
    }
    await new Promise((resolve) => setTimeout(resolve, 2_000));
  }

  await api.dispose();
  throw new Error(`RentCity backend is not ready at ${backendUrl}. Last error: ${lastError}`);
}
