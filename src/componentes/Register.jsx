import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "../styles/Register.css";

function Register() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rol, setRol] = useState("usuario");
  const [claveAdmin, setClaveAdmin] = useState("");
  const [aceptaTerminos, setAceptaTerminos] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      Swal.fire({
        icon: "info",
        title: "Ya tienes sesión activa",
        text: "Si quieres registrarte otra vez, cierra sesión primero.",
      }).then(() => {
        if (user.rol === "administrador") {
          navigate("/admin");
        } else {
          navigate("/notas");
        }
      });
    }
  }, [navigate]);

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!nombre.trim() || !email.trim() || !password.trim()) {
      Swal.fire("Error", "Todos los campos son obligatorios.", "error");
      return;
    }

    if (!aceptaTerminos) {
      Swal.fire("Error", "Debes aceptar los términos y condiciones.", "error");
      return;
    }

    // ✔ Validación correcta de administrador
    if (rol === "administrador" && claveAdmin !== "MindNote.edu") {
      Swal.fire("Error", "La clave especial de administrador es incorrecta.", "error");
      return;
    }

    try {
      const res = await fetch("http://localhost:4000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre,
          email,
          password,
          rol,
          claveAdmin: rol === "administrador" ? claveAdmin : null,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        Swal.fire("Error", data.msg, "error");
        return;
      }

      Swal.fire("Registro exitoso", `Bienvenido ${nombre}`, "success").then(() => {
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("token", data.token);

        if (rol === "administrador") {
          navigate("/admin");
        } else {
          navigate("/notas");
        }
      });
    } catch (err) {
      Swal.fire("Error", "No se pudo conectar con el servidor.", "error");
    }
  };

  const openTerminos = (e) => {
    e.preventDefault();
    Swal.fire({
      title: "Términos y Condiciones de MindNote",
      html: `
        <p><strong>1. Aceptación:</strong> Al utilizar MindNote aceptas estos términos.</p>
        <p><strong>2. Privacidad:</strong> Tu información se almacena de forma segura.</p>
        <p><strong>3. Seguridad:</strong> Mantén tu contraseña privada.</p>
        <p><strong>4. Administrador:</strong> Requiere la clave especial correcta.</p>
      `,
      width: 600,
      confirmButtonText: "Cerrar",
    });
  };

  return (
    <div className="register-page">
      <form className="register-card" onSubmit={handleRegister}>
        <h2 className="register-title">Crear cuenta</h2>

        <label className="field-label">
          Nombre completo
          <input
            className="input"
            type="text"
            placeholder="Tu nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
        </label>

        <label className="field-label">
          Correo
          <input
            className="input"
            type="email"
            placeholder="correo@ejemplo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>

        <label className="field-label">
          Contraseña
          <input
            className="input"
            type="password"
            placeholder="********"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>

        <div className="role-row">
          <span className="role-label">Registrarme como:</span>
          <label className="role-option">
            <input
              type="radio"
              name="rol"
              value="usuario"
              checked={rol === "usuario"}
              onChange={(e) => setRol(e.target.value)}
            />
            Usuario
          </label>
          <label className="role-option">
            <input
              type="radio"
              name="rol"
              value="administrador"
              checked={rol === "administrador"}
              onChange={(e) => setRol(e.target.value)}
            />
            Administrador
          </label>
        </div>

        {rol === "administrador" && (
          <label className="field-label">
            Clave especial (administrador)
            <input
              className="input"
              type="password"
              placeholder="Clave especial"
              value={claveAdmin}
              onChange={(e) => setClaveAdmin(e.target.value)}
              required
            />
          </label>
        )}

        <label className="terms-row">
          <input
            type="checkbox"
            checked={aceptaTerminos}
            onChange={(e) => setAceptaTerminos(e.target.checked)}
          />
          <span>
            Acepto los{" "}
            <a href="#" onClick={openTerminos} className="link-terminos">
              términos y condiciones
            </a>
          </span>
        </label>

        <button className="btn-register" type="submit">
          Registrar
        </button>

        <div className="login-link">
          ¿Ya tienes cuenta? <a href="/login">Iniciar sesión</a>
        </div>
      </form>
    </div>
  );
}

export default Register;
