import { db } from "../config/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// ====================================================
// 🔐 AUTH
// ====================================================

// ==========================
// REGISTRO
// ==========================
export const register = async (req, res) => {
  try {
    const { nombre, email, password, rol, claveAdmin } = req.body;

    if (!nombre || !email || !password || !rol) {
      return res.status(400).json({ msg: "Todos los campos son obligatorios" });
    }

    const [existing] = await db.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (existing.length > 0) {
      return res.status(400).json({ msg: "El correo ya está registrado" });
    }

    // Validación para administrador
    if (rol === "administrador" && claveAdmin !== "MindNote.edu") {
      return res.status(400).json({ msg: "Clave de administrador incorrecta" });
    }

    const hashed = bcrypt.hashSync(password, 10);

    const [result] = await db.query(
      "INSERT INTO users (nombre, email, password, rol) VALUES (?, ?, ?, ?)",
      [nombre, email, hashed, rol]
    );

    const token = jwt.sign(
      { id: result.insertId, rol },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.json({
      msg: "Registro exitoso",
      user: { id: result.insertId, nombre, email, rol },
      token
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: "Error en el servidor" });
  }
};

// ==========================
// LOGIN
// ==========================
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const [rows] = await db.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (rows.length === 0) {
      return res.status(400).json({ msg: "Credenciales incorrectas" });
    }

    const user = rows[0];

    const valid = bcrypt.compareSync(password, user.password);
    if (!valid) {
      return res.status(400).json({ msg: "Credenciales incorrectas" });
    }

    const token = jwt.sign(
      { id: user.id, rol: user.rol },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.json({
      msg: "Login exitoso",
      user: {
        id: user.id,
        nombre: user.nombre,
        email: user.email,
        rol: user.rol
      },
      token
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: "Error en el servidor" });
  }
};

// ==========================
// OBTENER TODOS LOS USUARIOS
// ==========================
export const getUsuarios = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT id, nombre, email, rol FROM users");
    return res.json(rows);
  } catch (err) {
    return res.status(500).json({ msg: "Error al obtener usuarios" });
  }
};

// ==========================
// ELIMINAR USUARIO
// ==========================
export const eliminarUsuario = async (req, res) => {
  try {
    const { id } = req.params;

    const [user] = await db.query("SELECT * FROM users WHERE id = ?", [id]);

    if (user.length === 0) {
      return res.status(404).json({ msg: "Usuario no encontrado" });
    }

    await db.query("DELETE FROM users WHERE id = ?", [id]);

    return res.json({ msg: "Usuario eliminado correctamente" });

  } catch (err) {
    return res.status(500).json({ msg: "Error al eliminar usuario" });
  }
};

// ==========================
// RECUPERAR CONTRASEÑA → Token
// ==========================
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const [rows] = await db.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (rows.length === 0) {
      return res.status(400).json({ msg: "Este correo no está registrado" });
    }

    const token = Math.random().toString(36).substring(2, 15);
    const expiry = Date.now() + 10 * 60 * 1000; // 10 minutos

    await db.query(
      "UPDATE users SET reset_token = ?, reset_expiry = ? WHERE email = ?",
      [token, expiry, email]
    );

    return res.json({ msg: "Token generado", token });
  } catch (err) {
    return res.status(500).json({ msg: "Error al generar token" });
  }
};

// ==========================
// RESTABLECER CONTRASEÑA
// ==========================
export const resetPassword = async (req, res) => {
  try {
    const { email, token, newPassword } = req.body;

    const [rows] = await db.query(
      "SELECT * FROM users WHERE email = ? AND reset_token = ?",
      [email, token]
    );

    if (rows.length === 0 || rows[0].reset_expiry < Date.now()) {
      return res.status(400).json({ msg: "Token inválido o expirado" });
    }

    const hashed = bcrypt.hashSync(newPassword, 10);

    await db.query(
      "UPDATE users SET password = ?, reset_token = NULL, reset_expiry = NULL WHERE email = ?",
      [hashed, email]
    );

    return res.json({ msg: "Contraseña actualizada correctamente" });

  } catch (err) {
    return res.status(500).json({ msg: "Error al cambiar contraseña" });
  }
};
