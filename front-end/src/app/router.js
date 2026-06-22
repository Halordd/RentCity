import { useCallback, useEffect, useMemo, useState } from "react";

function normalizePath(path) {
  const raw = `${path || "/web"}`.replace(/^#\/?/, "/");
  return raw.startsWith("/") ? raw : `/${raw}`;
}

function readRoute() {
  const hashRoute = window.location.hash.replace(/^#\/?/, "");
  const pathRoute = window.location.pathname.replace(/^\/+|\/+$/g, "");
  const parts = (hashRoute || pathRoute || "web").split("/");
  return {
    area: parts[0],
    path: parts[1],
    id: parts[2],
    parts
  };
}

export function useAppRouter() {
  const [route, setRoute] = useState(readRoute);

  useEffect(() => {
    const sync = () => setRoute(readRoute());
    window.addEventListener("popstate", sync);
    window.addEventListener("hashchange", sync);
    return () => {
      window.removeEventListener("popstate", sync);
      window.removeEventListener("hashchange", sync);
    };
  }, []);

  const navigate = useCallback((path) => {
    window.history.pushState({}, "", normalizePath(path));
    setRoute(readRoute());
    window.scrollTo?.(0, 0);
  }, []);

  return useMemo(() => ({ route, navigate }), [navigate, route]);
}
