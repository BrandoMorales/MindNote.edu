
  const usuarioId = localStorage.getItem("usuarioId"); // del login

  // Crear nota
  document.getElementById("formNota").addEventListener("submit", async (e) => {
    e.preventDefault();

    const data = {
      titulo: document.getElementById("titulo").value,
      descripcion: document.getElementById("descripcion").value,
      fecha: document.getElementById("fecha").value,
      hora: document.getElementById("hora").value,
      prioridad: document.getElementById("prioridad").value,
      usuarioId,
      categoriaId: document.getElementById("categoria").value
    };

    const res = await fetch("http://localhost:3000/api/notas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await res.json();
    alert(result.message);
    cargarNotas();
  });

  // Listar notas
  async function cargarNotas() {
    const res = await fetch(`http://localhost:3000/api/notas/${usuarioId}`);
    const notas = await res.json();

    const lista = document.getElementById("listaNotas");
    lista.innerHTML = "";

    notas.forEach((n) => {
      const li = document.createElement("li");
      li.innerHTML = `
        <strong>${n.titulo}</strong> (${n.prioridad}) - ${n.estado} <br>
        Vence: ${n.fechaLimite} ${n.hora} <br>
        <button onclick="marcarCompletada(${n.ID_nota})">✅ Completar</button>
        <button onclick="eliminarNota(${n.ID_nota})">🗑 Eliminar</button>
      `;
      lista.appendChild(li);
    });
  }

  // Completar nota
  async function marcarCompletada(id) {
    await fetch(`http://localhost:3000/api/notas/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ estado: "Completada" }),
    });
    cargarNotas();
  }

  // Eliminar nota
  async function eliminarNota(id) {
    await fetch(`http://localhost:3000/api/notas/${id}`, { method: "DELETE" });
    cargarNotas();
  }

  // Cargar al inicio
  cargarNotas();