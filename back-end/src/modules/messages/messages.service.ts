import { Injectable } from "@nestjs/common";

@Injectable()
export class MessagesService {
  conversations() {
    return {
      items: [{ id: "conversation-demo", listingId: "studio-nguyen-van-cu", unreadCount: 1 }]
    };
  }

  messages(conversationId: string) {
    return {
      conversationId,
      items: [
        { id: "msg-1", from: "owner", body: "Phong van con lich xem.", createdAt: new Date().toISOString() }
      ]
    };
  }

  create(conversationId: string, body: string) {
    return {
      id: "msg-demo",
      conversationId,
      from: "tenant",
      body,
      createdAt: new Date().toISOString()
    };
  }
}
