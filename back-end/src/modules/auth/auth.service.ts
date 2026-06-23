import { Injectable } from "@nestjs/common";

@Injectable()
export class AuthService {
  requestOtp(phone: string) {
    return {
      phone,
      delivery: "sms",
      ttlSeconds: 300,
      debugCode: "123456"
    };
  }

  verifyOtp(phone: string, code: string) {
    return {
      accessToken: `demo-token-${code}`,
      tokenType: "Bearer",
      user: {
        id: "demo-user",
        phone,
        role: "TENANT"
      }
    };
  }

  currentUser() {
    return {
      id: "demo-user",
      phone: "+84912345678",
      fullName: "Nguyen Minh Anh",
      role: "TENANT",
      status: "ACTIVE"
    };
  }
}
