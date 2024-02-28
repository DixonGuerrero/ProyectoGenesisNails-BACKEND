import { Router } from "express";
import { validacionProveedor } from "../middlewares/middleware.js";
import {
  actualizarProveedor,
  crearProveedor,
  eliminarProveedor,
  obtenerProveedor,
  obtenerProveedores,
} from "../controllers/proveedor.controller.js";
import { esAdmin, verificarToken } from "../middlewares/authJwt.js";

const router = Router();

router.get("/", verificarToken, esAdmin, obtenerProveedores);
router.get("/:id", verificarToken, esAdmin, obtenerProveedor);
router.post("/", verificarToken, esAdmin, validacionProveedor, crearProveedor);
router.put("/:id", verificarToken, esAdmin, actualizarProveedor);
router.delete("/:id", verificarToken, esAdmin, eliminarProveedor);

export default router;
