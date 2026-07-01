import { expect, test } from "@playwright/test";
import { backendUrl, uniqueVietnamPhone } from "./helpers/api";

const productionSecurityEnabled = process.env.E2E_PRODUCTION_SECURITY === "true";

test.describe("production backend security", () => {
  test.beforeEach(async ({}, testInfo) => {
    test.skip(!productionSecurityEnabled, "Run only in the production security CI job.");
    test.skip(testInfo.project.name !== "desktop", "Run production security checks once on the desktop project.");
  });

  test("sets security headers and only echoes allowed CORS origins", async ({ request }) => {
    const allowed = await request.get(`${backendUrl}/health`, {
      headers: { Origin: "http://localhost:4174" }
    });
    await expect(allowed).toBeOK();

    const allowedHeaders = allowed.headers();
    expect(allowedHeaders["content-security-policy"]).toContain("default-src 'self'");
    expect(allowedHeaders["strict-transport-security"]).toContain("max-age=");
    expect(allowedHeaders["x-content-type-options"]).toBe("nosniff");
    expect(allowedHeaders["x-frame-options"]).toBe("SAMEORIGIN");
    expect(allowedHeaders["cross-origin-resource-policy"]).toBe("cross-origin");
    expect(allowedHeaders["access-control-allow-origin"]).toBe("http://localhost:4174");
    expect(allowedHeaders["access-control-allow-credentials"]).toBe("true");

    const blocked = await request.get(`${backendUrl}/health`, {
      headers: { Origin: "http://evil.example" }
    });
    await expect(blocked).toBeOK();
    expect(blocked.headers()["access-control-allow-origin"]).toBeUndefined();
  });

  test("keeps OpenAPI disabled when running with production defaults", async ({ request }) => {
    const docs = await request.get(`${backendUrl}/api-docs`);
    expect(docs.status(), await docs.text()).toBe(404);

    const docsJson = await request.get(`${backendUrl}/api-docs.json`);
    expect(docsJson.status(), await docsJson.text()).toBe(404);
  });

  test("does not expose OTP dev codes in production", async ({ request }) => {
    const response = await request.post(`${backendUrl}/auth/otp/request`, {
      data: { phone: uniqueVietnamPhone("+8498") }
    });
    await expect(response).toBeOK();

    const payload = (await response.json()) as { data: Record<string, unknown> };
    expect(payload.data).toBeTruthy();
    expect(payload.data.devCode).toBeUndefined();
  });

  test("rejects payment webhooks without a valid signature", async ({ request }) => {
    const payload = {
      reference: "rc_prod_security_missing_signature",
      status: "PAID",
      amount: 1000000,
      provider: "local",
      eventId: "prod-security-signature-check"
    };

    const missingSignature = await request.post(`${backendUrl}/payments/webhook`, { data: payload });
    expect(missingSignature.status(), await missingSignature.text()).toBe(401);

    const invalidSignature = await request.post(`${backendUrl}/payments/webhook`, {
      headers: { "x-rentcity-signature": "sha256=invalid" },
      data: payload
    });
    expect(invalidSignature.status(), await invalidSignature.text()).toBe(401);
  });
});
