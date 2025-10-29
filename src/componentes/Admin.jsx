import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "../styles/Admin.css";


function Admin() {
  const [usuarios, setUsuarios] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user || user.rol !== "administrador") {
      Swal.fire("Acceso denegado", "Debes iniciar sesión como administrador", "error");
      navigate("/login");
      return;
    }

    const registrados = JSON.parse(localStorage.getItem("registeredUsers")) || [];
    setUsuarios(registrados);
  }, [navigate]);

  const eliminarUsuario = (email) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: `Vas a eliminar al usuario con correo: ${email}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        const nuevosUsuarios = usuarios.filter((u) => u.email !== email);
        localStorage.setItem("registeredUsers", JSON.stringify(nuevosUsuarios));

        const currentUser = JSON.parse(localStorage.getItem("user"));
        if (currentUser && currentUser.email === email) {
          localStorage.removeItem("user");
          Swal.fire("Usuario eliminado", "Tu sesión ha sido cerrada.", "info");
          navigate("/login");
          return;
        }

        setUsuarios(nuevosUsuarios);
        Swal.fire("Eliminado", "El usuario ha sido eliminado correctamente.", "success");
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
              <th>Nombre</th>
              <th>Correo</th>
              <th>Rol</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.length > 0 ? (
              usuarios.map((u, index) => (
                <tr key={index}>
                  <td>{u.nombre}</td>
                  <td>{u.email}</td>
                  <td>{u.rol}</td>
                  <td>
                    <button
                      className="btn-eliminar"
                      onClick={() => eliminarUsuario(u.email)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4">No hay usuarios registrados</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Admin;

