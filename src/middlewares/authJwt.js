import jwt from "jsonwebtoken"; 
import { SECRET_KEY } from "../config.js";
import { pool } from "../db.js";

export const verificarToken = async (req, res, next) => {
    try {
        const token = req.headers["x-access-token"];

    if (!token) {   
        return res.status(403).json({ message: "No hay token" });
    }

    
    const decoded =   jwt.verify(token, SECRET_KEY);
      
    const [rows] = await pool.query(
        "SELECT * FROM usuario WHERE id_persona = ?",
        [decoded.id]
        );

    if (rows.length <= 0){
        return res.status(404).json({
            mesagge: "Usuario no encontrado",
        });
    }

    
    
    next();
    } catch (error) {
        return res.status(500).json({
            mesagge: "No autorizado",
            error: error.message,
        });
    }
};

export const esEmpleado = async (req, res, next) => {
    try {
        const token = req.headers["x-access-token"];

    if (!token) {   
        return res.status(403).json({ message: "No hay token" });
    }

    
    const decoded =   jwt.verify(token, SECRET_KEY);
      
    const [rows] = await pool.query(
        "SELECT * FROM empleado WHERE id_persona = ?",
        [decoded.id]
        );

    if (rows.length <= 0){
        return res.status(404).json({
            mesagge: "Requiere Rol de Empleado",
        });
    }

    
    
    next();
    } catch (error) {
        return res.status(500).json({
            mesagge: "No autorizado",
            error: error.message,
        });
    }
}

export const esCliente = async (req, res, next) => {
    try {
        const token = req.headers["x-access-token"];

    if (!token) {   
        return res.status(403).json({ message: "No hay token" });
    }

    
    const decoded =   jwt.verify(token, SECRET_KEY);
      
    const [rows] = await pool.query(
        "SELECT * FROM cliente WHERE id_persona = ?",
        [decoded.id]
        );

    if (rows.length <= 0){
        return res.status(404).json({
            mesagge: "No autorizado",
        });
    }

    
    
    next();
    } catch (error) {
        return res.status(500).json({
            mesagge: "No autorizado",
            error: error.message,
        });
    }
}