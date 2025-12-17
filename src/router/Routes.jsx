// src/router/Routes.jsx
import { createBrowserRouter } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";
import PageLayoutWithTracker from "../layouts/PageLayoutWithTracker";
import About from "../pages/About";
import Culture from "../pages/Culture";
import DoubleWrapperWithChildren from "../pages/DoubleWrapperWithChildren";
import DoubleWrapperWithOutlet from "../pages/DoubleWrapperWithOutlet";
import Home from "../pages/Home";
import Loading from "../pages/Loading";
import News from "../pages/News";

export const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      { path: "/", element: <Loading /> },
      { path: "/home", element: <Home /> },
      { path: "/about", element: <About /> },
      { path: "/news", element: <News /> },
      { path: "/culture", element: <Culture /> },
      {
        path: "/",
        element: <PageLayoutWithTracker />,
        children: [
          { path: "/children", element: <DoubleWrapperWithChildren /> },
          { path: "/outlet", element: <DoubleWrapperWithOutlet /> },
        ],
      },
    ],
  },
]);
