import jwt from "jsonwebtoken";
import { SECRET_KEY } from "../config.js";
import { obtenerPorId, obtenerPorIdPersona } from "../utils.js";

export const verificarToken = async (req, res, next) => {
  try {
    const token = req.headers["x-access-token"];

    if (!token) {
      return res.status(403).json({ message: "No hay token" });
    }

    const decoded = jwt.verify(token, SECRET_KEY);

    const usuario = await obtenerPorId("usuario", decoded.id);

    if (!usuario) {
      return res.status(404).json({
        mesagge: "Usuario no encontrado",
      });
    }

    next();
  } catch (error) {
    console.log("catch");
    return res.status(500).json({
      mesagge: "No autorizado",
      error: error.message,
    });
  }
};

export const esAdmin = async (req, res, next) => {
  try {
    const token = req.headers["x-access-token"];

    if (!token) {
      return res.status(403).json({ message: "No hay token" });
    }

    const decoded = jwt.verify(token, SECRET_KEY);

    const admin = await obtenerPorIdPersona("admin", decoded.id);

    if (admin.length <= 0) {
      return res.status(404).json({
        mesagge: "Requiere Rol de Admin",
      });
    }

    next();
  } catch (error) {
    console.log("catch");
    return res.status(500).json({
      mesagge: "No autorizado",
      error: error.message,
    });
  }
};

export const esCliente = async (req, res, next) => {
  try {
    const token = req.headers["x-access-token"];

    if (!token) {
      return res.status(403).json({ message: "No hay token" });
    }

    const decoded = jwt.verify(token, SECRET_KEY);

    const [rows] = await obtenerPorIdPersona("cliente", decoded.id);

    if (rows.length <= 0) {
      console.log("no es cliente");
      return res.status(404).json({
        mesagge: "Requiere Rol de Cliente",
      });
    }

    next();
  } catch (error) {
    console.log("catch");
    return res.status(500).json({
      mesagge: "No autorizado",
      error: error.message,
    });
  }
};
