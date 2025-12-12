// src/contexts/HistoryContext.jsx
import { createContext } from "react";

export const HistoryContext = createContext({
  history: [],
  addHistory: () => {},
});
