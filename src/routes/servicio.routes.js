import { Router } from "express";

import { validacionServicio } from "../middlewares/middleware.js";
import { actualizarServicio, crearServicio, eliminarServicio, obtenerServicio, obtenerServicios } from "../controllers/servicio.controller.js";
import { esEmpleado, verificarToken } from "../middlewares/authJwt.js";

const router = Router();

router.get("/",obtenerServicios);
router.get("/:id", obtenerServicio);
router.post("/",verificarToken, esEmpleado,validacionServicio,crearServicio);
router.put("/:id", verificarToken,esEmpleado,actualizarServicio);
router.delete("/:id", verificarToken,esEmpleado,eliminarServicio);

export default router;
