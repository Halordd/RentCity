import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { ok } from "../../common/api-response";
import { CurrentUser } from "../../common/auth/current-user.decorator";
import { JwtAuthGuard } from "../../common/auth/jwt-auth.guard";
import type { AuthenticatedUser } from "../../common/auth/auth.types";
import { CreateConversationDto } from "./dto/create-conversation.dto";
import { CreateMessageDto } from "./dto/create-message.dto";
import { MessagesService } from "./messages.service";

@UseGuards(JwtAuthGuard)
@Controller("conversations")
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Get()
  async conversations(@CurrentUser() user: AuthenticatedUser) {
    return ok(await this.messagesService.conversations(user));
  }

  @Post()
  async createConversation(@CurrentUser() user: AuthenticatedUser, @Body() body: CreateConversationDto) {
    return ok(await this.messagesService.createConversation(user, body));
  }

  @Get(":id/messages")
  async messages(@CurrentUser() user: AuthenticatedUser, @Param("id") id: string) {
    return ok(await this.messagesService.messages(user, id));
  }

  @Post(":id/messages")
  async create(@CurrentUser() user: AuthenticatedUser, @Param("id") id: string, @Body() body: CreateMessageDto) {
    return ok(await this.messagesService.create(user, id, body.body));
  }
}
