import { pool } from "../db.js";

export const obtenerMarcas = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM marca");
    res.json(rows);
  } catch (error) {
    return res.status(500).json({
      mesagge: "Error Interno del Servidor",
      error: error.message
    });
  }
};

export const obtenerMarca = async (req, res) => {
  const marcaId = parseInt(req.params.id, 10);
  try {
    if (isNaN(marcaId)) {
      return res.status(400).json({
        message: "ID de Marca no valido",
      });
    }

    const [rows] = await pool.query(
      "SELECT * FROM marca WHERE id_marca = ?",
      [marcaId]
    );

    if (rows.length <= 0)
      return res.status(404).json({
        message: "Marca no encontrada",
      });

    res.json(rows[0]);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Error Interno del Servidor",
      error: error.message,
    });
  }
};

export const crearMarca = async (req, res) => {
  const { nombre, id_categoria } = req.body;

  try {
    // Validar longitudes máximas
    const maxLongitudes = {
      nombre:25,
      id_categoria: 45,
    };

    for (const [field, maxLength] of Object.entries(maxLongitudes)) {
      if (req.body[field] && req.body[field].length > maxLength) {
        return res.status(400).json({
          message: `Longitud inválida para ${field}. Máxima longitud permitida es ${maxLength}.`,
        });
      }
    }

    //Validar nombre unico
    const nombreMarca = await pool.query(
      "SELECT id_marca FROM marca WHERE nombre = ?",
      [nombre]
    );

    if (nombreMarca[0].length > 0) {
      return res.status(400).json({
        message: "Nombre de Marca ya se encuentra registrado",
      });
    }

    //Validar categoria existente
    const categoria = await pool.query( "SELECT id_categoria FROM categoria WHERE id_categoria = ?", [id_categoria]);

    if (categoria[0].length <= 0) {
      return res.status(400).json({
        message: "Categoria no encontrada",
      });
    }


    const [rows] = await pool.query(
      "INSERT INTO marca ( nombre, id_categoria ) VALUES (?,?)",
      [nombre, id_categoria]
    );

    res.send({
      id_marca: rows.insertId,
      nombre,
      categoria: id_categoria,
    });
  } catch (error) {
    return res.status(500).json({
      mesagge: "Error Interno del Servidor",
      error: error.message,
    });
  }
};

export const eliminarMarca = async (req, res) => {
  const marcaId = parseInt(req.params.id, 10);
  try {
    if (isNaN(marcaId)) {
      return res.status(400).json({
        message: "ID de Marca no valido",
      });
    }

    const [result] = await pool.query(
      "DELETE FROM marca WHERE id_marca = ?",
      [marcaId]
    );

    if (result.affectedRows <= 0)
      return res.status(404).json({
        mesagge: "Marca no encontrada",
      });

    res.sendStatus(204);
  } catch (error) {
    return res.status(500).json({
      mesagge: "Error Interno del Servidor",
      error: error.message,
    });
  }
};

export const actualizarMarca = async (req, res) => {
  const { nombre, id_categoria } = req.body;
  const marcaId = parseInt(req.params.id, 10);
  try {
    if (isNaN(marcaId)) {
      return res.status(400).json({
        message: "ID de Marca no valido",
      });
    }

    // Validar longitudes máximas
    const maxLongitudes = {
      nombre: 25,
      id_categoria: 45,
    };

    for (const [field, maxLength] of Object.entries(maxLongitudes)) {
      if (req.body[field] && req.body[field].length > maxLength) {
        return res.status(400).json({
          message: `Longitud inválida para ${field}. Máxima longitud permitida es ${maxLength}.`,
        });
      }
    }

    //Validar nombre unico
    const nombreMarca = await pool.query(
      "SELECT id_marca  FROM marca WHERE nombre = ? AND id_marca != ?",
      [nombre, marcaId]
    );

    if (nombreMarca[0].length > 0) {
      return res.status(400).json({
        message: "Nombre de Marca ya se encuentra registrado",
      });
    }

    //Validar categoria existente
    if(id_categoria){
      const categoria = await pool.query( "SELECT id_categoria FROM categoria WHERE id_categoria = ?", [id_categoria]);

      if (categoria[0].length <= 0) {
        return res.status(400).json({
        message: "Categoria no encontrada",
        });
      }
    }

    //Actualizar Marca
    const [result] = await pool.query(
      "UPDATE marca SET nombre = IFNULL(?, nombre), id_categoria = IFNULL(?, id_categoria) WHERE id_marca = ?",
      [nombre, id_categoria, marcaId]
    );

    if (result.affectedRows === 0)
      return res.status(404).json({
        mesagge: "Marca no encontrada",
      });

    const [rows] = await pool.query(
      "SELECT * FROM marca WHERE id_marca = ?",
      [id_categoria]
    );

    res.json(rows[0]);
  } catch (error) {
    return res.status(500).json({
      mesagge: "Error Interno del Servidor",
      error: error.message,
    });
  }
};




