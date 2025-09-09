// src/components/Navbar.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/Navbar.css";


function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="container">
        {/* Logo */}
        <div className="logo">
          <Link to="/">
            <img src="/src/assets/logo.png" alt="Logo" />
          </Link>
        </div>

        {/* Botón hamburguesa */}
        <button
          className={`menu-btn ${isOpen ? "open" : ""}`}
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        {/* Links de navegación */}
        <ul className={`nav-links ${isOpen ? "active" : ""}`}>
          <li>
            <Link to="/" onClick={() => setIsOpen(false)}>
              Inicio
            </Link>
          </li>
          <li>
            <Link to="/login" onClick={() => setIsOpen(false)}>
              Iniciar Sesión
            </Link>
          </li>
          <li>
            <Link to="/register" onClick={() => setIsOpen(false)}>
              Registrar
            </Link>
          </li>
          <li>
            <Link to="/Notas" onClick={() => setIsOpen(false)}>
              Notas
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
