import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../styles/Notas.css";
import Swal from "sweetalert2";
import emailjs from "@emailjs/browser";

function Notas() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const API_BASE = "http://localhost:4000/api/auth";

  // EmailJS (ajusta tus IDs si son otros)
  const SERVICE_ID = "MindNote.edu";
  const TEMPLATE_ID = "MindNote.edu3";
  const PUBLIC_KEY = "6vIfd7D5Dltyqq_MO";

  // inicializar EmailJS
  useEffect(() => {
    try {
      if (emailjs && emailjs.init) emailjs.init(PUBLIC_KEY);
    } catch (e) {
      console.error("emailjs init error", e);
    }
  }, []);

  // envío de correo (no bloqueante)
  const sendEmail = (to_name, to_email, subject, message) => {
    if (!to_email) return;
    const params = { to_name, to_email, subject, message };
    emailjs.send(SERVICE_ID, TEMPLATE_ID, params).catch((e) => {
      console.error("Error enviando email:", e);
    });
  };

  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState("");
  const [date, setDate] = useState("");
  const [editId, setEditId] = useState(null);
  const [calendarDate, setCalendarDate] = useState(new Date());

  // timeouts para notificaciones
  const notificationTimeouts = useRef([]);

  // parse robusto de fechas (convierte formatos comunes a Date en zona local)
  const parseLocal = (val) => {
    if (!val) return null;
    // if it's already a Date
    if (val instanceof Date) return val;
    let s = String(val).trim();
    // handle MySQL 'YYYY-MM-DD HH:mm:ss' -> 'YYYY-MM-DDTHH:mm:ss'
    if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}(:\d{2})?$/.test(s)) {
      s = s.replace(" ", "T");
    }
    // if it's 'YYYY-MM-DDTHH:mm' add seconds
    if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(s)) {
      s = s + ":00";
    }
    // Now Date will treat it as local if no timezone is present
    const d = new Date(s);
    if (isNaN(d.getTime())) return null;
    return d;
  };

  // formatea una fecha (valor de datetime-local o Date) a 'YYYY-MM-DD HH:mm:ss' (sin timezone)
  const formatForDB = (localInput) => {
    const d = parseLocal(localInput);
    if (!d) return null;
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    const hh = String(d.getHours()).padStart(2, "0");
    const mm = String(d.getMinutes()).padStart(2, "0");
    const ss = String(d.getSeconds()).padStart(2, "0");
    return `${y}-${m}-${dd} ${hh}:${mm}:${ss}`;
  };

  // cargar notas desde backend
  const cargarNotas = async () => {
    if (!user) return;
    try {
      const res = await fetch(`${API_BASE}/notas/${user.id}`);
      if (!res.ok) throw new Error("Error al cargar notas");
      const data = await res.json();
      // mapear a formato consistente
      const mapped = data.map((n) => ({
        id: n.id,
        titulo: n.titulo,
        contenido: n.contenido,
        fecha: n.fecha,
        done: n.done === 1 || n.done === true,
      }));
      setTasks(mapped);
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "No se pudieron cargar las notas", "error");
    }
  };

  useEffect(() => {
    if (!user) {
      Swal.fire({
        icon: "warning",
        title: "Acceso restringido",
        text: "Necesitas iniciar sesión.",
      }).then(() => navigate("/login"));
      return;
    }
    cargarNotas();
    // limpiar timeouts al desmontar
    return () => {
      notificationTimeouts.current.forEach((id) => clearTimeout(id));
      notificationTimeouts.current = [];
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // pedir permiso de notificaciones (invocado por botón)
  const requestNotificationPermission = async () => {
    if (!("Notification" in window)) {
      Swal.fire("Info", "Tu navegador no soporta notificaciones.", "info");
      return;
    }
    if (Notification.permission === "default") {
      const result = await Notification.requestPermission();
      if (result === "granted") {
        Swal.fire("✅ Notificaciones activadas", "Recibirás recordatorios.", "success");
      } else {
        Swal.fire("⚠️ Notificaciones bloqueadas", "Actívalas desde el navegador.", "warning");
      }
    } else {
      // show friendlier message
      if (Notification.permission === "granted") {
        Swal.fire("✅ Notificaciones ya activadas", "Ya puedes recibir recordatorios.", "success");
      } else {
        Swal.fire("Info", `Permiso actual: ${Notification.permission}`, "info");
      }
    }
  };

  // programar notificación para una nota (5min antes y a la hora)
  const scheduleNotification = useCallback(
    (nota) => {
      if (!user) return;
      try {
        const d = parseLocal(nota.fecha);
        if (!d) return;
        const reminderTime = d.getTime();
        const now = Date.now();
        const delay = reminderTime - now;
        if (delay <= 0) return; // ya pasó
        // 5 minutos antes
        const fiveMin = 5 * 60 * 1000;
        const alertTime = delay - fiveMin;
        if (alertTime > 0) {
          const id = setTimeout(() => {
            console.log("Alert 5min for", nota.titulo);
            Swal.fire({ icon: "info", title: "Se acerca tu nota", text: `En 5 minutos: ${nota.titulo}` });
            sendEmail(user.nombre || "Usuario", user.email, "⏰ Se acerca tu nota", `En 5 minutos debes: ${nota.titulo}`);
          }, alertTime);
          notificationTimeouts.current.push(id);
        }
        // a la hora exacta
        const mainId = setTimeout(() => {
          console.log("Main alert for", nota.titulo);
          Swal.fire({ icon: "success", title: "¡Es el momento!", text: `${nota.titulo}` });
          if (Notification.permission === "granted") {
            try {
              new Notification("🔔 Recordatorio", { body: nota.titulo });
            } catch (e) {
              console.error("Notification error:", e);
            }
          }
          sendEmail(user.nombre || "Usuario", user.email, "✅ Es hora de tu nota", `${nota.titulo}`);
        }, delay);
        notificationTimeouts.current.push(mainId);
      } catch (e) {
        console.error("Error scheduleNotification:", e);
      }
    },
    [user]
  );

  // reprogramar notificaciones cada vez que cambian las notas
  useEffect(() => {
    // limpiar timeouts previos
    notificationTimeouts.current.forEach((id) => clearTimeout(id));
    notificationTimeouts.current = [];
    if (user) {
      tasks.forEach((t) => {
        if (!t.done) scheduleNotification(t);
      });
    }
  }, [tasks, user, scheduleNotification]);

  // validar duplicados y fecha antes de enviar al backend
  const isDuplicateDatetime = (fechaToCheck, excludeId = null) => {
    try {
      const tms = parseLocal(fechaToCheck)?.getTime();
      if (!tms) return false;
      return tasks.some((t) => {
        if (excludeId && t.id === excludeId) return false;
        const other = parseLocal(t.fecha)?.getTime();
        return other === tms;
      });
    } catch {
      return false;
    }
  };

  const isBeforeNow = (fecha) => {
    try {
      return parseLocal(fecha)?.getTime() < Date.now();
    } catch {
      return true;
    }
  };

  // AGREGAR / EDITAR nota
  const addTask = async () => {
    if (input.trim() === "" || date === "") {
      Swal.fire("Error", "Debes ingresar texto y fecha", "error");
      return;
    }

    // date (from datetime-local) may be like 'YYYY-MM-DDTHH:mm' - convert to DB format
    const fechaDB = formatForDB(date);

    // no permitir antes del momento actual
    if (isBeforeNow(fechaDB) && !(editId && parseLocal(fechaDB)?.getTime() === parseLocal(tasks.find(t=>t.id===editId)?.fecha)?.getTime())) {
      Swal.fire("Error", "No puedes agendar una nota en una fecha/hora pasada", "error");
      return;
    }

    // no permitir duplicados (misma fecha y hora)
    if (isDuplicateDatetime(fechaDB, editId)) {
      Swal.fire("Error", "Ya existe otra nota a la misma fecha y hora", "error");
      return;
    }

    const payload = {
      usuarioId: user.id,
      titulo: input,
      contenido: input,
      fecha: fechaDB,
    };

    try {
      if (editId) {
        const res = await fetch(`${API_BASE}/notas/${editId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error("Error actualizando");
        Swal.fire("Editada", "Nota actualizada", "success");
        setEditId(null);
      } else {
        const res = await fetch(`${API_BASE}/notas`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) {
          const err = await res.json().catch(()=>({msg:"Error"}));
          throw new Error(err.msg || "Error creando");
        }
        Swal.fire("Agregada", "Nota guardada en la base de datos", "success");
      }
      setInput("");
      setDate("");
      await cargarNotas();
    } catch (err) {
      console.error(err);
      Swal.fire("Error", err.message || "Error con la base de datos", "error");
    }
  };

  // ELIMINAR con confirmación (cancelable)
  const deleteTask = async (id) => {
    const result = await Swal.fire({
      title: "¿Seguro que deseas eliminar esta nota?",
      text: "No podrás recuperarla después.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });
    if (!result.isConfirmed) return;
    try {
      const res = await fetch(`${API_BASE}/notas/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Error eliminando");
      Swal.fire("Eliminada", "Nota borrada", "success");
      await cargarNotas();
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "No se pudo eliminar la nota", "error");
    }
  };

  // EDITAR: cargar datos en inputs
  const editTask = (nota) => {
    setInput(nota.titulo);
    // dejar el valor en formato compatible con datetime-local si es posible
    try {
      const d = parseLocal(nota.fecha);
      if (d) {
        const localISO = new Date(d.getTime() - d.getTimezoneOffset()*60000).toISOString().slice(0,16);
        setDate(localISO);
      } else {
        setDate(nota.fecha);
      }
    } catch {
      setDate(nota.fecha);
    }
    setEditId(nota.id);
  };

  // TOGGLE done con PUT (mantener misma fecha sin cambios)
  const toggleTask = async (nota) => {
    try {
      const payload = {
        usuarioId: user.id,
        titulo: nota.titulo,
        contenido: nota.contenido,
        fecha: nota.fecha, // send the same DB string back to avoid timezone shifts
        done: nota.done ? 0 : 1,
      };
      const res = await fetch(`${API_BASE}/notas/${nota.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Error actualizando");
      await cargarNotas();
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "No se pudo actualizar la nota", "error");
    }
  };

  // Cerrar sesión con confirmación
  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "¿Seguro que deseas cerrar sesión?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí, salir",
      cancelButtonText: "Cancelar",
    });
    if (!result.isConfirmed) return;
    // limpiar timeouts y localStorage
    notificationTimeouts.current.forEach((id) => clearTimeout(id));
    notificationTimeouts.current = [];
    localStorage.removeItem("user");
    navigate("/");
  };

  // filtrar por fecha del calendario (comparando solo fecha)
  const filteredTasks = tasks.filter((t) => {
    try {
      return parseLocal(t.fecha)?.toDateString() === calendarDate.toDateString();
    } catch {
      return false;
    }
  });

  return (
    <div className="notas-page">
      <header className="header">
        <h1>Mindnote</h1>
        <div>
          <span className="welcome">
            👋 Bienvenido, <b>{user?.nombre}</b> ({user?.rol})
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
              {editId ? "✏️ Guardar" : "➕"}
            </button>
          </div>
        </div>

        <div className="notas-container">
          <h2>📝 Notas del {calendarDate.toLocaleDateString()}</h2>
          <ul className="notas-list">
            {filteredTasks.length === 0 && <p className="notas-empty">No hay notas</p>}
            {filteredTasks.map((nota) => (
              <li key={nota.id} className={`notas-item ${nota.done ? "done" : ""}`}>
                <div>
                  <span>{nota.titulo}</span>
                  <small>{parseLocal(nota.fecha)?.toLocaleString()}</small>
                </div>
                <div className="notas-actions">
                  <button onClick={() => toggleTask(nota)} className="notas-btn-check">✔</button>
                  <button onClick={() => editTask(nota)} className="notas-btn-edit">✏️</button>
                  <button onClick={() => deleteTask(nota.id)} className="notas-btn-delete">✖</button>
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
