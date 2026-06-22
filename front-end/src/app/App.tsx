import { useAppRouter } from "./router";
import { AdminConsole } from "../features/admin/AdminConsole";
import { MobileApp } from "../features/app/MobileApp";
import { WebExperience } from "../features/web/WebExperience";
import { WebAppExperience } from "../features/web-app/WebAppExperience";

export function App() {
  const { route, navigate } = useAppRouter();

  if (route.area === "admin") return <AdminConsole route={route} navigate={navigate} />;
  if (route.area === "app" || route.area === "mobile") return <MobileApp route={route} navigate={navigate} />;
  if (route.area === "web_app") return <WebAppExperience route={route} navigate={navigate} />;
  return <WebExperience route={route} navigate={navigate} />;
}
