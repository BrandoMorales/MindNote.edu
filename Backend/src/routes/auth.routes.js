import { Router } from "express";
import { 
  register, 
  login, 
  getUsuarios, 
  eliminarUsuario,
  forgotPassword,
  resetPassword
} from "../controllers/auth.controller.js";

import {
  crearNota,
  obtenerNotas,
  actualizarNota,
  eliminarNota
} from "../controllers/notas.controller.js";

const router = Router();

// -------------------- RUTAS AUTH --------------------
router.post("/register", register);
router.post("/login", login);

// Admin
router.get("/usuarios", getUsuarios);
router.delete("/usuarios/:id", eliminarUsuario);

// Recuperación de contraseña
router.post("/forgot", forgotPassword);
router.post("/reset", resetPassword);

// -------------------- RUTAS NOTAS --------------------
router.post("/notas", crearNota);
router.get("/notas/:usuarioId", obtenerNotas);
router.put("/notas/:id", actualizarNota);
router.delete("/notas/:id", eliminarNota);

export default router;
