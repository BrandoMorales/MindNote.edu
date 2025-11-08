import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Home.css";

const Home = () => {
  const navigate = useNavigate();

  const handleStart = () => {
    navigate("/login");
  };

  return (
    <div className="home">
      <video autoPlay muted loop className="background-video">
        <source src="src/assets/videoplayback.mp4" type="video/mp4" />
        Tu navegador no soporta videos HTML5.
      </video>

      <div className="home-box animate-fade-in">
        <h1>Bienvenido a MindNote.edu</h1>
        <p>Tu espacio para organizar notas, motivaciones y emociones.</p>
        <button className="btn-start" onClick={handleStart}>Comenzar</button>
      </div>
    </div>
  );
};

export default Home;