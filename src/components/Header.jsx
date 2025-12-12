// src/components/Header.jsx
import { Link } from "react-router-dom";
import "../styles/components/header.css";

export default function Header() {
  return (
    <header className="header">
      <nav className="nav">
        <ul className="nav-list">
          <li>
            <Link to="/">Loading</Link>
          </li>
          <li>
            <Link to="/home">Home</Link>
          </li>
          <li>
            <Link to="/about">About</Link>
          </li>
          <li>
            <Link to="/news">News</Link>
          </li>
          <li>
            <Link to="/culture">Culture</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
