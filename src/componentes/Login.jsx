import React, { useEffect, useState } from "react";
import "../styles/login.css";
import { useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // 🚫 Evitar que un usuario logueado vuelva a entrar aquí
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      Swal.fire({
        icon: "info",
        title: "Ya tienes sesión activa",
        text: `Ya has iniciado sesión como ${user.rol}.`
      }).then(() => {
        if (user.rol === "administrador") {
          navigate("/admin");
        } else {
          navigate("/notas");
        }
      });
    }
  }, [navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const registeredUsers =
      JSON.parse(localStorage.getItem("registeredUsers")) || [];

    const user = registeredUsers.find(
      (u) => u.email === email && u.password === password
    );

    if (user) {
      // Guardar sesión activa
      localStorage.setItem("user", JSON.stringify(user));

      Swal.fire({
        icon: "success",
        title: `Bienvenido, ${user.nombre}`,
        text: `Has iniciado como ${user.rol}.`,
        showConfirmButton: false,
        timer: 2000,
      }).then(() => {
        if (user.rol === "administrador") {
          navigate("/admin");
        } else {
          navigate("/notas");
        }
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "Credenciales incorrectas",
        text: "Verifica tu correo y contraseña",
      });
    }
  };

  return (
    <div className="login-container">
      <h2>Iniciar Sesión</h2>
      <form onSubmit={handleSubmit}>
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
        <button type="submit">Entrar</button>
      </form>
      <p>
        ¿No tienes cuenta? <Link to="/register">Regístrate aquí</Link>
      </p>
    </div>
  );
};

export default Login;
