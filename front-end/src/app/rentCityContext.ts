import { createContext } from "react";
import type { RentCityContextValue } from "../types";

export const AppContext = createContext<RentCityContextValue | null>(null);
