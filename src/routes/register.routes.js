import { Router } from "express";
import { registrar } from "../controllers/auth.controller.js";
import {

  validacionPersona,
} from "../middlewares/middleware.js";
const router = Router();

router.post("/", validacionPersona, registrar);

export default router;
