import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./componentes/Navbar";
import Home from "./componentes/Home";
import Login from "./componentes/Login";
import Register from "./componentes/Register"
import Notas from "./componentes/Notas";
import Footer from "./componentes/Footer";
import AccessibilityPanel from "./componentes/Accessibilitypanel";
import Admin from "./componentes/Admin";
function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/Notas" element={<Notas />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin" element={<Admin/>}/>
      </Routes>
      <Footer />
      {/* 🔥 Panel de accesibilidad GLOBAL */}
      <AccessibilityPanel />
    </Router>
  );
}
export default App;
