import { listingById, listings } from "../data";
import { apiClient } from "../api/apiClient";
import type { ApiQuery } from "../api/generated";
import type { Listing, ListingFilters } from "../types";
import { mapApiListing, type ApiListing } from "./apiMappers";

interface ListingSearchResponse {
  items: ApiListing[];
}

function listingSearchQuery(filters: ListingFilters): ApiQuery<"GET /listings"> & Record<string, boolean | number | string | undefined> {
  const budget = filters.budget.toLowerCase();
  const allDistrict = filters.district.toLowerCase() === "tat ca" || filters.district.includes("Táº¥t") || filters.district.includes("Tất");
  return {
    keyword: filters.keyword.trim() || undefined,
    district: allDistrict ? undefined : filters.district,
    minPrice: budget.includes("6-10") ? 6000000 : budget.includes("trÃªn") || budget.includes("trên") ? 10000000 : undefined,
    maxPrice: budget.includes("dÆ°á»›i") || budget.includes("dưới") ? 6000000 : budget.includes("6-10") ? 10000000 : undefined,
    page: 1,
    limit: 24
  };
}

export function filterListings(filters: ListingFilters, source: Listing[] = listings): Listing[] {
  const keyword = filters.keyword.trim().toLowerCase();
  const district = filters.district.toLowerCase();
  const budget = filters.budget.toLowerCase();
  return source.filter((item) => {
    const districtOk = district === "tat ca" || filters.district === "Tất cả" || filters.district.includes("Táº¥t") || item.district === filters.district;
    const budgetOk =
      budget === "tat ca" ||
      filters.budget === "Tất cả" ||
      ((budget.includes("duoi") || budget.includes("dưới") || budget.includes("dÆ°á»›i")) && item.price < 6) ||
      (budget.includes("6-10") && item.price >= 6 && item.price <= 10) ||
      ((budget.includes("tren") || budget.includes("trên") || budget.includes("trÃªn")) && item.price > 10);
    const keywordOk =
      !keyword ||
      `${item.title} ${item.district} ${item.address} ${item.tags.join(" ")}`.toLowerCase().includes(keyword);
    return districtOk && budgetOk && keywordOk;
  });
}

export const listingsService = {
  list: (filters: ListingFilters, source: Listing[] = listings): Listing[] => filterListings(filters, source),
  featured: (source: Listing[] = listings): Listing[] => source.slice(0, 3),
  getById: (id?: string, source: Listing[] = listings): Listing => source.find((item) => item.id === id) || listingById(id),
  saved: (ids: string[], source: Listing[] = listings): Listing[] => source.filter((item) => ids.includes(item.id)),
  async listRemote(filters: ListingFilters): Promise<Listing[]> {
    const result = await apiClient.get<ListingSearchResponse>("GET /listings", { query: listingSearchQuery(filters) });
    return result.items.map((item, index) => mapApiListing(item, index));
  },
  async detailRemote(id: string): Promise<Listing> {
    const result = await apiClient.get<ApiListing>("GET /listings/{id}", { params: { id } });
    return mapApiListing(result);
  }
};
