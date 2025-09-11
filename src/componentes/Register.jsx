import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/login.css";
import axios from "axios";

const Register = () => {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();

    // Simulamos guardado (puedes conectar a backend después)
    const userData = { nombre, apellido, email, password };
    localStorage.setItem("registeredUser", JSON.stringify(userData));

    alert("Registro exitoso. Ahora inicia sesión.");
    navigate("/"); // 🔥 Ir al Login
  };

   //peticion a backend utilizando axios *//
   const response =  axios.post("http://localhost:3006/tareas", nombre,apellido,email,password)
    console.log(response.data) 

  return (
    <div className="login-container">
      <h2>Registrarse</h2>
      <form onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Apellido"
          value={apellido}
          onChange={(e) => setApellido(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Correo"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Registrarme</button>
      </form>
    </div>
  );
};

export default Register;
