import { http } from "../api/httpClient";
import type { Message } from "../types";
import { mapApiMessage, type ApiMessage } from "./apiMappers";

export interface ApiConversation {
  id: string;
  listingId?: string | null;
  tenantId?: string | null;
  ownerId?: string | null;
  unreadCount?: number;
  lastMessage?: ApiMessage | null;
}

export const messagesService = {
  async conversationsRemote(): Promise<ApiConversation[]> {
    const result = await http.get<{ items: ApiConversation[] }>("/conversations");
    return result.items;
  },
  async messagesRemote(conversationId: string, currentUserId?: string): Promise<Message[]> {
    const result = await http.get<{ conversationId: string; items: ApiMessage[] }>(`/conversations/${conversationId}/messages`);
    return result.items.map((item) => mapApiMessage(item, currentUserId));
  },
  async sendRemote(conversationId: string, body: string, currentUserId?: string): Promise<Message> {
    const result = await http.post<ApiMessage>(`/conversations/${conversationId}/messages`, { body });
    return mapApiMessage(result, currentUserId);
  },
  markReadRemote(conversationId: string): Promise<{ conversationId: string; readCount: number }> {
    return http.patch(`/conversations/${conversationId}/read`);
  },
  createConversationRemote(input: { ownerId: string; listingId?: string }): Promise<ApiConversation> {
    return http.post("/conversations", input);
  }
};
