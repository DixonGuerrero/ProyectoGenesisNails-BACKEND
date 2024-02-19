import { Router } from "express";
import { validacionProveedor } from "../middlewares/middleware.js";
import {
  actualizarProveedor,
  crearProveedor,
  eliminarProveedor,
  obtenerProveedor,
  obtenerProveedores,
} from "../controllers/proveedor.controller.js";
import { esEmpleado, verificarToken } from "../middlewares/authJwt.js";

const router = Router();

router.get("/",verificarToken,esEmpleado, obtenerProveedores);
router.get("/:id", verificarToken,esEmpleado,obtenerProveedor);
router.post("/",verificarToken,esEmpleado,validacionProveedor,crearProveedor);
router.put("/:id", verificarToken,esEmpleado,actualizarProveedor);
router.delete("/:id", verificarToken,esEmpleado,eliminarProveedor);

export default router;
