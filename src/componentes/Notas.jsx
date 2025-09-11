import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../styles/Notas.css";
import axios from "axios";

function Notas() {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState("");
  const [date, setDate] = useState("");
  const [editIndex, setEditIndex] = useState(null);
  const [calendarDate, setCalendarDate] = useState(new Date());
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
  if (!user) {
    alert("Necesitas iniciar sesión para acceder a tus notas.");
    navigate("/Login"); // Redirige a Login
  }

  if (Notification.permission !== "granted") {
    Notification.requestPermission();
  }
}, [user, navigate]);


  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

   const addTask = async () => {
    if (input.trim() === "" || date === "") return;

    if (editIndex !== null) {
      const updatedTasks = [...tasks];
      updatedTasks[editIndex] = { ...updatedTasks[editIndex], text: input, time: date };
      setTasks(updatedTasks);
      setEditIndex(null);
    } else {
      const newTask = { text: input, done: false, time: date };
      setTasks([...tasks, newTask]);
      scheduleNotification(newTask);
    }


    //peticion a backend utilizando axios *//
    const response = await axios.post("http://localhost:3006/tareas", tasks)
    console.log(response.data)  


    setInput("");
    setDate("");
  };

  const toggleTask = (index) => {
    const newTasks = [...tasks];
    newTasks[index].done = !newTasks[index].done;
    setTasks(newTasks);
  };

  const deleteTask = (index) => {
    const newTasks = tasks.filter((_, i) => i !== index);
    setTasks(newTasks);
  };

  const editTask = (index) => {
    setInput(tasks[index].text);
    setDate(tasks[index].time);
    setEditIndex(index);
  };

  const scheduleNotification = (task) => {
    const now = new Date().getTime();
    const reminderTime = new Date(task.time).getTime();
    const delay = reminderTime - now;

    if (delay > 0 && Notification.permission === "granted") {
      setTimeout(() => {
        new Notification("🔔 Recordatorio", {
          body: `Es hora de: ${task.text}`,
        });
      }, delay);
    }
  };

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
            👋 Bienvenido, <b>{user?.nombre}</b>
          </span>
          <button onClick={handleLogout} className="logout-btn">
            Cerrar Sesión
          </button>
        </div>
      </header>

      <div className="notas-main">
        {/* 🔥 Panel de calendario y agendar */}
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

        {/* 🔥 Lista de notas */}
        <div className="notas-container">
          <h2>📝 Notas del {calendarDate.toLocaleDateString()}</h2>
          <ul className="notas-list">
            {filteredTasks.length === 0 && (
              <p className="notas-empty">No tienes notas para esta fecha 📌</p>
            )}
            {filteredTasks.map((task, index) => (
              <li key={index} className={`notas-item ${task.done ? "done" : ""}`}>
                <div>
                  <span>{task.text}</span>
                  <small>{new Date(task.time).toLocaleString()}</small>
                </div>
                <div className="notas-actions">
                  <button onClick={() => toggleTask(index)} className="notas-btn-check">✔</button>
                  <button onClick={() => editTask(index)} className="notas-btn-edit">✏️</button>
                  <button onClick={() => deleteTask(index)} className="notas-btn-delete">✖</button>
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
