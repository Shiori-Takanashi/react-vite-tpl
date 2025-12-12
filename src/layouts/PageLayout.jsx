// src/layouts/PageLayout.jsx
import Header from "../components/Header";
import History from "../components/History";
import "../styles/pages/base.css";

export default function PageLayout({ title }) {
  return (
    <div className="main-page">
      <Header />
      <main>
        <h1 className="page-title">{title}</h1>
        <History />
      </main>
    </div>
  );
}
