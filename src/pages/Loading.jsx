// src/pages/Loading.jsx
import cat from "../assets/cat.svg";
import tiger from "../assets/tiger.svg";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/pages/loading.css";

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
        <h1 className="loading-title">Welcome</h1>
        <div className="logo-container">
          <img src={animal} alt="Loading animal" className="logo" />
        </div>
        <p className="loading-text">Loading...</p>
        <div className="dots-container">
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
        </div>
      </div>
    </div>
  );
}
