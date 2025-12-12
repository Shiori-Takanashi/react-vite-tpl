// src/pages/News.jsx
import Header from "../components/Header";
import History from "../components/History";
import "../styles/base-pages.css";

export default function News() {
  return (
    <div className="main-page news-theme">
      <Header />
      <main>
        <h1 className="page-title">news</h1>
        <History />
      </main>
    </div>
  );
}
