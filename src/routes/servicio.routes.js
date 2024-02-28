import { Router } from "express";

import { validacionServicio } from "../middlewares/middleware.js";
import {
  actualizarServicio,
  crearServicio,
  eliminarServicio,
  obtenerServicio,
  obtenerServicios,
} from "../controllers/servicio.controller.js";
import { esAdmin, verificarToken } from "../middlewares/authJwt.js";

const router = Router();

router.get("/", obtenerServicios);
router.get("/:id", obtenerServicio);
router.post("/", verificarToken, esAdmin, validacionServicio, crearServicio);
router.put("/:id", verificarToken, esAdmin, actualizarServicio);
router.delete("/:id", verificarToken, esAdmin, eliminarServicio);

export default router;
