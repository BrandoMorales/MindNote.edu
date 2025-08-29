import { useState } from "react";

function App() {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState("");

  const addTask = () => {
    if (input.trim() !== "") {
      setTasks([...tasks, { text: input, done: false }]);
      setInput("");
    }
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

  return (
    <div className="min-h-screen bg-gradient-to-r from-pink-200 to-purple-200 flex items-center justify-center">
      <div className="bg-white p-6 rounded-2xl shadow-lg w-96">
        <h1 className="text-3xl font-bold text-center text-purple-600 mb-4">
          🌸 Mi Lista de Tareas 🌸
        </h1>

        {/* input y botón */}
        <div className="flex mb-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Escribe una tarea..."
            className="flex-1 p-2 border-2 border-purple-300 rounded-lg focus:outline-none focus:border-purple-500"
          />
          <button
            onClick={addTask}
            className="ml-2 px-4 py-2 bg-pink-400 text-white rounded-lg hover:bg-pink-500"
          >
            ➕
          </button>
        </div>

        {/* lista */}
        <ul className="space-y-2">
          {tasks.map((task, index) => (
            <li
              key={index}
              className={`flex justify-between items-center p-2 rounded-lg ${
                task.done ? "bg-green-200 line-through" : "bg-purple-100"
              }`}
            >
              <span>{task.text}</span>
              <div className="flex space-x-2">
                {/* ✅ botón check */}
                <button
                  onClick={() => toggleTask(index)}
                  className="text-green-600 font-bold hover:text-green-800"
                >
                  ✔
                </button>
                {/* ❌ botón eliminar */}
                <button
                  onClick={() => deleteTask(index)}
                  className="text-red-500 font-bold hover:text-red-700"
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

export default App;
