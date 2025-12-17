// src/components/Header.jsx
import { Link, useLocation } from "react-router-dom";

import { useHistory } from "../contexts/HistoryContext";
import "../styles/components/header.css";

export default function Header() {
  const { addHistory } = useHistory();
  const location = useLocation();

  const handleLinkClick = (path) => {
    // 同じページへのクリックの場合のみ記録（連打対応）
    // 異なるページへの遷移は Tracker が記録する
    if (location.pathname === path) {
      addHistory(path);
    }
  };

  return (
    <header className="header">
      <nav className="nav">
        <ul className="nav-list">
          <li>
            <Link to="/" onClick={() => handleLinkClick("/")}>
              Loading
            </Link>
          </li>
          <li>
            <Link to="/home" onClick={() => handleLinkClick("/home")}>
              Home
            </Link>
          </li>
          <li>
            <Link to="/about" onClick={() => handleLinkClick("/about")}>
              About
            </Link>
          </li>
          <li>
            <Link to="/news" onClick={() => handleLinkClick("/news")}>
              News
            </Link>
          </li>
          <li>
            <Link to="/culture" onClick={() => handleLinkClick("/culture")}>
              Culture
            </Link>
          </li>
          <li>
            <Link to="/outlet" onClick={() => handleLinkClick("/outlet")}>
              Outlet
            </Link>
          </li>
          <li>
            <Link to="/children" onClick={() => handleLinkClick("/children")}>
              Children
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
