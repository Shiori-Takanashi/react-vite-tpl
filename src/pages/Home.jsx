// src/pages/Home.jsx
import Header from "../components/Header";
import History from "../components/History";
import "../styles/base-pages.css";

export default function Home() {
  return (
    <div className="main-page home-theme">
      <Header />
      <main>
        <h1 className="page-title">home</h1>
        <History />
      </main>
    </div>
  );
}
