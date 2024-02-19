import { pool } from "../db.js";

export const obtenerProveedores = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM proveedor");
    res.json(rows);
  } catch (error) {
    return res.status(500).json({
      mesagge: "Error Interno del Servidor",
      error: error.message,
    });
  }
};

export const obtenerProveedor = async (req, res) => {
  const proveedorId = parseInt(req.params.id, 10);
  try {
    //Validar ID como numero
    if (isNaN(proveedorId)) {
      return res.status(400).json({
        message: "El ID de proveedor no valido ",
      });
    }

    //Realizamos la consulta
    const [rows] = await pool.query(
      "SELECT * FROM proveedor WHERE id_proveedor = ?",
      [req.params.id]
    );

    if (rows.length <= 0)
      return res.status(404).json({
        mesagge: "Proveedor no encontrado",
      });

    res.json(rows[0]);
  } catch (error) {
    return res.status(500).json({
      mesagge: "Error Interno del Servidor",
      error: error.message,
    });
  }
};

export const crearProveedor = async (req, res) => {
  const { nombre,telefono,email, nit, direccion } = req.body;
  try {
    // Validar longitudes máximas
    const maxLongitudes = {
      nombre:100,
      telefono: 20,
      email: 255,
      nit: 25,
      direccion: 50,
    };

    for (const [field, maxLength] of Object.entries(maxLongitudes)) {
      if (req.body[field] && req.body[field].length > maxLength) {
        return res.status(400).json({
          message: `Longitud inválida para ${field}. Máxima longitud permitida es ${maxLength}.`,
        });
      }
    }
    
    //Validacion Nit como unico
    const nitProveedor = await pool.query(
      "SELECT id_proveedor FROM proveedor WHERE nit = ?",
      [nit]
    );

    if (nitProveedor[0].length > 0) {
      return res.status(400).json({
        message: "Nit ya se encuentra registrado",
      });
    }

    //Validacion nombre como unico
    const nombreProveedor = await pool.query(
      "SELECT id_proveedor FROM proveedor WHERE nombre = ?",
      [nombre]
    );

    if (nombreProveedor[0].length > 0) {
      return res.status(400).json({
        message: "Nombre ya se encuentra registrado",
      });
    }

    //Validacion email como unico
    const emailProveedor = await pool.query(
      "SELECT id_proveedor FROM proveedor WHERE email = ?",
      [email]
    );

    if (emailProveedor[0].length > 0) {
      return res.status(400).json({
        message: "Email ya se encuentra registrado",
      });
    }

    //Registro de Proveedor en BD
    const [result] = await pool.query(
      "INSERT INTO proveedor (nombre,telefono,email,nit, direccion) VALUES (?,?,?)",
      [nombre, telefono, email, nit, direccion]
    );

    
    res.send({
      id_proveedor: result.insertId,
      nombre,
      telefono,
      email,
      nit,
      direccion,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      mesagge: "Error Interno del Servidor",
      error: error.message,
    });
  }
};

export const eliminarProveedor = async (req, res) => {
  const proveedorId = parseInt(req.params.id, 10);
  try {
    //Validar ID como numero
    if (isNaN(proveedorId)) {
      return res.status(400).json({
        message: "El ID de proveedor no valido ",
      });
    }
    const [result] = await pool.query(
      "DELETE FROM proveedor WHERE id_proveedor = ?",
      [req.params.id]
    );

    if (result.affectedRows <= 0)
      return res.status(404).json({
        mesagge: "Proveedor no encontrado",
      });

    res.sendStatus(204);
  } catch (error) {
    return res.status(500).json({
      mesagge: "Error Interno del Servidor",
      error: error.message,
    });
  }
};

export const actualizarProveedor = async (req, res) => {
  const { id } = req.params;
  const { nombre,telefono,email,nit, direccion } = req.body;

  try {
    if (isNaN(id)) {
      return res.status(400).json({
        message: "ID de proveedor no valido",
      });
    }

    // Validar longitudes máximas
    const maxLongitudes = {
      nombre:100,
      telefono: 20,
      email: 255,
      nit: 25,
      direccion: 50,
    };

    for (const [field, maxLength] of Object.entries(maxLongitudes)) {
      if (req.body[field] && req.body[field].length > maxLength) {
        return res.status(400).json({
          message: `Longitud inválida para ${field}. Máxima longitud permitida es ${maxLength}.`,
        });
      }
    }

    if(nit){
    // Validar nit como Unico
    const nitExiste = await pool.query(
      "SELECT id_proveedor FROM proveedor WHERE nit = ? AND id_proveedor != ?",
      [nit, id]
    );

    if (nitExiste[0].length > 0) {
      return res.status(400).json({
        message: "El NIT ya se encuentra registrado",
      });
    }

  }

  //Validar si viene el email
  if(email){
    // Validar email como Unico
    const emailExiste = await pool.query(
      "SELECT id_proveedor FROM proveedor WHERE email = ? AND id_proveedor != ?",
      [email, id]
    );

    if (emailExiste[0].length > 0) {
      return res.status(400).json({
        message: "El Email ya se encuentra registrado",
      });
    }

  }

  //Validar si viene el nombre
  if(nombre){
    // Validar nombre como Unico
    const nombreExiste = await pool.query(
      "SELECT id_proveedor FROM proveedor WHERE nombre = ? AND id_proveedor != ?",
      [nombre, id]
    );

    if (nombreExiste[0].length > 0) {
      return res.status(400).json({
        message: "El Nombre ya se encuentra registrado",
      });
    }

  }


    const [result] = await pool.query(
      "UPDATE proveedor SET nombre = IFNULL(?,nombre), telefono = IFNULL(?,telefono), email = IFNULL(?,email), nit = IFNULL(?, nit), direccion = IFNULL(?, direccion) WHERE id_proveedor = ?",
      [nombre,telefono, email,nit, direccion, id]
    );

    if (result.affectedRows === 0)
      return res.status(404).json({
        mesagge: "Proveedor no encontrado",
      });

    const [rows] = await pool.query(
      "SELECT * FROM proveedor WHERE id_proveedor = ?",
      [id]
    );

    res.json(rows[0]);
  } catch (error) {
    return res.status(500).json({
      mesagge: "Error Interno del Servidor",
      error: error.message,
    });
  }
};
