// src/router/Routes.jsx
import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home";
import Loading from "../pages/Loading";
import About from "../pages/About";
import News from "../pages/News";
import Culture from "../pages/Culture";

export const router = createBrowserRouter([
  { path: "/", element: <Loading /> },
  { path: "/home", element: <Home /> },
  { path: "/about", element: <About /> },
  { path: "/news", element: <News /> },
  { path: "/culture", element: <Culture /> },
]);
