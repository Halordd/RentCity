export function money(value) {
  return `${value.toLocaleString("vi-VN")}tr/tháng`;
}

export function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export function routeParts() {
  const hashRoute = window.location.hash.replace(/^#\/?/, "");
  const pathRoute = window.location.pathname.replace(/^\/+|\/+$/g, "");
  const raw = hashRoute || pathRoute;
  return raw ? raw.split("/") : ["web"];
}
