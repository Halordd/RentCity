import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { ContractStatus, UserRole } from "@prisma/client";
import type { AuthenticatedUser } from "../../common/auth/auth.types";
import { PrismaService } from "../../database/prisma.service";
import { CreateContractDto } from "./dto/create-contract.dto";

@Injectable()
export class ContractsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(user: AuthenticatedUser, payload: CreateContractDto) {
    const listing = await this.prisma.listing.findUnique({ where: { id: payload.listingId } });
    if (!listing) throw new NotFoundException("Listing not found");

    return this.prisma.contract.create({
      data: {
        userId: user.id,
        listingId: payload.listingId,
        fileUrl: payload.fileUrl,
        status: ContractStatus.DRAFT
      }
    });
  }

  async detail(user: AuthenticatedUser, id: string) {
    const contract = await this.prisma.contract.findUnique({
      where: { id },
      include: { listing: { select: { id: true, title: true, ownerId: true } } }
    });
    if (!contract) throw new NotFoundException("Contract not found");
    if (user.role !== UserRole.ADMIN && contract.userId !== user.id && contract.listing.ownerId !== user.id) {
      throw new ForbiddenException("Cannot access this contract");
    }
    return contract;
  }
}
