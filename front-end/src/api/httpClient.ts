import type { AuthSession } from "../types";

const API_BASE_URL = String(import.meta.env.VITE_API_BASE_URL || "").replace(/\/+$/, "");
const AUTH_STORE_KEY = "rentcity.auth.session";

interface ApiEnvelope<T> {
  data: T;
  meta?: Record<string, unknown>;
}

interface HttpOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
  query?: Record<string, boolean | number | string | null | undefined>;
  retryOnUnauthorized?: boolean;
}

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly payload?: unknown
  ) {
    super(message);
  }
}

export function isApiConfigured(): boolean {
  return Boolean(API_BASE_URL);
}

export function getApiBaseUrl(): string {
  return API_BASE_URL;
}

export function resolveApiAssetUrl(url?: string | null): string | undefined {
  if (!url) return undefined;
  if (/^https?:\/\//i.test(url) || url.startsWith("data:") || url.startsWith("blob:")) return url;
  if (!API_BASE_URL) return url;
  return `${API_BASE_URL}${url.startsWith("/") ? url : `/${url}`}`;
}

export const authSessionStore = {
  read(): AuthSession | null {
    try {
      const raw = window.localStorage.getItem(AUTH_STORE_KEY);
      return raw ? (JSON.parse(raw) as AuthSession) : null;
    } catch {
      return null;
    }
  },
  write(session: AuthSession): void {
    window.localStorage.setItem(AUTH_STORE_KEY, JSON.stringify(session));
  },
  clear(): void {
    window.localStorage.removeItem(AUTH_STORE_KEY);
  }
};

function buildUrl(path: string, query?: HttpOptions["query"]): string {
  if (!API_BASE_URL) {
    throw new ApiError("Backend API is not configured. Set VITE_API_BASE_URL.", 0);
  }

  const url = new URL(`${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`);
  Object.entries(query || {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") url.searchParams.set(key, String(value));
  });
  return url.toString();
}

async function parseResponsePayload(response: Response): Promise<unknown> {
  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

async function refreshAuthSession(): Promise<AuthSession | null> {
  const session = authSessionStore.read();
  if (!session?.refreshToken || !API_BASE_URL) return null;

  const response = await fetch(buildUrl("/auth/refresh"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken: session.refreshToken })
  });
  if (!response.ok) {
    authSessionStore.clear();
    return null;
  }

  const payload = (await parseResponsePayload(response)) as ApiEnvelope<AuthSession> | AuthSession;
  const nextSession = "data" in payload ? payload.data : payload;
  authSessionStore.write(nextSession);
  return nextSession;
}

async function request<T>(path: string, options: HttpOptions = {}): Promise<T> {
  const { body, headers, query, retryOnUnauthorized = true, ...fetchOptions } = options;
  const session = authSessionStore.read();
  const response = await fetch(buildUrl(path, query), {
    ...fetchOptions,
    headers: {
      "Content-Type": "application/json",
      ...(session?.accessToken ? { Authorization: `${session.tokenType || "Bearer"} ${session.accessToken}` } : {}),
      ...(headers || {})
    },
    body: body === undefined ? undefined : JSON.stringify(body)
  });

  if (response.status === 401 && retryOnUnauthorized) {
    const nextSession = await refreshAuthSession();
    if (nextSession) return request<T>(path, { ...options, retryOnUnauthorized: false });
  }

  const payload = await parseResponsePayload(response);
  if (!response.ok) {
    const message =
      typeof payload === "object" && payload && "error" in payload
        ? String((payload as { error?: { message?: unknown } }).error?.message || response.statusText)
        : response.statusText;
    throw new ApiError(message, response.status, payload);
  }

  if (response.status === 204 || payload === null) return null as T;
  return (typeof payload === "object" && payload && "data" in payload ? (payload as ApiEnvelope<T>).data : payload) as T;
}

export const http = {
  get: <T>(path: string, query?: HttpOptions["query"]) => request<T>(path, { method: "GET", query }),
  post: <T>(path: string, body?: unknown) => request<T>(path, { method: "POST", body }),
  patch: <T>(path: string, body?: unknown) => request<T>(path, { method: "PATCH", body }),
  delete: <T>(path: string) => request<T>(path, { method: "DELETE" })
};
