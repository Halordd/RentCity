import { apiClient } from "../api/apiClient";
import type { CreateConversationDto, CreateMessageDto } from "../api/generated";
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
    const result = await apiClient.get<{ items: ApiConversation[] }>("GET /conversations");
    return result.items;
  },
  async messagesRemote(conversationId: string, currentUserId?: string): Promise<Message[]> {
    const result = await apiClient.get<{ conversationId: string; items: ApiMessage[] }>("GET /conversations/{id}/messages", {
      params: { id: conversationId }
    });
    return result.items.map((item) => mapApiMessage(item, currentUserId));
  },
  async sendRemote(conversationId: string, body: string, currentUserId?: string): Promise<Message> {
    const requestBody: CreateMessageDto = { body };
    const result = await apiClient.post<ApiMessage>("POST /conversations/{id}/messages", requestBody, { params: { id: conversationId } });
    return mapApiMessage(result, currentUserId);
  },
  markReadRemote(conversationId: string): Promise<{ conversationId: string; readCount: number }> {
    return apiClient.patch("PATCH /conversations/{id}/read", undefined, { params: { id: conversationId } });
  },
  createConversationRemote(input: { ownerId: string; listingId?: string }): Promise<ApiConversation> {
    const body: CreateConversationDto = input;
    return apiClient.post("POST /conversations", body);
  }
};
