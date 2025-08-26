// server.js
import express from "express";
import mysql from "mysql2/promise";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const db = await mysql.createPool({
  host: "localhost",
  user: "root",
  password: "", 
  database: "mindnote_edu"
});


app.post("/api/registrar.js", async (req, res) => {
  try {
    const { nombre, apellido, email, password, rol } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await db.query(
      "INSERT INTO usuario (Nombre, Apellido, Email, Password, Rol, Accesibilidad) VALUES (?, ?, ?, ?, ?, ?)",
      [nombre, apellido, email.toLowerCase(), hashedPassword, rol || "Estudiante", 1]
    );

    res.json({ success: true, message: "Usuario registrado", userId: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error en el registro" });
  }
});


app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const [rows] = await db.query("SELECT * FROM usuario WHERE Email = ?", [email.toLowerCase()]);
    if (rows.length === 0) return res.status(401).json({ success: false, message: "Usuario no encontrado" });

    const user = rows[0];
    const validPass = await bcrypt.compare(password, user.Password);

    if (!validPass) return res.status(401).json({ success: false, message: "Contraseña incorrecta" });

    const token = jwt.sign({ id: user.ID_usuario, email: user.Email }, "secret_key", { expiresIn: "1h" });

    res.json({ success: true, message: "Login exitoso", token, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error en el login" });
  }
});

app.listen(3000, () => {
  console.log("Servidor corriendo en http://localhost:root3006");
});
