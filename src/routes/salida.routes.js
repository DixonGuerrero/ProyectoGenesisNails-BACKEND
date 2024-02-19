import { Router } from "express";
import { crearSalida, obtenerSalida, obtenerSalidas } from "../controllers/salida.controller.js";

import { esEmpleado, verificarToken } from "../middlewares/authJwt.js";


const router = Router();

router.get("/", verificarToken,esEmpleado,obtenerSalidas);
router.get("/:id", verificarToken,esEmpleado,obtenerSalida);
router.post("/",verificarToken,esEmpleado,crearSalida);


export default router;

