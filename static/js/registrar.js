document.getElementById("formRegistro").addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = {
    nombre: document.getElementById("nombre").value,
    apellido: document.getElementById("apellido").value,
    email: document.getElementById("email").value,
    password: document.getElementById("password").value,
  };

  const res = await fetch("http://localhost:3000/api/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const result = await res.json();
  alert(result.message);
});

function registrarUsuario(nombre, correo, password) {
  let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

  // Verificar si el correo ya está registrado
  const existe = usuarios.find(u => u.correo === correo);
  if (existe) {
    alert("Este correo ya está registrado. Intenta con otro.");
    return false;
  }

  // Crear nuevo usuario
  usuarios.push({ nombre, correo, password });
  localStorage.setItem("usuarios", JSON.stringify(usuarios));
  alert("Registro exitoso 🎉 Ahora puedes iniciar sesión.");
  window.location.href = "login.html";
  return true;
}

// Iniciar sesión
function iniciarSesion(correo, password) {
  let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
  const usuario = usuarios.find(u => u.correo === correo && u.password === password);

  if (usuario) {
    localStorage.setItem("usuarioActivo", JSON.stringify(usuario));
    alert(`Bienvenido ${usuario.nombre} 👋`);
    window.location.href = "dashboard.html"; // página después del login
  } else {
    alert("Correo o contraseña incorrectos ❌");
  }
}

// Cerrar sesión
function cerrarSesion() {
  localStorage.removeItem("usuarioActivo");
  window.location.href = "login.html";
}

// =====================
// Eventos formularios
// =====================
document.addEventListener("DOMContentLoaded", () => {
  // Página de registro
  const formRegistro = document.querySelector("#formRegistro");
  if (formRegistro) {
    formRegistro.addEventListener("submit", e => {
      e.preventDefault();
      const nombre = document.querySelector("#nombre").value.trim();
      const correo = document.querySelector("#correo").value.trim();
      const password = document.querySelector("#password").value.trim();

      if (!nombre || !correo || !password) {
        alert("Todos los campos son obligatorios ⚠️");
        return;
      }
      registrarUsuario(nombre, correo, password);
    });
  }

  // Página de login
  const formLogin = document.querySelector("#formLogin");
  if (formLogin) {
    formLogin.addEventListener("submit", e => {
      e.preventDefault();
      const correo = document.querySelector("#correo").value.trim();
      const password = document.querySelector("#password").value.trim();

      if (!correo || !password) {
        alert("Por favor ingresa tus datos ⚠️");
        return;
      }
      iniciarSesion(correo, password);
    });
  }
});
