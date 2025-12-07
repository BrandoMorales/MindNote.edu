import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "../styles/Admin.css";

function Admin() {
  const [usuarios, setUsuarios] = useState([]);
  const navigate = useNavigate();

  // Cargar usuarios y validar admin
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user || user.rol !== "administrador") {
      Swal.fire("Acceso denegado", "Debes iniciar sesión como administrador", "error");
      navigate("/login");
      return;
    }

    obtenerUsuarios();
  }, [navigate]);

  // Obtener usuarios desde el backend
  const obtenerUsuarios = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:4000/api/auth/usuarios", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (res.ok) {
        setUsuarios(data); // ⬅ tu backend devuelve directamente el array
      } else {
        Swal.fire("Error", data.msg, "error");
      }
    } catch (error) {
      Swal.fire("Error", "No se pudo cargar la lista de usuarios.", "error");
    }
  };

  // Eliminar usuario
  const eliminarUsuario = (id) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "Esto eliminará al usuario definitivamente.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const token = localStorage.getItem("token");

          const res = await fetch(`http://localhost:4000/api/auth/usuarios/${id}`, {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          const data = await res.json();

          if (res.ok) {
            Swal.fire("Eliminado", "El usuario ha sido eliminado.", "success");
            obtenerUsuarios(); // actualizar lista
          } else {
            Swal.fire("Error", data.msg, "error");
          }
        } catch (error) {
          Swal.fire("Error", "No se pudo eliminar el usuario.", "error");
        }
      }
    });
  };

  return (
    <div className="admin-container">
      <h2>Panel de Administrador</h2>
      <p>Bienvenido, aquí puedes ver todos los usuarios registrados.</p>

      <div className="table-wrapper">
        <table className="usuarios-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Correo</th>
              <th>Rol</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.length > 0 ? (
              usuarios.map((u) => (
                <tr key={u.id}>
                  <td>{u.id}</td>
                  <td>{u.nombre}</td>
                  <td>{u.email}</td>
                  <td>{u.rol}</td>
                  <td>
                    <button className="btn-eliminar" onClick={() => eliminarUsuario(u.id)}>
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5">No hay usuarios registrados</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Admin;
