import { useState, useEffect } from "react";
import "../styles/Notas.css";

function Notas() {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState("");
  const [date, setDate] = useState("");
  const [editIndex, setEditIndex] = useState(null); // 🔥 Nuevo estado para editar

  // ✅ Pedir permiso para notificaciones
  useEffect(() => {
    if (Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  }, []);

  const addTask = () => {
    if (input.trim() === "" || date === "") return;

    if (editIndex !== null) {
      // 🔥 Editar nota
      const updatedTasks = [...tasks];
      updatedTasks[editIndex] = { ...updatedTasks[editIndex], text: input, time: date };
      setTasks(updatedTasks);
      setEditIndex(null);
    } else {
      // 🔥 Nueva nota
      const newTask = { text: input, done: false, time: date };
      setTasks([...tasks, newTask]);
      scheduleNotification(newTask);
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

  return (
    <div className="notas-page">
      <div className="notas-container">
        <h1 className="notas-title">📓 Agenda de Notas y Recordatorios</h1>

        {/* Inputs */}
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

        {/* Lista */}
        <ul className="notas-list">
          {tasks.length === 0 && (
            <p className="notas-empty">No tienes notas aún 📌</p>
          )}
          {tasks.map((task, index) => (
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
  );
}

export default Notas;
