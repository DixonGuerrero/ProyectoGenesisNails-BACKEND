import { Router } from "express";
import {
  obtenerProductos,
  obtenerProducto,
  crearProducto,
  actualizarProducto,
  eliminarProducto,
  obtenerProductosPorProveedor,
  obtenerProductosPorMarca,
  obtenerProductosPorCategoria,
} from "../controllers/producto.controller.js";

import { validacionProducto } from "../middlewares/middleware.js";
import { esAdmin, verificarToken } from "../middlewares/authJwt.js";

const router = Router();

router.get("/", verificarToken, esAdmin, obtenerProductos);
router.get("/:id", verificarToken, esAdmin, obtenerProducto);
router.get(
  "/categoria/:id",
  verificarToken,
  esAdmin,
  obtenerProductosPorCategoria
);
router.get("/marca/:id", verificarToken, esAdmin, obtenerProductosPorMarca);
router.get(
  "/proveedor/:id",
  verificarToken,
  esAdmin,
  obtenerProductosPorProveedor
);
router.post("/", verificarToken, esAdmin, validacionProducto, crearProducto);
router.put("/:id", verificarToken, esAdmin, actualizarProducto);
router.delete("/:id", verificarToken, esAdmin, eliminarProducto);

export default router;
