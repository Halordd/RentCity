import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { UserRole } from "@prisma/client";
import bcrypt from "bcryptjs";
import { randomInt } from "node:crypto";
import { PrismaService } from "../../database/prisma.service";

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService
  ) {}

  async requestOtp(phone: string) {
    const ttlSeconds = this.config.get<number>("OTP_TTL_SECONDS", 300);
    const code = randomInt(100000, 999999).toString();
    const codeHash = await bcrypt.hash(code, 10);

    await this.prisma.otpChallenge.create({
      data: {
        phone,
        codeHash,
        expiresAt: new Date(Date.now() + ttlSeconds * 1000)
      }
    });

    return {
      phone,
      delivery: "sms",
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

    const accessToken = await this.jwtService.signAsync({
      sub: user.id,
      phone: user.phone,
      role: user.role
    });

    return {
      accessToken,
      tokenType: "Bearer",
      user: {
        id: user.id,
        phone: user.phone,
        role: user.role,
        fullName: user.fullName
      }
    };
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
