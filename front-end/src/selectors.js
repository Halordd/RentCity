import { listings } from './data.js';
import { state } from './state.js';

export function filteredListings() {
  const keyword = state.filters.keyword.trim().toLowerCase();
  return listings.filter((item) => {
    const districtOk = state.filters.district === "Tất cả" || item.district === state.filters.district;
    const budgetOk =
      state.filters.budget === "Tất cả" ||
      (state.filters.budget === "Dưới 6tr" && item.price < 6) ||
      (state.filters.budget === "6-10tr" && item.price >= 6 && item.price <= 10) ||
      (state.filters.budget === "Trên 10tr" && item.price > 10);
    const keywordOk =
      !keyword ||
      `${item.title} ${item.district} ${item.address} ${item.tags.join(" ")}`.toLowerCase().includes(keyword);
    return districtOk && budgetOk && keywordOk;
  });
}
