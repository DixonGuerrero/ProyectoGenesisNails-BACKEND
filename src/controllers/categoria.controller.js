import { pool } from "../db.js";

export const obtenerCategorias = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM categoria");
    res.json(rows);
  } catch (error) {
    return res.status(500).json({
      mesagge: "Error Interno del Servidor",
      error: error.message,
    });
  }
};

export const obtenerCategoria = async (req, res) => {
  const categoriaId = parseInt(req.params.id, 10);
  try {
    if (isNaN(categoriaId)) {
      return res.status(400).json({
        message: "ID de categoria no valido",
      });
    }

    const [rows] = await pool.query(
      "SELECT * FROM categoria WHERE id_categoria = ?",
      [categoriaId]
    );

    if (rows.length <= 0)
      return res.status(404).json({
        mesagge: "Categoria no encontrada",
      });

    res.json(rows[0]);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      mesagge: "Error Interno del Servidor",
      error: error.message,
    });
  }
};

export const crearCategoria = async (req, res) => {
  const { nombre, tipo } = req.body;

  try {
    // Validar longitudes máximas
    const maxLongitudes = {
      nombre: 50,
      tipo: 45,
    };

    for (const [field, maxLength] of Object.entries(maxLongitudes)) {
      if (req.body[field] && req.body[field].length > maxLength) {
        return res.status(400).json({
          message: `Longitud inválida para ${field}. Máxima longitud permitida es ${maxLength}.`,
        });
      }
    }

    //Validar nombre unico
    const nombreCategoria = await pool.query(
      "SELECT id_categoria FROM categoria WHERE nombre = ?",
      [nombre]
    );

    if (nombreCategoria[0].length > 0) {
      return res.status(400).json({
        message: "Nombre de categoria ya se encuentra registrado",
      });
    }

    const [rows] = await pool.query(
      "INSERT INTO categoria ( nombre, tipo ) VALUES (?,?)",
      [nombre, tipo]
    );

    res.send({
      id_categoria: rows.insertId,
      nombre,
      tipo,
    });
  } catch (error) {
    return res.status(500).json({
      mesagge: "Error Interno del Servidor",
      error: error.message,
    });
  }
};

export const eliminarCategoria = async (req, res) => {
  const categoriaId = parseInt(req.params.id, 10);
  try {
    if (isNaN(categoriaId)) {
      return res.status(400).json({
        message: "ID de categoria no valido",
      });
    }

    const [result] = await pool.query(
      "DELETE FROM categoria WHERE id_categoria = ?",
      [categoriaId]
    );

    if (result.affectedRows === 0)
      return res.status(404).json({
        mesagge: "Categoria no encontrada",
      });

    res.status(200).json({
      message: "Categoria eliminada",
    });
  } catch (error) {
    return res.status(500).json({
      mesagge: "Error Interno del Servidor",
      error: error.message,
    });
  }
}

export const actualizarCategoria = async (req, res) => {
  const { nombre, tipo } = req.body;
  const categoriaId = parseInt(req.params.id, 10);
  try {
    if (isNaN(categoriaId)) {
      return res.status(400).json({
        message: "ID de categoria no valido",
      });
    }

    // Validar longitudes máximas
    const maxLongitudes = {
      nombre: 50,
      tipo: 45,
    };

    for (const [field, maxLength] of Object.entries(maxLongitudes)) {
      if (req.body[field] && req.body[field].length > maxLength) {
        return res.status(400).json({
          message: `Longitud inválida para ${field}. Máxima longitud permitida es ${maxLength}.`,
        });
      }
    }

    //Validar nombre unico
    const nombreCategoria = await pool.query(
      "SELECT id_categoria FROM categoria WHERE nombre = ? AND id_categoria != ?",
      [nombre,categoriaId]
    );

    if (nombreCategoria[0].length > 0) {
      return res.status(400).json({
        message: "Nombre de categoria ya se encuentra registrado",
      });
    }

    const [result] = await pool.query(
      "UPDATE categoria SET nombre = IFNULL(?, nombre), tipo = IFNULL(?, tipo) WHERE id_categoria = ?",
      [nombre, tipo, categoriaId]
    );

    if (result.affectedRows === 0)
      return res.status(404).json({
        mesagge: "Categoria no encontrada",
      });

    const [rows] = await pool.query(
      "SELECT * FROM categoria WHERE id_categoria = ?",
      [categoriaId]
    );

    res.json(rows[0]);
  } catch (error) {
    return res.status(500).json({
      mesagge: "Error Interno del Servidor",
      error: error.message,
    });
  }
};
