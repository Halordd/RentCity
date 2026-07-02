import { apiClient } from "../api/apiClient";

interface ApiNotification {
  id: string;
  title: string;
  body: string;
}

export const notificationsService = {
  async listRemote(): Promise<string[]> {
    const result = await apiClient.get<{ items: ApiNotification[] }>("GET /me/notifications");
    return result.items.map((item) => `${item.title}: ${item.body}`);
  },
  markReadRemote(id: string): Promise<ApiNotification | null> {
    return apiClient.patch("PATCH /me/notifications/{id}/read", undefined, { params: { id } });
  }
};
