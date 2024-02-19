import { pool } from "../db.js";

export const obtenerServicios = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM servicio");
    res.json(rows);
  } catch (error) {
    return res.status(500).json({
      mesagge: "Error Interno del Servidor",
      error: error.message,
    });
  }
};

export const obtenerServicio = async (req, res) => {
  const servicioId = parseInt(req.params.id, 10);
  try {
    if (isNaN(servicioId)) {
      return res.status(400).json({
        message: "ID de de servicio no valido",
      });
    }

    const [rows] = await pool.query(
      "SELECT * FROM servicio WHERE id_servicio = ?",
      [servicioId]
    );

    if (rows.length <= 0)
      return res.status(404).json({
        mesagge: "Servicio no encontrado",
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

export const crearServicio = async (req, res) => {
  const { nombre_servicio, descripcion_servicio } = req.body;

  try {
    // Validar longitudes máximas
    const maxLongitudes = {
      nombre_servicio: 200,
      descripcion_servicio: 255,
    };

    for (const [field, maxLength] of Object.entries(maxLongitudes)) {
      if (req.body[field] && req.body[field].length > maxLength) {
        return res.status(400).json({
          message: `Longitud inválida para ${field}. Máxima longitud permitida es ${maxLength}.`,
        });
      }
    }

    //Validar nombre unico
    const nombreServicio = await pool.query(
      "SELECT id_servicio FROM servicio WHERE nombre_servicio = ?",
      [nombre_servicio]
    );

    if (nombreServicio[0].length > 0) {
      return res.status(400).json({
        message: "Nombre de Servicio ya se encuentra registrado",
      });
    }

    const [rows] = await pool.query(
      "INSERT INTO servicio ( nombre_servicio, descripcion_servicio ) VALUES (?,?)",
      [nombre_servicio, descripcion_servicio]
    );

    res.send({
      id_servicio: rows.insertId,
      nombre_servicio,
      descripcion_servicio,
    });
  } catch (error) {
    return res.status(500).json({
      mesagge: "Error Interno del Servidor",
      error: error.message,
    });
  }
};

export const eliminarServicio = async (req, res) => {
  const servicioId = parseInt(req.params.id, 10);
  try {
    if (isNaN(servicioId)) {
      return res.status(400).json({
        message: "ID de Servicio no valido",
      });
    }

    const [result] = await pool.query(
      "DELETE FROM servicio WHERE id_servicio = ?",
      [servicioId]
    );

    if (result.affectedRows <= 0)
      return res.status(404).json({
        mesagge: "Servicio no encontrado",
      });

    res.sendStatus(204);
  } catch (error) {
    return res.status(500).json({
      mesagge: "Error Interno del Servidor",
      error: error.message,
    });
  }
};

export const actualizarServicio = async (req, res) => {
  const { nombre_servicio, descripcion_servicio } = req.body;
  const servicioId = parseInt(req.params.id, 10);
  try {
    if (isNaN(servicioId)) {
      return res.status(400).json({
        message: "ID de Servicio no valido",
      });
    }

    // Validar longitudes máximas
    const maxLongitudes = {
      nombre_servicio: 200,
      descripcion_servicio: 255,
    };

    for (const [field, maxLength] of Object.entries(maxLongitudes)) {
      if (req.body[field] && req.body[field].length > maxLength) {
        return res.status(400).json({
          message: `Longitud inválida para ${field}. Máxima longitud permitida es ${maxLength}.`,
        });
      }
    }

    //Validar nombre unico
    const nombreServicio = await pool.query(
      "SELECT id_servicio FROM servicio WHERE nombre_servicio = ? AND id_servicio != ?",
      [nombre_servicio,servicioId]
    );

    if (nombreServicio[0].length > 0) {
      return res.status(400).json({
        message: "Nombre de Servicio ya se encuentra registrado",
      });
    }

    const [result] = await pool.query(
      "UPDATE servicio SET nombre_servicio = IFNULL(?, nombre_servicio), descripcion_servicio = IFNULL(?, descripcion_servicio) WHERE id_servicio = ?",
      [nombre_servicio, descripcion_servicio, servicioId]
    );

    if (result.affectedRows === 0)
      return res.status(404).json({
        mesagge: "Servicio no encontrado",
      });

    const [rows] = await pool.query(
      "SELECT * FROM servicio WHERE id_servicio = ?",
      [servicioId]
    );

    res.json(rows[0]);
  } catch (error) {
    return res.status(500).json({
      mesagge: "Error Interno del Servidor",
      error: error.message,
    });
  }
};
