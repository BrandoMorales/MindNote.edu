import { useState, useEffect } from "react";
import "../styles/AccessibilityPanel.css";

export default function AccessibilityPanel() {
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("darkMode") === "true"
  );
  const [highContrast, setHighContrast] = useState(
    localStorage.getItem("highContrast") === "true"
  );
  const [fontSize, setFontSize] = useState(
    parseInt(localStorage.getItem("fontSize")) || 16
  );

  // 🔥 Aplicar cambios globales
  useEffect(() => {
    document.body.style.fontSize = `${fontSize}px`;
    document.body.classList.toggle("dark-mode", darkMode);
    document.body.classList.toggle("high-contrast", highContrast);

    localStorage.setItem("darkMode", darkMode);
    localStorage.setItem("highContrast", highContrast);
    localStorage.setItem("fontSize", fontSize);
  }, [darkMode, highContrast, fontSize]);

  return (
    <div className="accessibility-panel">
      <h3>🛠 Accesibilidad</h3>

      <div className="control">
        <label>Tamaño de fuente: {fontSize}px</label>
        <input
          type="range"
          min="12"
          max="24"
          value={fontSize}
          onChange={(e) => setFontSize(parseInt(e.target.value))}
        />
      </div>

      <div className="control">
        <label>
          <input
            type="checkbox"
            checked={darkMode}
            onChange={() => setDarkMode(!darkMode)}
          />
          Modo oscuro
        </label>
      </div>

      <div className="control">
        <label>
          <input
            type="checkbox"
            checked={highContrast}
            onChange={() => setHighContrast(!highContrast)}
          />
          Alto contraste
        </label>
      </div>
    </div>
  );
}
