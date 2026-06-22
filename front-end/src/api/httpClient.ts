const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

async function request<T>(path: string, options: RequestInit = {}): Promise<T | null> {
  if (!API_BASE_URL) {
    throw new Error("Backend API is not configured. Set VITE_API_BASE_URL when backend is ready.");
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options
  });

  if (!response.ok) {
    throw new Error(`API ${response.status}: ${response.statusText}`);
  }

  return response.status === 204 ? null : (response.json() as Promise<T>);
}

export const http = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body: unknown) => request<T>(path, { method: "POST", body: JSON.stringify(body) }),
  patch: <T>(path: string, body: unknown) => request<T>(path, { method: "PATCH", body: JSON.stringify(body) }),
  delete: <T>(path: string) => request<T>(path, { method: "DELETE" })
};
