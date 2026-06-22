import { listingById, listings } from "../data.js";

export function filterListings(filters) {
  const keyword = filters.keyword.trim().toLowerCase();
  return listings.filter((item) => {
    const districtOk = filters.district === "Tất cả" || item.district === filters.district;
    const budgetOk =
      filters.budget === "Tất cả" ||
      (filters.budget === "Dưới 6tr" && item.price < 6) ||
      (filters.budget === "6-10tr" && item.price >= 6 && item.price <= 10) ||
      (filters.budget === "Trên 10tr" && item.price > 10);
    const keywordOk =
      !keyword ||
      `${item.title} ${item.district} ${item.address} ${item.tags.join(" ")}`.toLowerCase().includes(keyword);
    return districtOk && budgetOk && keywordOk;
  });
}

export const listingsService = {
  list: (filters) => filterListings(filters),
  featured: () => listings.slice(0, 3),
  getById: (id) => listingById(id),
  saved: (ids) => listings.filter((item) => ids.includes(item.id))
};
