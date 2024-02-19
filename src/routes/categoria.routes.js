import { Router } from "express";
import {
  actualizarCategoria,
  crearCategoria,
  eliminarCategoria,
  obtenerCategoria,
  obtenerCategorias,
} from "../controllers/categoria.controller.js";
import { validacionCategoria } from "../middlewares/middleware.js";
import { esEmpleado, verificarToken } from "../middlewares/authJwt.js";

const router = Router();

router.get("/", verificarToken,esEmpleado,obtenerCategorias);
router.get("/:id", verificarToken,esEmpleado,obtenerCategoria);
router.post("/", verificarToken,esEmpleado,validacionCategoria,crearCategoria);
router.put("/:id", verificarToken,esEmpleado,actualizarCategoria);
router.delete("/:id", verificarToken,esEmpleado,eliminarCategoria);

export default router;
