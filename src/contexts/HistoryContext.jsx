/* eslint-disable react-refresh/only-export-components */
// src/contexts/HistoryContext.jsx
import { createContext, useState, useCallback, useContext } from "react";

// Context作成
const HistoryContext = createContext({
  history: [],
  addHistory: () => { },
});

// Provider
export function HistoryProvider({ children }) {
  const [history, setHistory] = useState([]);

  const addHistory = useCallback((path) => {
    setHistory((prev) => {
      // 直前のパスと同じ場合は追加しない（重複防止）
      if (prev.length > 0 && prev[prev.length - 1] === path) {
        return prev;
      }
      return [...prev, path];
    });
  }, []);

  return (
    <HistoryContext.Provider value={{ history, addHistory }}>
      {children}
    </HistoryContext.Provider>
  );
}

// Custom Hook
export function useHistory() {
  return useContext(HistoryContext);
}
