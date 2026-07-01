import { expect, type APIRequestContext, type Page } from "@playwright/test";

export const backendUrl = process.env.E2E_BACKEND_URL || "http://localhost:4000";
export const authStoreKey = "rentcity.auth.session";
export const appStoreKey = "rentcity.production.state";

export type AuthSession = {
  accessToken: string;
  refreshToken: string;
  refreshExpiresAt: string;
  tokenType: string;
  user: {
    id: string;
    phone: string;
    role: string;
    fullName?: string | null;
  };
};

type ApiEnvelope<T> = {
  data: T;
};

export function uniqueVietnamPhone(prefix = "+8491"): string {
  const suffix = String(Date.now()).slice(-7);
  return `${prefix}${suffix}`;
}

export async function unwrapJson<T>(response: Awaited<ReturnType<APIRequestContext["get"]>>): Promise<T> {
  expect(response.ok(), await response.text()).toBeTruthy();
  const payload = (await response.json()) as ApiEnvelope<T>;
  return payload.data;
}

export async function loginByOtp(request: APIRequestContext, phone: string): Promise<AuthSession> {
  const otpResponse = await request.post(`${backendUrl}/auth/otp/request`, { data: { phone } });
  const otp = await unwrapJson<{ devCode?: string }>(otpResponse);
  expect(otp.devCode, `Backend must return devCode outside production for ${phone}`).toMatch(/^\d{6}$/);

  const authResponse = await request.post(`${backendUrl}/auth/otp/verify`, {
    data: { phone, code: otp.devCode }
  });
  return unwrapJson<AuthSession>(authResponse);
}

export function authHeaders(session: AuthSession): Record<string, string> {
  return {
    Authorization: `${session.tokenType || "Bearer"} ${session.accessToken}`
  };
}

export async function installSession(page: Page, session: AuthSession): Promise<void> {
  await page.goto("/");
  await page.evaluate(
    ({ authKey, stateKey, auth }) => {
      window.localStorage.clear();
      window.sessionStorage.clear();
      window.localStorage.setItem(authKey, JSON.stringify(auth));
      window.localStorage.removeItem(stateKey);
    },
    { authKey: authStoreKey, stateKey: appStoreKey, auth: session }
  );
}

export async function resetClientState(page: Page): Promise<void> {
  await page.goto("/");
  await page.evaluate(() => {
    window.localStorage.clear();
    window.sessionStorage.clear();
  });
}
