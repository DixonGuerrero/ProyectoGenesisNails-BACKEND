import { Router } from "express";
import {
  crearEntrada,
  obtenerEntrada,
  obtenerEntradas,
  actualizarEntrada,
} from "../controllers/entrada.controller.js";

import { esAdmin, verificarToken } from "../middlewares/authJwt.js";

const router = Router();

router.get("/", verificarToken, esAdmin, obtenerEntradas);
router.get("/:id", verificarToken, esAdmin, obtenerEntrada);
router.post("/", verificarToken, esAdmin, crearEntrada);
router.put("/:id", verificarToken, esAdmin, actualizarEntrada);

export default router;
