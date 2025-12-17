import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

import { useHistory } from "../contexts/HistoryContext";

export default function Tracker() {
  const location = useLocation();
  const { addHistory } = useHistory();
  const isInitialMount = useRef(true);
  const shouldSkipNext = useRef(false);

  useEffect(() => {
    // StrictMode の2回目の実行をスキップ
    if (shouldSkipNext.current) {
      shouldSkipNext.current = false;
      return;
    }

    addHistory(location.pathname);

    // 初回マウント時のみクリーンアップで次回をスキップ
    return () => {
      if (isInitialMount.current) {
        shouldSkipNext.current = true;
        isInitialMount.current = false;
      }
    };
  }, [location.pathname, addHistory]);

  return null;
}
