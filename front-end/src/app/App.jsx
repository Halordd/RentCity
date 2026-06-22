import { useAppRouter } from "./router.js";
import { AdminConsole } from "../features/admin/AdminConsole.jsx";
import { MobileApp } from "../features/app/MobileApp.jsx";
import { WebExperience } from "../features/web/WebExperience.jsx";
import { WebAppExperience } from "../features/web-app/WebAppExperience.jsx";

export function App() {
  const { route, navigate } = useAppRouter();

  if (route.area === "admin") return <AdminConsole route={route} navigate={navigate} />;
  if (route.area === "app" || route.area === "mobile") return <MobileApp route={route} navigate={navigate} />;
  if (route.area === "web_app") return <WebAppExperience route={route} navigate={navigate} />;
  return <WebExperience route={route} navigate={navigate} />;
}
