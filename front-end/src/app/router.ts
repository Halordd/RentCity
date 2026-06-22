import { useCallback, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import type { NavigateTo, RouteInfo } from "../types";

function normalizePath(path: string): string {
  const raw = `${path || "/web"}`.replace(/^#\/?/, "/");
  return raw.startsWith("/") ? raw : `/${raw}`;
}

function routeFromPath(pathname: string, hash: string): RouteInfo {
  const hashRoute = hash.replace(/^#\/?/, "");
  const pathRoute = pathname.replace(/^\/+|\/+$/g, "");
  const parts = (hashRoute || pathRoute || "web").split("/");

  return {
    area: parts[0] || "web",
    path: parts[1],
    id: parts[2],
    parts
  };
}

export function useAppRouter(): { route: RouteInfo; navigate: NavigateTo } {
  const location = useLocation();
  const routerNavigate = useNavigate();

  const navigate = useCallback<NavigateTo>(
    (path) => {
      routerNavigate(normalizePath(path));
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    },
    [routerNavigate]
  );

  return useMemo(
    () => ({
      route: routeFromPath(location.pathname, location.hash),
      navigate
    }),
    [location.hash, location.pathname, navigate]
  );
}
