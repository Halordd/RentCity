import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { App } from "./app/App";
import { AppProvider } from "./app/AppProvider";
import "./styles.css";

const root = document.getElementById("app");

if (!root) {
  throw new Error("RentCity root element was not found.");
}

createRoot(root).render(
  <React.StrictMode>
    <BrowserRouter>
      <AppProvider>
        <App />
      </AppProvider>
    </BrowserRouter>
  </React.StrictMode>
);
