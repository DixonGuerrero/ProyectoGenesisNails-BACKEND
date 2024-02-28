import { Router } from "express";
import { validacionPersona } from "../middlewares/middleware.js";
import {
  obtenerPersonas,
  obtenerPersona,
  crearPersona,
  eliminarPersona,
  actualizarPersona,
  obtenerPersonaUsuario,
  obtenerPersonaCliente,
  obtenerPersonaAdmin,
} from "../controllers/persona.controller.js";
import { esCliente, esAdmin, verificarToken } from "../middlewares/authJwt.js";

const router = Router();

router.get("/", verificarToken,esAdmin, obtenerPersonas);
router.get("/:id", verificarToken, obtenerPersona);
router.get("/usuario/:id", verificarToken, esAdmin, obtenerPersonaUsuario);
router.get("/cliente/:id", verificarToken, esAdmin, obtenerPersonaCliente);
router.get("/admin/:id", verificarToken, esAdmin, obtenerPersonaAdmin)
router.post("/", verificarToken, esAdmin, validacionPersona, crearPersona);
router.put("/:id", verificarToken, actualizarPersona);
router.delete("/:id", verificarToken, esAdmin, eliminarPersona);

export default router;
