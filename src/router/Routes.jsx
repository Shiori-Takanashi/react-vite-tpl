// src/router/Routes.jsx
import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import PageLayout from "../layouts/PageLayout";
import Loading from "../pages/Loading";
import Home from "../pages/Home";
import About from "../pages/About";
import News from "../pages/News";
import Culture from "../pages/Culture";
import Demo from "../pages/Demo";

export const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      { path: "/", element: <Loading /> },
      { path: "/home", element: <Home /> },
      { path: "/about", element: <About /> },
      { path: "/news", element: <News /> },
      { path: "/culture", element: <Culture /> },
    ],
  },
  {
    path: "/demo",
    element: (
      <MainLayout>
        <PageLayout />
      </MainLayout>
    ),
    children: [{ index: true, element: <Demo /> }],
  },
]);
