import type { AdminRows, Listing } from "./types";

export const assets = {
  apartment: "/.rentcity-assets/rentcity-apartment.jpg",
  bedroom: "/.rentcity-assets/rentcity-bedroom.jpg",
  building: "/.rentcity-assets/rentcity-building.jpg",
  house: "/.rentcity-assets/rentcity-house.jpg",
  livingroom: "/.rentcity-assets/rentcity-livingroom.jpg"
};

export const listings: Listing[] = [
  {
    id: "studio-q7",
    title: "Studio mới gần Crescent Mall",
    district: "Quận 7",
    address: "Nguyễn Văn Cừ, Tân Phong",
    price: 5.8,
    area: 28,
    rooms: 1,
    wc: 1,
    floor: "Tầng 5",
    deposit: "Cọc 1 tháng",
    electricity: "4k/kWh",
    water: "100k/người",
    parking: "150k/tháng",
    tags: ["Ban công", "Full nội thất", "Máy giặt riêng"],
    image: assets.bedroom,
    owner: "Anh Minh Nguyễn",
    verified: true,
    available: "22/06",
    score: 92,
    coordinates: "10.729, 106.721"
  },
  {
    id: "can-ho-1pn",
    title: "Căn hộ 1PN Sunrise City",
    district: "Quận 7",
    address: "Nguyễn Hữu Thọ, Tân Hưng",
    price: 8.2,
    area: 42,
    rooms: 1,
    wc: 1,
    floor: "Tầng 12",
    deposit: "Cọc 2 tháng",
    electricity: "Theo nhà nước",
    water: "18k/m3",
    parking: "Miễn phí 1 xe",
    tags: ["Hồ bơi", "Thang máy", "Bảo vệ 24/7"],
    image: assets.apartment,
    owner: "Cô Thảo Lê",
    verified: true,
    available: "24/06",
    score: 88,
    coordinates: "10.737, 106.701"
  },
  {
    id: "phong-tro-an-ninh",
    title: "Phòng trọ an ninh Huỳnh Tấn Phát",
    district: "Quận 7",
    address: "Huỳnh Tấn Phát, Phú Thuận",
    price: 4.2,
    area: 24,
    rooms: 1,
    wc: 1,
    floor: "Tầng 2",
    deposit: "Cọc 1 tháng",
    electricity: "4.2k/kWh",
    water: "80k/người",
    parking: "100k/tháng",
    tags: ["Giờ tự do", "Camera", "Gác lửng"],
    image: assets.livingroom,
    owner: "Chị Hạnh Võ",
    verified: true,
    available: "20/06",
    score: 84,
    coordinates: "10.746, 106.732"
  },
  {
    id: "nha-thu-duc",
    title: "Nhà nguyên căn Thảo Điền",
    district: "Thủ Đức",
    address: "Quốc Hương, Thảo Điền",
    price: 15,
    area: 76,
    rooms: 2,
    wc: 2,
    floor: "Trệt + lầu",
    deposit: "Cọc 2 tháng",
    electricity: "Theo nhà nước",
    water: "Theo nhà nước",
    parking: "Sân riêng",
    tags: ["Nuôi pet", "Sân nhỏ", "Bếp riêng"],
    image: assets.house,
    owner: "Anh Quốc Bảo",
    verified: true,
    available: "25/06",
    score: 91,
    coordinates: "10.806, 106.733"
  },
  {
    id: "toa-nha-binh-thanh",
    title: "Căn hộ dịch vụ Bình Thạnh",
    district: "Bình Thạnh",
    address: "Nguyễn Gia Trí, Phường 25",
    price: 7.4,
    area: 35,
    rooms: 1,
    wc: 1,
    floor: "Tầng 7",
    deposit: "Cọc 1.5 tháng",
    electricity: "4k/kWh",
    water: "120k/người",
    parking: "200k/tháng",
    tags: ["Dọn phòng", "Cửa sổ lớn", "Thang máy"],
    image: assets.building,
    owner: "RentCity Homes",
    verified: true,
    available: "26/06",
    score: 87,
    coordinates: "10.802, 106.714"
  }
];

export const adminRows: AdminRows = {
  listings: [
    ["Studio mới gần Crescent Mall", "Đã duyệt", "5.8tr", "92/100"],
    ["Căn hộ 1PN Sunrise City", "Đang chạy", "8.2tr", "88/100"],
    ["Nhà nguyên căn Thảo Điền", "Cần ảnh mặt tiền", "15tr", "74/100"],
    ["Căn hộ dịch vụ Bình Thạnh", "Đợi xác minh", "7.4tr", "80/100"]
  ],
  verification: [
    ["Anh Minh Nguyễn", "CMND/CCCD", "Đã tải lên", "Duyệt"],
    ["Cô Thảo Lê", "Giấy sở hữu", "Cần kiểm tra", "Yêu cầu bổ sung"],
    ["RentCity Homes", "Tài khoản nhận cọc", "Hợp lệ", "Duyệt"],
    ["Anh Quốc Bảo", "Ảnh nhà thật", "Thiếu ảnh", "Tạm giữ"]
  ],
  disputes: [
    ["DSP-102", "Hoàn tiền cọc", "2 giờ", "Đang xử lý"],
    ["DSP-101", "Ảnh không đúng", "5 giờ", "Chờ chủ nhà"],
    ["DSP-099", "Không phản hồi", "1 ngày", "Theo dõi"],
    ["DSP-097", "Phí phát sinh", "2 ngày", "Đề xuất đóng"]
  ]
};

export function listingById(id?: string): Listing {
  return listings.find((item) => item.id === id) || listings[0];
}
