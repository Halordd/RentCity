import { BadRequestException, HttpException, HttpStatus, Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { UserRole } from "@prisma/client";
import bcrypt from "bcryptjs";
import { randomBytes, randomInt } from "node:crypto";
import { PrismaService } from "../../database/prisma.service";
import { SMS_PROVIDER, SmsProvider } from "../../integrations/sms/sms-provider.interface";

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
    @Inject(SMS_PROVIDER) private readonly smsProvider: SmsProvider
  ) {}

  async requestOtp(phone: string) {
    const ttlSeconds = this.config.get<number>("OTP_TTL_SECONDS", 300);
    const hourlyLimit = this.config.get<number>("OTP_REQUEST_LIMIT_PER_HOUR", 5);
    const recentRequests = await this.prisma.otpChallenge.count({
      where: {
        phone,
        createdAt: { gte: new Date(Date.now() - 60 * 60 * 1000) }
      }
    });

    if (recentRequests >= hourlyLimit) {
      throw new HttpException("OTP request limit exceeded. Please try again later.", HttpStatus.TOO_MANY_REQUESTS);
    }

    const code = randomInt(100000, 999999).toString();
    const codeHash = await bcrypt.hash(code, 10);

    await this.prisma.otpChallenge.create({
      data: {
        phone,
        codeHash,
        expiresAt: new Date(Date.now() + ttlSeconds * 1000)
      }
    });
    const delivery = await this.smsProvider.sendOtp({ phone, code, ttlSeconds });

    return {
      phone,
      delivery: "sms",
      provider: delivery.provider,
      messageId: delivery.messageId,
      ttlSeconds,
      ...(this.config.get<string>("NODE_ENV") === "production" ? {} : { devCode: code })
    };
  }

  async verifyOtp(phone: string, code: string) {
    const challenge = await this.prisma.otpChallenge.findFirst({
      where: {
        phone,
        consumedAt: null,
        expiresAt: { gt: new Date() }
      },
      orderBy: { createdAt: "desc" }
    });

    if (!challenge) throw new UnauthorizedException("OTP is expired or missing");

    if (challenge.attempts >= 5) {
      throw new UnauthorizedException("OTP attempt limit exceeded");
    }

    const valid = await bcrypt.compare(code, challenge.codeHash);
    if (!valid) {
      await this.prisma.otpChallenge.update({
        where: { id: challenge.id },
        data: { attempts: { increment: 1 } }
      });
      throw new UnauthorizedException("Invalid OTP");
    }

    const user = await this.prisma.user.upsert({
      where: { phone },
      update: { status: "ACTIVE" },
      create: {
        phone,
        role: UserRole.TENANT,
        status: "ACTIVE"
      }
    });

    await this.prisma.otpChallenge.update({
      where: { id: challenge.id },
      data: { consumedAt: new Date() }
    });

    return this.createAuthResponse(user);
  }

  async refresh(refreshToken: string) {
    const parsed = this.parseRefreshToken(refreshToken);
    const session = await this.prisma.authSession.findUnique({
      where: { id: parsed.sessionId },
      include: { user: true }
    });

    if (!session || session.revokedAt || session.expiresAt <= new Date()) {
      throw new UnauthorizedException("Refresh token is expired or revoked");
    }

    const valid = await bcrypt.compare(parsed.secret, session.refreshTokenHash);
    if (!valid) throw new UnauthorizedException("Invalid refresh token");

    const nextRefreshSecret = this.createRefreshSecret();
    const refreshTokenHash = await bcrypt.hash(nextRefreshSecret, 10);
    await this.prisma.authSession.update({
      where: { id: session.id },
      data: {
        refreshTokenHash,
        lastUsedAt: new Date()
      }
    });

    return this.createAuthResponse(session.user, {
      sessionId: session.id,
      refreshSecret: nextRefreshSecret,
      refreshExpiresAt: session.expiresAt
    });
  }

  async logout(refreshToken?: string) {
    if (!refreshToken) return { success: true };

    const parsed = this.parseRefreshToken(refreshToken);
    await this.prisma.authSession.updateMany({
      where: {
        id: parsed.sessionId,
        revokedAt: null
      },
      data: { revokedAt: new Date() }
    });

    return { success: true };
  }

  private async createAuthResponse(
    user: { id: string; phone: string; role: UserRole; fullName: string | null },
    existingSession?: { sessionId: string; refreshSecret: string; refreshExpiresAt: Date }
  ) {
    const session = existingSession ?? (await this.createAuthSession(user.id));
    const accessToken = await this.jwtService.signAsync({
      sub: user.id,
      phone: user.phone,
      role: user.role
    });

    return {
      accessToken,
      refreshToken: `${session.sessionId}.${session.refreshSecret}`,
      refreshExpiresAt: session.refreshExpiresAt.toISOString(),
      tokenType: "Bearer",
      user: {
        id: user.id,
        phone: user.phone,
        role: user.role,
        fullName: user.fullName
      }
    };
  }

  private async createAuthSession(userId: string) {
    const refreshSecret = this.createRefreshSecret();
    const refreshTokenHash = await bcrypt.hash(refreshSecret, 10);
    const refreshExpiresAt = new Date(Date.now() + this.config.get<number>("REFRESH_TOKEN_TTL_DAYS", 30) * 24 * 60 * 60 * 1000);
    const session = await this.prisma.authSession.create({
      data: {
        userId,
        refreshTokenHash,
        expiresAt: refreshExpiresAt
      }
    });

    return {
      sessionId: session.id,
      refreshSecret,
      refreshExpiresAt
    };
  }

  private createRefreshSecret(): string {
    return randomBytes(32).toString("base64url");
  }

  private parseRefreshToken(refreshToken: string): { sessionId: string; secret: string } {
    const [sessionId, secret] = refreshToken.split(".");
    if (!sessionId || !secret) throw new UnauthorizedException("Invalid refresh token");

    return { sessionId, secret };
  }

  async currentUser(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        phone: true,
        email: true,
        fullName: true,
        role: true,
        status: true,
        preferredArea: true,
        createdAt: true,
        updatedAt: true
      }
    });

    if (!user) throw new BadRequestException("User no longer exists");
    return user;
  }
}
