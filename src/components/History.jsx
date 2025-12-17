// src/components/History.jsx
import { useHistory } from "../contexts/HistoryContext";
import "../styles/components/history.css";

export default function History() {
  const { history } = useHistory();

  return (
    <ul className="history-content">
      {history.map((path, index) => (
        <li className="history-line" key={index}>
          {path}
        </li>
      ))}
    </ul>
  );
}
