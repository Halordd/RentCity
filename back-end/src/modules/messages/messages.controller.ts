import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { ok } from "../../common/api-response";
import { MessagesService } from "./messages.service";

@Controller("conversations")
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Get()
  conversations() {
    return ok(this.messagesService.conversations());
  }

  @Get(":id/messages")
  messages(@Param("id") id: string) {
    return ok(this.messagesService.messages(id));
  }

  @Post(":id/messages")
  create(@Param("id") id: string, @Body() body: { body: string }) {
    return ok(this.messagesService.create(id, body.body));
  }
}
