import { adminRows } from "../data.js";

export const adminService = {
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
  ]
};
