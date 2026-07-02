import { apiClient } from "../api/apiClient";
import type { RefreshTokenDto, RequestOtpDto, VerifyOtpDto } from "../api/generated";
import { authSessionStore } from "../api/httpClient";
import type { AuthSession, UserProfile } from "../types";

export interface OtpRequestResult {
  phone: string;
  delivery: string;
  provider?: string;
  messageId?: string;
  ttlSeconds: number;
  devCode?: string;
}

export const authService = {
  requestOtp(phone: string): Promise<OtpRequestResult> {
    const body: RequestOtpDto = { phone };
    return apiClient.post<OtpRequestResult>("POST /auth/otp/request", body);
  },
  async verifyOtp(phone: string, code: string): Promise<AuthSession> {
    const body: VerifyOtpDto = { phone, code };
    const session = await apiClient.post<AuthSession>("POST /auth/otp/verify", body);
    authSessionStore.write(session);
    return session;
  },
  async logout(refreshToken?: string): Promise<void> {
    const body: RefreshTokenDto | undefined = refreshToken ? { refreshToken } : undefined;
    await apiClient.post<void>("POST /auth/logout", body);
    authSessionStore.clear();
  },
  me(): Promise<UserProfile> {
    return apiClient.get<UserProfile>("GET /me");
  }
};
