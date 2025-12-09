import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Top from "./pages/Top";
import Home from "./pages/Home"; // 新規に必要

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Top />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
