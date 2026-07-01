import { http } from "../api/httpClient";

export interface OwnerDashboardMetricSet {
  managedListings: number;
  publishedListings: number;
  pendingBookings: number;
  confirmedBookings: number;
  monthlyRevenue: number;
  needsAction: number;
}

export interface OwnerPipelineItem {
  key: string;
  label: string;
  count: number;
}

export interface OwnerDashboard {
  metrics: OwnerDashboardMetricSet;
  pipeline: OwnerPipelineItem[];
  latestBookings: Array<{
    id: string;
    status: string;
    date: string;
    timeSlot: string;
    listing?: { id: string; title: string; address: string };
    tenant?: { id: string; fullName?: string | null; phone?: string | null };
  }>;
  listingsNeedingAction: Array<{
    id: string;
    title: string;
    status: string;
    updatedAt?: string;
  }>;
}

export const ownerService = {
  dashboardRemote(): Promise<OwnerDashboard> {
    return http.get("/owner/dashboard");
  }
};
