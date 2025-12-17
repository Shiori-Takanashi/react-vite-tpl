// src/layouts/PageLayout.jsx
import Header from "../components/Header";
import History from "../components/History";
import "../styles/layouts/pagelayout.css";
import "../styles/pages/pages.css";

export default function PageLayout({ title }) {
  return (
    <div className="page">
      <Header />
      <main className="content">
        <div className="page-title-container">
          <h1 className="page-title">{title}</h1>
        </div>
        <div className="history-wrap">
          <div className="history-container">
            <History />
          </div>
        </div>
      </main>
    </div>
  );
}
