import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../styles/Notas.css";
import Swal from "sweetalert2";
import emailjs from "@emailjs/browser"; // ✅ Librería moderna de EmailJS

function Notas() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  // 📧 Configuración de EmailJS (usa los IDs reales de tu panel)
  const SERVICE_ID = "MindNote.edu";
  const TEMPLATE_ID = "MindNote.edu3";
  const PUBLIC_KEY = "6vIfd7D5Dltyqq_MO";

  // 📧 Función para enviar correos
  const sendEmail = (to_name, to_email, subject, message) => {
    if (!to_email) return;
    const params = {
      to_name,
      to_email,
      subject,
      message,
    };

    emailjs
      .send(SERVICE_ID, TEMPLATE_ID, params, PUBLIC_KEY)
      .then(() => console.log("📧 Email enviado a", to_email))
      .catch((err) => console.error("❌ Error enviando email:", err));
  };

  // 📌 Clave única de notas por usuario
  const storageKey = user ? `tasks_${user.email}` : "tasks";

  const [tasks, setTasks] = useState(
    JSON.parse(localStorage.getItem(storageKey)) || []
  );
  const [input, setInput] = useState("");
  const [date, setDate] = useState("");
  const [editIndex, setEditIndex] = useState(null);
  const [calendarDate, setCalendarDate] = useState(new Date());

  const notificationTimeouts = useRef([]);

  // 🔐 Bloqueo de acceso si no hay sesión
  useEffect(() => {
    if (!user) {
      Swal.fire({
        icon: "warning",
        title: "Acceso restringido",
        text: "Necesitas iniciar sesión para acceder a tus notas.",
      }).then(() => navigate("/login"));
    }
  }, [user, navigate]);

  // 💾 Guardar notas en localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem(storageKey, JSON.stringify(tasks));
    }
  }, [tasks, storageKey, user]);

  // 📅 Pedir permiso de notificaciones solo tras acción del usuario
  const requestNotificationPermission = async () => {
    if (Notification.permission === "default") {
      const result = await Notification.requestPermission();
      if (result === "granted") {
        Swal.fire(
          "✅ Notificaciones activadas",
          "Ahora recibirás recordatorios en tu navegador",
          "success"
        );
      } else {
        Swal.fire(
          "⚠️ Notificaciones bloqueadas",
          "Actívalas desde los ajustes del navegador",
          "warning"
        );
      }
    }
  };

  // 🚨 Revisar notas atrasadas
  useEffect(() => {
    if (!user) return;
    const checkOverdue = () => {
      const ahora = new Date();
      tasks.forEach((task) => {
        const fechaTask = new Date(task.time);
        if (task.owner === user.email && fechaTask < ahora && !task.done) {
          Swal.fire({
            icon: "warning",
            title: "Nota atrasada",
            text: `La nota "${task.text}" no se ha cumplido (era para ${fechaTask.toLocaleString()})`,
            timer: 4000,
            showConfirmButton: false,
          });

          // 📧 Enviar correo por nota atrasada
          sendEmail(
            user.nombre || "Usuario",
            user.email,
            "⚠ Nota atrasada",
            `Hola ${user.nombre || "usuario"},\n\nTu nota "${task.text}" estaba programada para ${fechaTask.toLocaleString()} y aún no se ha cumplido.`
          );
        }
      });
    };
    checkOverdue();
    const interval = setInterval(checkOverdue, 60000);
    return () => clearInterval(interval);
  }, [tasks, user]);

  // 🔔 Programar notificación solo para el dueño
  const scheduleNotification = useCallback(
    (task) => {
      if (!user || task.owner !== user.email) return;

      const now = Date.now();
      const reminderTime = new Date(task.time).getTime();
      const delay = reminderTime - now;

      if (delay > 0) {
        // ⏳ Aviso 5 minutos antes
        const alertTime = delay - 5 * 60 * 1000;
        if (alertTime > 0) {
          const alertId = setTimeout(() => {
            Swal.fire({
              icon: "info",
              title: "Se acerca tu nota",
              text: `En 5 minutos debes: ${task.text}`,
            });
            sendEmail(
              user.nombre,
              user.email,
              "⏰ Se acerca tu nota",
              `Hola ${user.nombre},\n\nEn 5 minutos debes realizar: "${task.text}".`
            );
          }, alertTime);
          notificationTimeouts.current.push(alertId);
        }

        // 🚨 Aviso justo a la hora
        const mainId = setTimeout(() => {
          Swal.fire({
            icon: "success",
            title: "¡Es el momento!",
            text: `Ahora debes: ${task.text}`,
          });
          if (Notification.permission === "granted") {
            new Notification("🔔 Recordatorio", {
              body: `Ahora debes: ${task.text}`,
            });
          }
          sendEmail(
            user.nombre,
            user.email,
            "✅ Es hora de tu nota",
            `Hola ${user.nombre},\n\nAhora debes realizar: "${task.text}".`
          );
        }, delay);
        notificationTimeouts.current.push(mainId);
      }
    },
    [user]
  );

  const clearAllNotifications = () => {
    notificationTimeouts.current.forEach((id) => clearTimeout(id));
    notificationTimeouts.current = [];
  };

  // 🚪 Cerrar sesión
  const handleLogout = () => {
    Swal.fire({
      title: "¿Seguro que deseas cerrar sesión?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí, salir",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        clearAllNotifications();
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
        text: "No puedes agendar una nota antes de la fecha actual",
      });
      return;
    }

    const exists = tasks.some(
      (task, i) => task.time === date && i !== editIndex
    );
    if (exists) {
      Swal.fire({
        icon: "warning",
        title: "Nota duplicada",
        text: "Ya existe una nota en esa fecha y hora",
      });
      return;
    }

    if (editIndex !== null) {
      const updatedTasks = [...tasks];
      updatedTasks[editIndex] = {
        ...updatedTasks[editIndex],
        text: input,
        time: date,
        owner: user?.email || "desconocido",
      };
      setTasks(updatedTasks);
      setEditIndex(null);
      Swal.fire("Editada", "La nota se actualizó correctamente", "success");
    } else {
      const newTask = {
        text: input,
        done: false,
        time: date,
        owner: user?.email || "desconocido",
      };
      setTasks([...tasks, newTask]);
      scheduleNotification(newTask);
      Swal.fire("Agregada", "La nota se guardó correctamente", "success");
    }

    setInput("");
    setDate("");
  };

  const toggleTask = (index) => {
    const newTasks = [...tasks];
    newTasks[index].done = !newTasks[index].done;
    setTasks(newTasks);
  };

  const deleteTask = (index) => {
    Swal.fire({
      title: "¿Seguro que deseas eliminar esta nota?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        const newTasks = tasks.filter((_, i) => i !== index);
        setTasks(newTasks);
        Swal.fire("Eliminada", "La nota ha sido eliminada.", "success");
      }
    });
  };

  const editTask = (index) => {
    setInput(tasks[index].text);
    setDate(tasks[index].time);
    setEditIndex(index);
  };

  const filteredTasks = user
    ? tasks.filter(
        (task) =>
          task.owner === user.email &&
          new Date(task.time).toDateString() === calendarDate.toDateString()
      )
    : [];

  useEffect(() => {
    clearAllNotifications();
    if (user) {
      tasks.forEach((task) => {
        if (task.owner === user.email) scheduleNotification(task);
      });
    }
  }, [user, tasks, scheduleNotification]);

  return (
    <div className="notas-page">
      <header className="header">
        <h1>Mindnote</h1>
        <div>
          <span className="welcome">
            👋 Bienvenido, <b>{user?.nombre || "Invitado"}</b> (
            {user?.rol || "usuario"})
          </span>
          <button onClick={requestNotificationPermission} className="notify-btn">
            🔔 Activar notificaciones
          </button>
          <button onClick={handleLogout} className="logout-btn">
            Cerrar Sesión
          </button>
        </div>
      </header>

      <div className="notas-main">
        {/* 📅 Calendario */}
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
