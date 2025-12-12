// src/pages/Culture.jsx
import Header from "../components/Header";
import History from "../components/History";
import "../styles/base-pages.css";

export default function Culture() {
  return (
    <div className="main-page culture-theme">
      <Header />
      <main>
        <h1 className="page-title">culture</h1>
        <History />
      </main>
    </div>
  );
}
