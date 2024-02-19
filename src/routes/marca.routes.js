import { Router } from "express";
import {actualizarMarca, crearMarca, eliminarMarca, obtenerMarca, obtenerMarcas} from "../controllers/marca.controller.js";
import { validacionMarca } from "../middlewares/middleware.js";
import { esEmpleado, verificarToken } from "../middlewares/authJwt.js";

const router = Router();

router.get("/",verificarToken, esEmpleado,obtenerMarcas);
router.get("/:id",verificarToken, esEmpleado,obtenerMarca);
router.post("/", verificarToken,esEmpleado,validacionMarca,crearMarca);
router.put("/:id", verificarToken,esEmpleado,actualizarMarca);
router.delete("/:id",verificarToken, esEmpleado,eliminarMarca);


export default router;
