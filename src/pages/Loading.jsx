// src/pages/Loading.jsx
import cat from "../assets/cat.svg";
import tiger from "../assets/tiger.svg";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/loading.css";

export default function Loading() {
  const animal = import.meta.env.DEV ? cat : tiger;
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/home");
    }, 3000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="loading-page">
      <div className="loading-container">
        {/* ロゴ */}
        <div className="logo-container">
          <img src={animal} alt="Logo" className="logo" />
        </div>

        <h2 className="loading-text">Loading...</h2>
        <p className="loading-description">
          アプリケーションを読み込んでいます...
          <br />
          しばらくお待ちください
        </p>

        <div className="dots-container">
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
        </div>
      </div>
    </div>
  );
}
