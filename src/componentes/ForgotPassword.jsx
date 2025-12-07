import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import emailjs from "emailjs-com";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/Login.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [tokenValid, setTokenValid] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // 🔍 Verificar si hay token en el enlace
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const emailParam = params.get("email");
    const token = params.get("token");

    if (emailParam && token) {
      setEmail(emailParam);
      setTokenValid(true);
    }
  }, [location]);

  // 📤 Enviar correo con token desde el backend
  const handleSendLink = async () => {
    if (!email.trim()) {
      Swal.fire("Error", "Por favor ingresa tu correo.", "error");
      return;
    }

    try {
      const res = await fetch("http://localhost:4000/api/auth/forgot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        Swal.fire("Error", data.msg, "error");
        return;
      }

      const token = data.token;

      // Enlace para GitHub Pages usando HashRouter
      const resetLink = `https://brandomorales.github.io/MindNote.edu/#/forgot-password?email=${encodeURIComponent(
        email
      )}&token=${token}`;

      // EmailJS (NO SE CAMBIÓ NADA)
      const templateParams = {
        to_name: "Usuario",
        to_email: email,
        reset_link: resetLink,
      };

      await emailjs.send(
        "MindNote.edu",
        "MindNote.edu2",
        templateParams,
        "6vIfd7D5Dltyqq_MO"
      );

      Swal.fire(
        "Correo enviado ✅",
        "Te hemos enviado un enlace de recuperación.",
        "success"
      );
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "No se pudo enviar el enlace.", "error");
    }
  };

  // 🔑 Cambiar contraseña usando el backend
  const handleChangePassword = async () => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");

    if (!newPassword.trim()) {
      Swal.fire("Error", "Debes ingresar una nueva contraseña.", "error");
      return;
    }

    try {
      const res = await fetch("http://localhost:4000/api/auth/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, token, newPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        Swal.fire("Error", data.msg, "error");
        return;
      }

      Swal.fire(
        "Éxito 🎉",
        "Tu contraseña ha sido actualizada correctamente.",
        "success"
      ).then(() => navigate("/login"));
    } catch (error) {
      Swal.fire("Error", "No se pudo cambiar la contraseña.", "error");
    }
  };

  return (
    <div className="login-container">
      {!tokenValid ? (
        <>
          <h2>Recuperar Contraseña</h2>
          <input
            type="email"
            placeholder="Tu correo registrado"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button onClick={handleSendLink}>Enviar enlace</button>
        </>
      ) : (
        <>
          <h2>Restablecer Contraseña</h2>
          <p>
            Correo: <b>{email}</b>
          </p>
          <input
            type="password"
            placeholder="Nueva contraseña"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <button onClick={handleChangePassword}>Cambiar contraseña</button>
        </>
      )}
    </div>
  );
};

export default ForgotPassword;
