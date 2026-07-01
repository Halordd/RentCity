import { http } from "../api/httpClient";

interface SavedListingResponse {
  items: Array<{ listingId: string }>;
}

export const savedListingsService = {
  async idsRemote(): Promise<string[]> {
    const result = await http.get<SavedListingResponse>("/me/saved-listings");
    return result.items.map((item) => item.listingId);
  },
  saveRemote(listingId: string): Promise<{ listingId: string; saved: boolean }> {
    return http.post(`/me/saved-listings/${listingId}`);
  },
  removeRemote(listingId: string): Promise<{ listingId: string; saved: boolean }> {
    return http.delete(`/me/saved-listings/${listingId}`);
  }
};
