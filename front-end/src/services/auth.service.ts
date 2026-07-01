import { authSessionStore, http } from "../api/httpClient";
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
    return http.post<OtpRequestResult>("/auth/otp/request", { phone });
  },
  async verifyOtp(phone: string, code: string): Promise<AuthSession> {
    const session = await http.post<AuthSession>("/auth/otp/verify", { phone, code });
    authSessionStore.write(session);
    return session;
  },
  async logout(refreshToken?: string): Promise<void> {
    await http.post("/auth/logout", { refreshToken });
    authSessionStore.clear();
  },
  me(): Promise<UserProfile> {
    return http.get<UserProfile>("/me");
  }
};
