export function money(value: number): string {
  return `${value.toLocaleString("vi-VN")}tr/tháng`;
}

export function escapeHtml(value: unknown): string {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export function routeParts(): string[] {
  const hashRoute = window.location.hash.replace(/^#\/?/, "");
  const pathRoute = window.location.pathname.replace(/^\/+|\/+$/g, "");
  const raw = hashRoute || pathRoute;
  return raw ? raw.split("/") : ["web"];
}
