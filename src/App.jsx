import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./componentes/Navbar";
import Home from "./componentes/Home";
import Login from "./componentes/Login";
import Register from "./componentes/Register"
import Notas from "./componentes/Notas";

function App() {
  return (
    
    <Router>
      
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/notas" element={<Notas />} />
      </Routes>
    </Router>
  );
}

export default App;
