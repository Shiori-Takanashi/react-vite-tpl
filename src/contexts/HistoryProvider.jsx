// src/contexts/HistoryProvider.jsx
import { useState } from "react";
import { HistoryContext } from "./HistoryContext";

export function HistoryProvider({ children }) {
  const [history, setHistory] = useState([]);

  return (
    <HistoryContext.Provider value={{ history, setHistory }}>
      {children}
    </HistoryContext.Provider>
  );
}
