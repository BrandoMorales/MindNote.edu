import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "../styles/Register.css"; // ajusta la ruta si hace falta


function Register() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rol, setRol] = useState("usuario"); // por defecto usuario
  const [claveAdmin, setClaveAdmin] = useState("");
  const [aceptaTerminos, setAceptaTerminos] = useState(false);

  const navigate = useNavigate();

  // 🚫 Evitar que un usuario logueado vuelva a entrar aquí
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      Swal.fire({
        icon: "info",
        title: "Ya tienes sesión activa",
        text: "Si quieres registrarte otra vez cierra sesión primero."
      }).then(() => {
        if (user.rol === "administrador") {
          navigate("/admin");
        } else {
          navigate("/notas");
        }
      });
    }
  }, [navigate]);

  const handleRegister = (e) => {
    e.preventDefault();

    // Validaciones básicas
    if (!nombre.trim() || !email.trim() || !password.trim()) {
      Swal.fire("Error", "Todos los campos son obligatorios.", "error");
      return;
    }

    if (!aceptaTerminos) {
      Swal.fire("Error", "Debes aceptar los términos y condiciones.", "error");
      return;
    }

    if (rol === "administrador" && claveAdmin !== "MindNote.edu") {
      Swal.fire(
        "Error",
        "La clave especial de administrador es incorrecta.",
        "error"
      );
      return;
    }

    // Verificar si el correo ya existe
    const registeredUsers =
      JSON.parse(localStorage.getItem("registeredUsers")) || [];

    if (registeredUsers.some((u) => u.email === email)) {
      Swal.fire("Error", "Este correo ya está registrado.", "error");
      return;
    }

    // Guardar usuario
    const newUser = {
      nombre: nombre.trim(),
      email: email.trim(),
      password: password.trim(),
      rol,
    };

    registeredUsers.push(newUser);
    localStorage.setItem("registeredUsers", JSON.stringify(registeredUsers));
    localStorage.setItem("user", JSON.stringify(newUser));

    Swal.fire("Registro exitoso", `Bienvenido ${nombre}`, "success").then(() => {
      if (rol === "administrador") {
        navigate("/admin");
      } else {
        navigate("/notas");
      }
    });
  };

  const openTerminos = (e) => {
    e.preventDefault();
    Swal.fire({
      title: "Términos y Condiciones",
      html:
        "<p>Al registrarte aceptas los términos y condiciones de Mindnote. Aquí puedes poner los términos reales o un enlace a la política de privacidad.</p>",
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
              required={rol === "administrador"}
            />
            <small className="hint">
              Introduce la clave especial para registrar administradores.
            </small>
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
