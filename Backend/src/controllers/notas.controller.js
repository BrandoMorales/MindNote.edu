import { db } from "../config/db.js";

// =====================================
// CREAR NOTA
// =====================================
export const crearNota = async (req, res) => {
  try {
    const { usuarioId, titulo, contenido, fecha } = req.body;

    if (!usuarioId || !titulo || !fecha) {
      return res.status(400).json({ msg: "Faltan datos obligatorios" });
    }

    const [result] = await db.query(
      "INSERT INTO notas (usuarioId, titulo, contenido, fecha) VALUES (?, ?, ?, ?)",
      [usuarioId, titulo, contenido, fecha]
    );

    return res.json({
      id: result.insertId,
      usuarioId,
      titulo,
      contenido,
      fecha,
      done: 0
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error al crear nota" });
  }
};

// =====================================
// OBTENER NOTAS POR USUARIO
// =====================================
export const obtenerNotas = async (req, res) => {
  try {
    const { usuarioId } = req.params;

    const [rows] = await db.query(
      "SELECT * FROM notas WHERE usuarioId = ? ORDER BY fecha ASC",
      [usuarioId]
    );

    return res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error al obtener notas" });
  }
};

// =====================================
// ACTUALIZAR NOTA
// =====================================
export const actualizarNota = async (req, res) => {
  try {
    const { id } = req.params;
    const { titulo, contenido, fecha, done } = req.body;

    await db.query(
      "UPDATE notas SET titulo = ?, contenido = ?, fecha = ?, done = ? WHERE id = ?",
      [titulo, contenido, fecha, done ?? 0, id]
    );

    return res.json({ msg: "Nota actualizada correctamente" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error al actualizar nota" });
  }
};

// =====================================
// ELIMINAR NOTA
// =====================================
export const eliminarNota = async (req, res) => {
  try {
    const { id } = req.params;

    await db.query("DELETE FROM notas WHERE id = ?", [id]);

    return res.json({ msg: "Nota eliminada correctamente" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error al eliminar nota" });
  }
};
