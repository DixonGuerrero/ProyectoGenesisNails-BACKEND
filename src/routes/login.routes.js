import { Router } from "express";
import { login} from "../controllers/auth.controller.js";
import {
  validacionLogin,
  validacionPersona,
} from "../middlewares/middleware.js";
const router = Router();

router.post("/login", validacionLogin, login);

export default router;
