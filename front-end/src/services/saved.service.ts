import { apiClient } from "../api/apiClient";

interface SavedListingResponse {
  items: Array<{ listingId: string }>;
}

export const savedListingsService = {
  async idsRemote(): Promise<string[]> {
    const result = await apiClient.get<SavedListingResponse>("GET /me/saved-listings");
    return result.items.map((item) => item.listingId);
  },
  saveRemote(listingId: string): Promise<{ listingId: string; saved: boolean }> {
    return apiClient.post("POST /me/saved-listings/{listingId}", undefined, { params: { listingId } });
  },
  removeRemote(listingId: string): Promise<{ listingId: string; saved: boolean }> {
    return apiClient.delete("DELETE /me/saved-listings/{listingId}", { params: { listingId } });
  }
};
