// src/layouts/MainLayout.jsx
import { Outlet } from "react-router-dom";
import Tracker from "../components/Tracker";

export default function MainLayout() {
  return (
    <>
      <Tracker />
      <Outlet />
    </>
  );
}
