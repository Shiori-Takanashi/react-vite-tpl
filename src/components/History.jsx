// src/components/History.jsx
import { useHistory } from "../hooks/useHistory";
import "../styles/history.css";

export default function History() {
  const { history } = useHistory();

  return (
    <div>
      <ul>
        {history.map((path, index) => (
          <li key={index}>{path}</li>
        ))}
      </ul>
    </div>
  );
}
