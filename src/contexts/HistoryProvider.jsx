// src/contexts/HistoryProvider.jsx
import { useState } from "react";
import { HistoryContext } from "./HistoryContext";

export function HistoryProvider({ children }) {
  const [history, setHistory] = useState([]);

  const addHistory = (path) => {
    setHistory((prev) => [...prev, path]);
  };

  return (
    <HistoryContext.Provider value={{ history, addHistory }}>
      {children}
    </HistoryContext.Provider>
  );
}
