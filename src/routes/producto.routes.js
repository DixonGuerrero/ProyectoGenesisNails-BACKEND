import { Router } from "express";
import {
  obtenerProductos,
  obtenerProducto,
  crearProducto,
  actualizarProducto,
  eliminarProducto,
} from "../controllers/producto.controller.js";

import { validacionProducto } from "../middlewares/middleware.js";
import { esEmpleado, verificarToken } from "../middlewares/authJwt.js";

const router = Router();

router.get("/",verificarToken,esEmpleado, obtenerProductos);
router.get("/:id",verificarToken,esEmpleado, obtenerProducto);
router.post("/", verificarToken,esEmpleado,validacionProducto, crearProducto);
router.put("/:id",verificarToken, esEmpleado,actualizarProducto);
router.delete("/:id", verificarToken,esEmpleado,eliminarProducto);

export default router;
