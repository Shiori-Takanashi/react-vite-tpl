// src/router/Routes.jsx
import { createBrowserRouter, Outlet } from "react-router-dom";
import Home from "../pages/Home";
import Loading from "../pages/Loading";
import About from "../pages/About";
import News from "../pages/News";
import Culture from "../pages/Culture";
import { Tracker } from "./Tracker";

function Layout() {
  return (
    <>
      <Tracker />
      <Outlet />
    </>
  );
}

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: "/", element: <Loading /> },
      { path: "/home", element: <Home /> },
      { path: "/about", element: <About /> },
      { path: "/news", element: <News /> },
      { path: "/culture", element: <Culture /> },
    ],
  },
]);
