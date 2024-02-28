import { Router } from "express";
import {
  actualizarCategoria,
  crearCategoria,
  eliminarCategoria,
  obtenerCategoria,
  obtenerCategorias,
} from "../controllers/categoria.controller.js";
import { validacionCategoria } from "../middlewares/middleware.js";
import { esAdmin, verificarToken } from "../middlewares/authJwt.js";

const router = Router();

router.get("/", verificarToken, esAdmin, obtenerCategorias);
router.get("/:id", verificarToken, esAdmin, obtenerCategoria);
router.post("/", verificarToken, esAdmin, validacionCategoria, crearCategoria);
router.put("/:id", verificarToken, esAdmin, actualizarCategoria);
router.delete("/:id", verificarToken, esAdmin, eliminarCategoria);

export default router;
