import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Report from "./pages/Report";
import './App.css'
import Home from "./pages/home";

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/report" element={<Report />} />
      </Routes>
    </Router>
  )
}

export default App
