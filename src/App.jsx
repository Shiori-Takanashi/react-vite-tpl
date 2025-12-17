// src/App.jsx
import "./App.css";
import { RouterProvider } from "react-router-dom";

import { HistoryProvider } from "./contexts/HistoryContext";
import { router } from "./router/Routes";

export default function App() {
  return (
    <HistoryProvider>
      <RouterProvider router={router} />
    </HistoryProvider>
  );
}
