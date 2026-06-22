import React, { useCallback, useEffect, useMemo, useReducer, useState } from "react";
import { AppContext } from "./rentCityContext";
import type { AppAction, AppState, ChildrenProps } from "../types";

const STORE_KEY = "rentcity.production.state";

const initialState: AppState = {
  filters: { keyword: "", district: "Tất cả", budget: "Tất cả" },
  saved: ["studio-q7"],
  bookings: [
    { id: "BK-2606", listingId: "studio-q7", date: "Thứ 7, 22/06", time: "09:00 - 11:00", status: "Đã xác nhận" }
  ],
  messages: [
    { from: "Chủ nhà", body: "Mình còn lịch xem 09:00 sáng thứ 7, bạn xác nhận giúp nhé." },
    { from: "Bạn", body: "Dạ được, cho mình xin thêm phí gửi xe và tiền điện." }
  ],
  notifications: ["Lịch xem Studio Nguyễn Văn Cừ đã được xác nhận.", "Có 5 tin mới quanh Quận 7."],
  lastPayment: "ready"
};

function loadState(): AppState {
  try {
    return { ...initialState, ...JSON.parse(localStorage.getItem(STORE_KEY) || "{}") } as AppState;
  } catch {
    return initialState;
  }
}

function reducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case "filters/set":
      return { ...state, filters: action.payload };
    case "saved/toggle": {
      const saved = state.saved.includes(action.payload)
        ? state.saved.filter((id) => id !== action.payload)
        : [...state.saved, action.payload];
      return { ...state, saved };
    }
    case "booking/add":
      return {
        ...state,
        bookings: [action.payload, ...state.bookings],
        notifications: [`Đã gửi yêu cầu đặt lịch ${action.meta?.listingTitle || "nhà"}.`, ...state.notifications.slice(0, 4)]
      };
    case "message/add":
      return { ...state, messages: [...state.messages, { from: "Bạn", body: action.payload }] };
    case "payment/set":
      return { ...state, lastPayment: action.payload };
    case "otp/send":
      return { ...state, notifications: ["Mã OTP demo: 2606", ...state.notifications.slice(0, 4)] };
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
