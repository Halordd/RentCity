import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { UserRole } from "@prisma/client";
import type { AuthenticatedUser } from "../../common/auth/auth.types";
import { PrismaService } from "../../database/prisma.service";
import { CreateConversationDto } from "./dto/create-conversation.dto";

@Injectable()
export class MessagesService {
  constructor(private readonly prisma: PrismaService) {}

  async conversations(user: AuthenticatedUser) {
    const items = await this.prisma.conversation.findMany({
      where: this.conversationWhere(user),
      include: {
        listing: { select: { id: true, title: true } },
        tenant: { select: { id: true, fullName: true, phone: true } },
        owner: { select: { id: true, fullName: true, phone: true } },
        messages: { orderBy: { createdAt: "desc" }, take: 1 }
      },
      orderBy: { updatedAt: "desc" }
    });

    return { items };
  }

  async createConversation(user: AuthenticatedUser, payload: CreateConversationDto) {
    if (payload.ownerId === user.id) throw new ForbiddenException("Cannot create a conversation with yourself");

    const owner = await this.prisma.user.findUnique({ where: { id: payload.ownerId } });
    if (!owner) throw new NotFoundException("Owner not found");

    if (payload.listingId) {
      const listing = await this.prisma.listing.findUnique({ where: { id: payload.listingId } });
      if (!listing) throw new NotFoundException("Listing not found");
    }

    return this.prisma.conversation.create({
      data: {
        listingId: payload.listingId,
        tenantId: user.id,
        ownerId: payload.ownerId
      }
    });
  }

  async messages(user: AuthenticatedUser, conversationId: string) {
    await this.assertConversationAccess(user, conversationId);
    const items = await this.prisma.message.findMany({
      where: { conversationId },
      include: { sender: { select: { id: true, fullName: true, phone: true, role: true } } },
      orderBy: { createdAt: "asc" }
    });

    return { conversationId, items };
  }

  async create(user: AuthenticatedUser, conversationId: string, body: string) {
    await this.assertConversationAccess(user, conversationId);

    const message = await this.prisma.message.create({
      data: {
        conversationId,
        senderId: user.id,
        body
      },
      include: { sender: { select: { id: true, fullName: true, phone: true, role: true } } }
    });

    await this.prisma.conversation.update({
      where: { id: conversationId },
      data: { updatedAt: new Date() }
    });

    return message;
  }

  private conversationWhere(user: AuthenticatedUser) {
    if (user.role === UserRole.ADMIN) return {};

    return {
      OR: [{ tenantId: user.id }, { ownerId: user.id }]
    };
  }

  private async assertConversationAccess(user: AuthenticatedUser, conversationId: string) {
    const conversation = await this.prisma.conversation.findUnique({
      where: { id: conversationId }
    });
    if (!conversation) throw new NotFoundException("Conversation not found");
    if (user.role === UserRole.ADMIN) return;
    if (conversation.tenantId !== user.id && conversation.ownerId !== user.id) {
      throw new ForbiddenException("Cannot access this conversation");
    }
  }
}
