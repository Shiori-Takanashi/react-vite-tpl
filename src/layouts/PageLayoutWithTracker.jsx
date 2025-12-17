// src/layouts/PageLayoutWithTracker.jsx
import Header from "../components/Header";
import History from "../components/History";
import Tracker from "../router/Tracker";
import "../styles/layouts/pagelayout.css";
import "../styles/pages/pages.css";

export default function PageLayoutWithTracker({ title }) {
  return (
    <div className="main-page">
      <Tracker />
      <Header />
      <main>
        <h1 className="page-title">{title}</h1>
        <History />
      </main>
    </div>
  );
}
