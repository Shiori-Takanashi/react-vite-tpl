// src/router/Tracker.jsx
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useHistory } from "../hooks/useHistory";

export function Tracker() {
  const location = useLocation();
  const { addHistory } = useHistory();

  useEffect(() => {
    addHistory(location.pathname);
  }, [addHistory, location.pathname]);

  return null;
}
