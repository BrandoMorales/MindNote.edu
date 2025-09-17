import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "../styles/Admin.css";

function Admin() {
  const [usuarios, setUsuarios] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    // 🚫 Si no hay sesión activa o no es admin
    if (!user || user.rol !== "administrador") {
      Swal.fire("Acceso denegado", "Debes iniciar sesión como administrador", "error");
      navigate("/login");
      return;
    }

    // 📥 Cargar lista de usuarios
    const registrados = JSON.parse(localStorage.getItem("registeredUsers")) || [];
    setUsuarios(registrados);
  }, [navigate]);

  return (
    <div className="admin-container">
      <h2>Panel de Administrador</h2>
      <p>Bienvenido, aquí puedes ver todos los usuarios registrados.</p>

      <table className="usuarios-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Correo</th>
            <th>Rol</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.length > 0 ? (
            usuarios.map((u, index) => (
              <tr key={index}>
                <td>{u.nombre}</td>
                <td>{u.email}</td>
                <td>{u.rol}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3">No hay usuarios registrados</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Admin;
