import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";
import { UpdateProfileDto } from "./dto/update-profile.dto";

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async profile(id: string) {
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
    if (!user) throw new NotFoundException("User not found");
    return user;
  }

  async updateProfile(id: string, payload: UpdateProfileDto) {
    return this.prisma.user.update({
      where: { id },
      data: payload,
      select: {
        id: true,
        phone: true,
        email: true,
        fullName: true,
        role: true,
        status: true,
        preferredArea: true,
        updatedAt: true
      }
    });
  }
}
