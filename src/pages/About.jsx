// src/pages/About.jsx
import Header from "../components/Header";
import History from "../components/History";
import "../styles/base-pages.css";

export default function About() {
  return (
    <div className="main-page about-theme">
      <Header />
      <main>
        <h1 className="page-title">about</h1>
        <History />
      </main>
    </div>
  );
}
