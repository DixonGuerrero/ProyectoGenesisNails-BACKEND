import { Router } from "express";
import {login,registrar} from "../controllers/auth.controller.js";
import {validacionLogin, validacionPersona} from "../middlewares/middleware.js";
const router = Router();



router.post("/login",validacionLogin, login);
router.post("/register",validacionPersona, registrar);

export default router;