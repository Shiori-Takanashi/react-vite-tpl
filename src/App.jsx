// src/App.jsx
import "./App.css";
import { RouterProvider } from "react-router-dom";
import { router } from "./router/Routes";
import { HistoryProvider } from "./contexts/HistoryProvider";
import { Tracker } from "./router/Tracker";

export default function App() {
  return (
    <HistoryProvider>
      <RouterProvider router={router}>
        <Tracker />
      </RouterProvider>
    </HistoryProvider>
  );
}
