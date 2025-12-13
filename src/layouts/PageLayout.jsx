// src/layouts/PageLayout.jsx
import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import History from "../components/History";
import "../styles/pages/base.css";

export default function PageLayout({ title, children }) {
  return (
    <div className="main-page">
      <Header />
      <main>
        <h1 className="page-title">{title}</h1>
        {children || <Outlet />}
        <History />
      </main>
    </div>
  );
}
