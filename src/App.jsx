import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./componentes/Navbar";
import Home from "./componentes/Home";
import Login from "./componentes/Login";
import Register from "./componentes/Register";
import Notas from "./componentes/Notas";
import Footer from "./componentes/Footer";
import AccessibilityPanel from "./componentes/AccessibilityPanel";
import Admin from "./componentes/Admin";
import ForgotPassword from "./componentes/ForgotPasword";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/notas" element={<Notas />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Routes>
      <Footer />
      <AccessibilityPanel />
    </>
  );
}

export default App;
