import { Router } from "express";
import {
  actualizarMarca,
  crearMarca,
  eliminarMarca,
  obtenerMarca,
  obtenerMarcas,
} from "../controllers/marca.controller.js";
import { validacionMarca } from "../middlewares/middleware.js";
import { esAdmin, verificarToken } from "../middlewares/authJwt.js";

const router = Router();

router.get("/", verificarToken, esAdmin, obtenerMarcas);
router.get("/:id", verificarToken, esAdmin, obtenerMarca);
router.post("/", verificarToken, esAdmin, validacionMarca, crearMarca);
router.put("/:id", verificarToken, esAdmin, actualizarMarca);
router.delete("/:id", verificarToken, esAdmin, eliminarMarca);

export default router;
