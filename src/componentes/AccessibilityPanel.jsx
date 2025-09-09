import React, { useState, useEffect } from "react";
import "../styles/AccessibilityPanel.css";

function AccessibilityPanel() {
  const [fontSize, setFontSize] = useState(16);
  const [highContrast, setHighContrast] = useState(false);
  const [cursor, setCursor] = useState("default");

  // Aplicar cambios globalmente
  useEffect(() => {
    document.body.style.fontSize = `${fontSize}px`;
    document.body.style.cursor = cursor;
    document.body.classList.toggle("high-contrast", highContrast);
  }, [fontSize, cursor, highContrast]);

  return (
    <div className="accessibility-panel">
      <h2>♿ Accesibilidad</h2>

      {/* Ajustar tamaño de letra */}
      <div className="control">
        <label>Tamaño de letra:</label>
        <div>
          <button onClick={() => setFontSize(fontSize - 2)}>-</button>
          <span>{fontSize}px</span>
          <button onClick={() => setFontSize(fontSize + 2)}>+</button>
        </div>
      </div>

      {/* Contraste */}
      <div className="control">
        <label>Contraste alto:</label>
        <input
          type="checkbox"
          checked={highContrast}
          onChange={() => setHighContrast(!highContrast)}
        />
      </div>

      {/* Cursor */}
      <div className="control">
        <label>Tipo de cursor:</label>
        <select value={cursor} onChange={(e) => setCursor(e.target.value)}>
          <option value="default">Normal</option>
          <option value="pointer">Mano</option>
          <option value="crosshair">Cruz</option>
          <option value="text">Texto</option>
        </select>
      </div>
    </div>
  );
}

export default AccessibilityPanel;
