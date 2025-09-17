import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../styles/Notas.css";
import Swal from "sweetalert2";

function Notas() {
  const [tasks, setTasks] = useState(
    JSON.parse(localStorage.getItem("tasks")) || []
  );
  const [input, setInput] = useState("");
  const [date, setDate] = useState("");
  const [editIndex, setEditIndex] = useState(null);
  const [calendarDate, setCalendarDate] = useState(new Date());
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  // 🔐 Bloqueo de acceso si no hay sesión
  useEffect(() => {
    if (!user) {
      Swal.fire({
        icon: "warning",
        title: "Acceso restringido",
        text: "Necesitas iniciar sesión para acceder a tus notas."
      }).then(() => navigate("/login"));
    }

    if (Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  }, [user, navigate]);

  // 🔐 Guardar notas en localStorage cada vez que cambien
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  // 🚪 Cerrar sesión con confirmación
  const handleLogout = () => {
    Swal.fire({
      title: "¿Seguro que deseas cerrar sesión?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí, salir",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33"
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("user");
        navigate("/");
      }
    });
  };

  // ➕ Agregar o editar nota
  const addTask = () => {
    if (input.trim() === "" || date === "") {
      Swal.fire("Error", "Debes ingresar un texto y fecha", "error");
      return;
    }

    const fechaInput = new Date(date);
    const ahora = new Date();

    if (fechaInput < ahora) {
      Swal.fire({
        icon: "error",
        title: "Fecha inválida",
        text: "No puedes agendar una nota antes de la fecha actual"
      });
      return;
    }

    // 🚫 Validar notas duplicadas
    const exists = tasks.some((task, i) => task.time === date && i !== editIndex);
    if (exists) {
      Swal.fire({
        icon: "warning",
        title: "Nota duplicada",
        text: "Ya existe una nota en esa fecha y hora"
      });
      return;
    }

    if (editIndex !== null) {
      const updatedTasks = [...tasks];
      updatedTasks[editIndex] = { ...updatedTasks[editIndex], text: input, time: date };
      setTasks(updatedTasks);
      setEditIndex(null);
      Swal.fire("Editada", "La nota se actualizó correctamente", "success");
    } else {
      const newTask = { text: input, done: false, time: date };
      setTasks([...tasks, newTask]);
      scheduleNotification(newTask);
      Swal.fire("Agregada", "La nota se guardó correctamente", "success");
    }

    setInput("");
    setDate("");
  };

  // ✔ Marcar como hecha
  const toggleTask = (index) => {
    const newTasks = [...tasks];
    newTasks[index].done = !newTasks[index].done;
    setTasks(newTasks);
  };

  // ❌ Eliminar nota con confirmación
  const deleteTask = (index) => {
    Swal.fire({
      title: "¿Seguro que deseas eliminar esta nota?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33"
    }).then((result) => {
      if (result.isConfirmed) {
        const newTasks = tasks.filter((_, i) => i !== index);
        setTasks(newTasks);
        Swal.fire("Eliminada", "La nota ha sido eliminada.", "success");
      }
    });
  };

  // ✏ Editar nota
  const editTask = (index) => {
    setInput(tasks[index].text);
    setDate(tasks[index].time);
    setEditIndex(index);
  };

  // 🔔 Recordatorios
  const scheduleNotification = (task) => {
    const now = new Date().getTime();
    const reminderTime = new Date(task.time).getTime();
    const delay = reminderTime - now;

    if (delay > 0) {
      // Notificación del navegador
      if (Notification.permission === "granted") {
        setTimeout(() => {
          new Notification("🔔 Recordatorio", {
            body: `Es hora de: ${task.text}`
          });
        }, delay);
      }

      // SweetAlert 5 minutos antes
      const alertTime = delay - 5 * 60 * 1000;
      if (alertTime > 0) {
        setTimeout(() => {
          Swal.fire({
            icon: "info",
            title: "Se acerca tu nota",
            text: `En 5 minutos debes: ${task.text}`
          });
        }, alertTime);
      }

      // SweetAlert justo a la hora
      setTimeout(() => {
        Swal.fire({
          icon: "success",
          title: "¡Es el momento!",
          text: `Ahora debes: ${task.text}`
        });
      }, delay);
    } else {
      Swal.fire({
        icon: "warning",
        title: "Nota atrasada",
        text: `La nota "${task.text}" estaba programada en el pasado`
      });
    }
  };

  // Filtrar notas por día en el calendario
  const filteredTasks = tasks.filter(
    (task) =>
      new Date(task.time).toDateString() === calendarDate.toDateString()
  );

  return (
    <div className="notas-page">
      <header className="header">
        <h1>Mindnote</h1>
        <div>
          <span className="welcome">
            👋 Bienvenido, <b>{user?.nombre}</b> ({user?.rol || "usuario"})
          </span>
          <button onClick={handleLogout} className="logout-btn">
            Cerrar Sesión
          </button>
        </div>
      </header>

      <div className="notas-main">
        {/* 📅 Panel de calendario y agendar */}
        <div className="calendar-section">
          <h2>📅 Calendario</h2>
          <Calendar value={calendarDate} onChange={setCalendarDate} />
          <div className="notas-inputs">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Escribe una nota..."
              className="notas-input"
            />
            <input
              type="datetime-local"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="notas-input-date"
            />
            <button onClick={addTask} className="notas-add-btn">
              {editIndex !== null ? "✏️ Guardar" : "➕"}
            </button>
          </div>
        </div>

        {/* 📝 Lista de notas */}
        <div className="notas-container">
          <h2>📝 Notas del {calendarDate.toLocaleDateString()}</h2>
          <ul className="notas-list">
            {filteredTasks.length === 0 && (
              <p className="notas-empty">No tienes notas para esta fecha 📌</p>
            )}
            {filteredTasks.map((task, index) => (
              <li
                key={index}
                className={`notas-item ${task.done ? "done" : ""}`}
              >
                <div>
                  <span>{task.text}</span>
                  <small>{new Date(task.time).toLocaleString()}</small>
                </div>
                <div className="notas-actions">
                  <button
                    onClick={() => toggleTask(index)}
                    className="notas-btn-check"
                  >
                    ✔
                  </button>
                  <button
                    onClick={() => editTask(index)}
                    className="notas-btn-edit"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => deleteTask(index)}
                    className="notas-btn-delete"
                  >
                    ✖
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Notas;
