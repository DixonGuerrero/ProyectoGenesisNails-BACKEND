import { Router } from "express";
import {
  crearEntrada,
  obtenerEntrada,
  obtenerEntradas,

} from "../controllers/entrada.controller.js";

import { esEmpleado, verificarToken } from "../middlewares/authJwt.js";


const router = Router();

router.get("/", verificarToken,esEmpleado,obtenerEntradas);
router.get("/:id", verificarToken,esEmpleado,obtenerEntrada);
router.post("/",verificarToken,esEmpleado,crearEntrada);


export default router;

