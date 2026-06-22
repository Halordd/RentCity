import { useContext } from "react";
import { AppContext } from "./rentCityContext";

export function useRentCity() {
  const context = useContext(AppContext);
  if (!context) throw new Error("useRentCity must be used inside AppProvider");
  return context;
}
