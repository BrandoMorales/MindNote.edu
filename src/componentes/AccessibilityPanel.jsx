import React, { useState } from "react";
import "../styles/AccessibilityPanel.css";

const AccessibilityPanel = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [fontSize, setFontSize] = useState(16);
  const [cursor, setCursor] = useState("default");

  const togglePanel = () => setIsOpen(!isOpen);

  const increaseFont = () => {
    const newSize = fontSize + 2;
    setFontSize(newSize);
    document.body.style.fontSize = `${newSize}px`;
  };

  const decreaseFont = () => {
    const newSize = fontSize > 12 ? fontSize - 2 : fontSize;
    setFontSize(newSize);
    document.body.style.fontSize = `${newSize}px`;
  };

  const changeCursor = (event) => {
    const selectedCursor = event.target.value;
    setCursor(selectedCursor);

    if (selectedCursor === "default") {
      document.body.style.cursor = "auto";
    } else {
      document.body.style.cursor = `url(${selectedCursor}), auto`;
    }
  };

  // 🗣️ Función TalkBack (Text-to-Speech)
  const speakPage = () => {
    const text = document.body.innerText; // Lee todo el texto visible
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "es-ES";
    speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    speechSynthesis.cancel();
  };

  return (
    <div className="accessibility-panel">
      <button className="toggle-btn" onClick={togglePanel}>
        ♿
      </button>
      {isOpen && (
        <div className="panel">
          <h3>Accesibilidad</h3>
          <button onClick={increaseFont}>Aumentar texto</button>
          <button onClick={decreaseFont}>Reducir texto</button>

          {/* 🖱️ Selector de cursor */}
          <label htmlFor="cursorSelect">Cambiar cursor:</label>
          <select id="cursorSelect" onChange={changeCursor} value={cursor}>
            <option value="default">Por defecto</option>
            <option value="https://cur.cursors-4u.net/cursors/cur-11/cur1030.cur">
              Cursor Azul
            </option>
            <option value="https://cur.cursors-4u.net/cursors/cur-11/cur1033.cur">
              Cursor Blanco
            </option>
            <option value="https://cur.cursors-4u.net/cursors/cur-11/cur1029.cur">
              Cursor Amarillo
            </option>
          </select>

          {/* 🔊 TalkBack */}
          <button onClick={speakPage}>🔊 Leer página</button>
          <button onClick={stopSpeaking}>⏹️ Detener lectura</button>
        </div>
      )}
    </div>
  );
};

export default AccessibilityPanel;
