import type { Dispatch, ReactNode } from "react";

export type AppArea = "web" | "app" | "mobile" | "web_app" | "admin";

export type NavigateTo = (path: string) => void;

export interface RouteInfo {
  area: AppArea | string;
  path?: string;
  id?: string;
  parts: string[];
}

export interface RoutedScreenProps {
  route: RouteInfo;
  navigate: NavigateTo;
}

export interface ChildrenProps {
  children: ReactNode;
}

export interface ListingFilters {
  keyword: string;
  district: string;
  budget: string;
}

export interface Listing {
  id: string;
  title: string;
  district: string;
  address: string;
  price: number;
  area: number;
  rooms: number;
  wc: number;
  floor: string;
  deposit: string;
  electricity: string;
  water: string;
  parking: string;
  tags: string[];
  image: string;
  owner: string;
  verified: boolean;
  available: string;
  score: number;
  coordinates: string;
  ownerId?: string;
}

export interface Booking {
  id: string;
  listingId: string;
  date: string;
  time: string;
  status: string;
}

export interface Message {
  from: "Bạn" | "Chủ nhà" | string;
  body: string;
}

export type PaymentState = "ready" | "success" | "failed";
export type ApiMode = "mock" | "remote";
export type ApiStatus = "idle" | "syncing" | "ready" | "error";

export interface UserProfile {
  id: string;
  phone: string;
  email?: string | null;
  fullName?: string | null;
  role: "TENANT" | "OWNER" | "ADMIN" | string;
  status?: string;
  preferredArea?: string | null;
}

export interface AuthSession {
  accessToken: string;
  refreshToken: string;
  refreshExpiresAt: string;
  tokenType: string;
  user: UserProfile;
}

export interface ApiState {
  mode: ApiMode;
  status: ApiStatus;
  message?: string;
}

export interface AppState {
  filters: ListingFilters;
  listings: Listing[];
  saved: string[];
  bookings: Booking[];
  messages: Message[];
  notifications: string[];
  lastPayment: PaymentState;
  activeConversationId?: string;
  api: ApiState;
  auth: AuthSession | null;
}

export type AppAction =
  | { type: "filters/set"; payload: ListingFilters }
  | { type: "listings/set"; payload: Listing[] }
  | { type: "saved/set"; payload: string[] }
  | { type: "saved/toggle"; payload: string }
  | { type: "bookings/set"; payload: Booking[] }
  | { type: "booking/add"; payload: Booking; meta?: { listingTitle?: string } }
  | { type: "messages/set"; payload: Message[]; meta?: { conversationId?: string } }
  | { type: "message/add"; payload: string }
  | { type: "notifications/set"; payload: string[] }
  | { type: "payment/set"; payload: PaymentState }
  | { type: "otp/send" }
  | { type: "auth/set"; payload: AuthSession | null }
  | { type: "api/set"; payload: ApiState };

export interface RentCityContextValue {
  state: AppState;
  dispatch: Dispatch<AppAction>;
  notify: (message: string) => void;
}

export type DataRow = string[];

export interface AdminRows {
  listings: DataRow[];
  verification: DataRow[];
  disputes: DataRow[];
}
