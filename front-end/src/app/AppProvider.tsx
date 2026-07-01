import React, { useCallback, useEffect, useMemo, useReducer, useState } from "react";
import { authSessionStore, isApiConfigured } from "../api/httpClient";
import { listings } from "../data";
import { bookingsService } from "../services/bookings.service";
import { listingsService } from "../services/listings.service";
import { messagesService } from "../services/messages.service";
import { notificationsService } from "../services/notifications.service";
import { savedListingsService } from "../services/saved.service";
import { AppContext } from "./rentCityContext";
import type { AppAction, AppState, ChildrenProps } from "../types";

const STORE_KEY = "rentcity.production.state";

const initialState: AppState = {
  filters: { keyword: "", district: "Tất cả", budget: "Tất cả" },
  listings,
  saved: ["studio-q7"],
  bookings: [{ id: "BK-2606", listingId: "studio-q7", date: "Thứ 7, 22/06", time: "09:00 - 11:00", status: "Đã xác nhận" }],
  messages: [
    { from: "Chủ nhà", body: "Mình còn lịch xem 09:00 sáng thứ 7, bạn xác nhận giúp nhé." },
    { from: "Bạn", body: "Dạ được, cho mình xin thêm phí gửi xe và tiền điện." }
  ],
  notifications: ["Lịch xem Studio Nguyễn Văn Cừ đã được xác nhận.", "Có 5 tin mới quanh Quận 7."],
  lastPayment: "ready",
  api: { mode: "mock", status: "idle" },
  auth: authSessionStore.read()
};

function loadState(): AppState {
  try {
    const stored = JSON.parse(localStorage.getItem(STORE_KEY) || "{}") as Partial<AppState>;
    return {
      ...initialState,
      ...stored,
      listings: stored.listings?.length ? stored.listings : initialState.listings,
      api: { mode: isApiConfigured() ? "remote" : "mock", status: "idle" },
      auth: authSessionStore.read() || stored.auth || null
    };
  } catch {
    return initialState;
  }
}

function reducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case "filters/set":
      return { ...state, filters: action.payload };
    case "listings/set":
      return { ...state, listings: action.payload };
    case "saved/set":
      return { ...state, saved: action.payload };
    case "saved/toggle": {
      const saved = state.saved.includes(action.payload)
        ? state.saved.filter((id) => id !== action.payload)
        : [...state.saved, action.payload];
      return { ...state, saved };
    }
    case "bookings/set":
      return { ...state, bookings: action.payload };
    case "booking/add":
      return {
        ...state,
        bookings: [action.payload, ...state.bookings],
        notifications: [`Đã gửi yêu cầu đặt lịch ${action.meta?.listingTitle || "nhà"}.`, ...state.notifications.slice(0, 4)]
      };
    case "messages/set":
      return { ...state, messages: action.payload, activeConversationId: action.meta?.conversationId };
    case "message/add":
      return { ...state, messages: [...state.messages, { from: "Bạn", body: action.payload }] };
    case "notifications/set":
      return { ...state, notifications: action.payload };
    case "payment/set":
      return { ...state, lastPayment: action.payload };
    case "otp/send":
      return { ...state, notifications: ["Mã OTP demo: 2606", ...state.notifications.slice(0, 4)] };
    case "auth/set":
      return { ...state, auth: action.payload };
    case "api/set":
      return { ...state, api: action.payload };
    default:
      return state;
  }
}

export function AppProvider({ children }: ChildrenProps) {
  const [state, dispatch] = useReducer(reducer, undefined, loadState);
  const [toast, setToast] = useState("");

  useEffect(() => {
    localStorage.setItem(STORE_KEY, JSON.stringify(state));
  }, [state]);

  useEffect(() => {
    let cancelled = false;
    async function syncRemoteState() {
      if (!isApiConfigured()) {
        dispatch({ type: "api/set", payload: { mode: "mock", status: "ready", message: "Mock data mode" } });
        return;
      }

      dispatch({ type: "api/set", payload: { mode: "remote", status: "syncing", message: "Syncing backend data" } });
      try {
        const remoteListings = await listingsService.listRemote(initialState.filters);
        if (cancelled) return;
        if (remoteListings.length) dispatch({ type: "listings/set", payload: remoteListings });

        const session = authSessionStore.read();
        if (session) {
          dispatch({ type: "auth/set", payload: session });
          const [savedIds, bookings, notifications, conversations] = await Promise.all([
            savedListingsService.idsRemote().catch(() => null),
            bookingsService.myBookingsRemote().catch(() => null),
            notificationsService.listRemote().catch(() => null),
            messagesService.conversationsRemote().catch(() => null)
          ]);
          if (cancelled) return;
          if (savedIds) dispatch({ type: "saved/set", payload: savedIds });
          if (bookings) dispatch({ type: "bookings/set", payload: bookings });
          if (notifications) dispatch({ type: "notifications/set", payload: notifications });
          const firstConversation = conversations?.[0];
          if (firstConversation) {
            const remoteMessages = await messagesService.messagesRemote(firstConversation.id, session.user.id).catch(() => null);
            if (!cancelled && remoteMessages) {
              dispatch({ type: "messages/set", payload: remoteMessages, meta: { conversationId: firstConversation.id } });
              void messagesService.markReadRemote(firstConversation.id).catch(() => undefined);
            }
          }
        }

        if (!cancelled) dispatch({ type: "api/set", payload: { mode: "remote", status: "ready", message: "Backend connected" } });
      } catch (error) {
        if (!cancelled) {
          dispatch({
            type: "api/set",
            payload: { mode: "remote", status: "error", message: error instanceof Error ? error.message : "Backend sync failed" }
          });
        }
      }
    }

    void syncRemoteState();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = window.setTimeout(() => setToast(""), 2300);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const notify = useCallback((message: string) => setToast(message), []);
  const value = useMemo(() => ({ state, dispatch, notify }), [notify, state]);

  return (
    <AppContext.Provider value={value}>
      {children}
      <div className={`toast ${toast ? "show" : ""}`} role="status">
        {toast}
      </div>
    </AppContext.Provider>
  );
}
