import { adminRows } from "../data";
import { http } from "../api/httpClient";
import type { AdminRows, DataRow } from "../types";

interface AdminListingQueueItem {
  title: string;
  status: string;
  price: number;
  owner?: { fullName?: string | null; phone?: string | null; status?: string };
  images?: Array<{ url: string }>;
}

function compactVnd(value: number): string {
  if (value >= 1000000) return `${Number((value / 1000000).toFixed(1)).toLocaleString("vi-VN")}tr`;
  return value.toLocaleString("vi-VN");
}

export const adminService: {
  rows: AdminRows;
  auditRows: DataRow[];
  financeRows: DataRow[];
  rowsRemote: () => Promise<{ rows: AdminRows; auditRows: DataRow[]; financeRows: DataRow[]; metrics: DataRow[] }>;
} = {
  rows: adminRows,
  auditRows: [
    ["20/06 09:42", "Verifier Lan", "Duyệt KYC Anh Minh Nguyễn", "Thành công"],
    ["20/06 09:18", "Support Nam", "Yêu cầu bổ sung ảnh mặt tiền", "Đã gửi"],
    ["19/06 17:06", "Accountant Hân", "Duyệt hoàn tiền DSP-102", "Chờ cấp cao"],
    ["19/06 15:33", "Super Admin", "Thay đổi role support", "Đã ghi log"]
  ],
  financeRows: [
    ["DEP-2606", "18/06", "5.800.000đ", "Chờ đối soát"],
    ["REF-102", "18/06", "2.000.000đ", "Cần duyệt hoàn"],
    ["INV-0526", "18/05", "1.990.000đ", "Đã xuất hóa đơn"]
  ],
  async rowsRemote() {
    const [metrics, listingQueue, verifications, disputes, auditLogs] = await Promise.all([
      http.get<Record<string, number>>("/admin/metrics"),
      http.get<{ items: AdminListingQueueItem[] }>("/admin/listings"),
      http.get<{ items: Array<{ owner?: { fullName?: string | null; phone?: string | null }; status: string; note?: string | null }> }>("/admin/verifications"),
      http.get<{ items: Array<{ id: string; title: string; status: string; createdAt?: string }> }>("/admin/disputes"),
      http.get<{ items: Array<{ createdAt: string; actor?: { fullName?: string | null; phone?: string | null }; action: string; target: string }> }>(
        "/admin/audit-logs"
      )
    ]);

    return {
      rows: {
        listings: listingQueue.items.length
          ? listingQueue.items.map((item) => [
              item.title,
              item.status,
              compactVnd(item.price),
              item.owner?.status || item.owner?.fullName || item.owner?.phone || "Owner"
            ])
          : adminRows.listings,
        verification: verifications.items.map((item) => [
          item.owner?.fullName || item.owner?.phone || "Owner",
          item.note || "Ho so xac minh",
          item.status,
          item.status === "PENDING" ? "Can duyet" : "Da xu ly"
        ]),
        disputes: disputes.items.map((item) => [item.id, item.title, item.createdAt ? new Date(item.createdAt).toLocaleDateString("vi-VN") : "-", item.status])
      },
      auditRows: auditLogs.items.map((item) => [
        new Date(item.createdAt).toLocaleString("vi-VN"),
        item.actor?.fullName || item.actor?.phone || "System",
        item.action,
        item.target
      ]),
      financeRows: this.financeRows,
      metrics: Object.entries(metrics).map(([key, value]) => [key, String(value)])
    };
  }
};
