// src/router/Routes.jsx
import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home";
import Loading from "../pages/Loading";

export const router = createBrowserRouter([
  { path: "/", element: <Loading /> },
  { path: "/home", element: <Home /> },
]);
