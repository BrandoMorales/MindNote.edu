import express from "express";
import mysql from "mysql2/promise";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// 🔗 Conexión a tu base de datos HeidiSQL/MySQL
const db = await mysql.createPool({
  host: "127.0.0.1",   // o 127.0.0.1
  user: "root",        // tu usuario en HeidiSQL
  password: "",        // tu contraseña en HeidiSQL
  database: "MindNote.edu" // tu base de datos
});

// ------------------ REGISTRO ------------------
app.post("/backend/api/registrar.js", async (req, res) => {
  try {
    const { nombre, apellido, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await db.query(
      "INSERT INTO usuario (Nombre, Apellido, Email, Password, Rol, Accesibilidad) VALUES (?, ?, ?, ?, ?, ?)",
      [nombre, apellido, email.toLowerCase(), hashedPassword, "Estudiante", 1]
    );

    res.json({ success: true, message: "Usuario registrado", userId: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error en el registro" });
  }
});

// ------------------ LOGIN ------------------
app.post("/backend/api/login.js", async (req, res) => {
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
  console.log("Servidor corriendo en http://localhost:root:3006");
});
// ------------------ CREAR NOTA ------------------
app.post("/api/notas", async (req, res) => {
  try {
    const { titulo, descripcion, fecha, hora, prioridad, usuarioId, categoriaId } = req.body;

    const [result] = await db.query(
      "INSERT INTO tarea (titulo, descripcion, fechaLimite, hora, estado, prioridad, Usuario_id, categoria_id, fecha_registro) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())",
      [titulo, descripcion, fecha, hora, "Pendiente", prioridad, usuarioId, categoriaId]
    );

    res.json({ success: true, message: "Nota creada", notaId: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error al crear nota" });
  }
});

// ------------------ LISTAR NOTAS DE UN USUARIO ------------------
app.get("/api/notas/:usuarioId", async (req, res) => {
  try {
    const { usuarioId } = req.params;

    const [rows] = await db.query(
      "SELECT t.ID_tarea as ID_nota, t.titulo, t.descripcion, t.fechaLimite, t.hora, t.estado, t.prioridad, c.nombre as categoria FROM tarea t JOIN categoria c ON t.categoria_id = c.ID_categoria WHERE t.Usuario_id = ?",
      [usuarioId]
    );

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error al obtener notas" });
  }
});

// ------------------ ACTUALIZAR NOTA ------------------
app.put("/api/notas/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    await db.query("UPDATE tarea SET estado = ? WHERE ID_tarea = ?", [estado, id]);

    res.json({ success: true, message: "Nota actualizada" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error al actualizar nota" });
  }
});

// ------------------ ELIMINAR NOTA ------------------
app.delete("/api/notas/:id", async (req, res) => {
  try {
    const { id } = req.params;

    await db.query("DELETE FROM tarea WHERE ID_tarea = ?", [id]);

    res.json({ success: true, message: "Nota eliminada" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error al eliminar nota" });
  }
});
