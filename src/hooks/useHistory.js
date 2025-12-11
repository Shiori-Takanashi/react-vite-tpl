// src/hooks/useHistory.js
import { useContext } from "react";
import { HistoryContext } from "../contexts/HistoryContext";

export function useHistory() {
  return useContext(HistoryContext);
}
