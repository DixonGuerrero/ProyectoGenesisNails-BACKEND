import { Router } from "express";
import {validacionCita} from "../middlewares/middleware.js";
import { actualizarCita, crearCita, eliminarCita, obtenerCita, obtenerCitas } from "../controllers/cita.controller.js";
import { verificarToken } from "../middlewares/authJwt.js";

const router = Router();

router.get("/", obtenerCitas);
router.get("/:id", obtenerCita);
router.post("/",verificarToken,validacionCita,crearCita);
router.put("/:id",verificarToken, actualizarCita);
router.delete("/:id", verificarToken,eliminarCita);

export default router;
