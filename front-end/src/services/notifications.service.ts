import { http } from "../api/httpClient";

interface ApiNotification {
  id: string;
  title: string;
  body: string;
}

export const notificationsService = {
  async listRemote(): Promise<string[]> {
    const result = await http.get<{ items: ApiNotification[] }>("/me/notifications");
    return result.items.map((item) => `${item.title}: ${item.body}`);
  },
  markReadRemote(id: string): Promise<ApiNotification | null> {
    return http.patch(`/me/notifications/${id}/read`);
  }
};
