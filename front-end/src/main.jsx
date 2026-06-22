import React from "react";
import { createRoot } from "react-dom/client";
import { App } from "./app/App.jsx";
import { AppProvider } from "./app/AppProvider.jsx";
import "./styles.css";

createRoot(document.getElementById("app")).render(
  <React.StrictMode>
    <AppProvider>
      <App />
    </AppProvider>
  </React.StrictMode>
);
