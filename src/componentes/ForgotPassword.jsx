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
      const stored = JSON.parse(localStorage.getItem("passwordResetToken"));
      if (
        stored &&
        stored.email === emailParam &&
        stored.token === token &&
        stored.expiry > Date.now()
      ) {
        setEmail(emailParam);
        setTokenValid(true);
      }
    }
  }, [location]);

  // 📤 Enviar correo de recuperación
  const handleSendLink = async () => {
    const users = JSON.parse(localStorage.getItem("registeredUsers")) || [];
    const user = users.find((u) => u.email === email.trim());

    if (!email.trim()) {
      Swal.fire("Error", "Por favor ingresa tu correo.", "error");
      return;
    }

    if (!user) {
      Swal.fire("Error", "Este correo no está registrado.", "error");
      return;
    }

    // Generar token único (válido por 10 minutos)
    const token = Math.random().toString(36).substring(2, 15);
    const expiry = Date.now() + 10 * 60 * 1000;

    localStorage.setItem(
      "passwordResetToken",
      JSON.stringify({ email, token, expiry })
    );

    // Enlace al reset
    const resetLink = `https://brandomorales.github.io/MindNote.edu/forgot-password?email=${encodeURIComponent(email)}&token=${token}`;

    // ⚙️ Parámetros que usará tu plantilla en EmailJS
    const templateParams = {
      to_name: user.nombre || "usuario",
      to_email: email, // 👈 Este debe coincidir con {{to_email}} en tu plantilla
      reset_link: resetLink,
    };

    try {
      await emailjs.send(
        "MindNote.edu", // ✅ Service ID
        "MindNote.edu2", // ✅ Template ID
        templateParams,
        "URWPWZMh6HXD6s8sJ" // ✅ Public Key
      );

      Swal.fire(
        "Correo enviado ✅",
        "Te hemos enviado un enlace de recuperación. Revisa tu bandeja o carpeta de spam.",
        "success"
      );
    } catch (error) {
      console.error("Error al enviar correo:", error);
      Swal.fire(
        "Error",
        "No se pudo enviar el correo: " + (error.text || error.message),
        "error"
      );
    }
  };

  // 🔑 Cambiar contraseña desde el enlace
  const handleChangePassword = () => {
    const stored = JSON.parse(localStorage.getItem("passwordResetToken"));

    if (!stored || stored.email !== email || stored.expiry < Date.now()) {
      Swal.fire("Error", "El enlace ha expirado o no es válido.", "error");
      return;
    }

    const users = JSON.parse(localStorage.getItem("registeredUsers")) || [];
    const index = users.findIndex((u) => u.email === email);

    if (index !== -1) {
      users[index].password = newPassword;
      localStorage.setItem("registeredUsers", JSON.stringify(users));
      localStorage.removeItem("passwordResetToken");

      Swal.fire("Éxito 🎉", "Tu contraseña fue cambiada correctamente.", "success").then(
        () => navigate("/login")
      );
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
