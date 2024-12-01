import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Inicio from "./pages/inicio";
import Login from "./pages/Login";
import Admin from "./pages/admin";
import Navbar from"./componets/Navbar";
import Footer from "./componets/footer";

function App() {
  return (
    <Router>
      <div className="container">
       <Navbar/>

        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>

        <Footer/>
      </div>
    </Router>
  );
}

export default App;
