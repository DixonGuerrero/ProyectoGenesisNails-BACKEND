import { Router } from "express";
import {
  actualizarSalida,
  crearSalida,
  obtenerSalida,
  obtenerSalidas,
} from "../controllers/salida.controller.js";

import { esAdmin, verificarToken } from "../middlewares/authJwt.js";

const router = Router();

router.get("/", verificarToken, esAdmin, obtenerSalidas);
router.get("/:id", verificarToken, esAdmin, obtenerSalida);
router.post("/", verificarToken, esAdmin, crearSalida);
router.put("/:id", verificarToken, esAdmin, actualizarSalida);

export default router;
