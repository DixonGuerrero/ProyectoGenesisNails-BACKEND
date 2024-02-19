import { pool } from "../db.js";

export const obtenerPersonas = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT p.id_persona,p.nombres,p.apellidos,p.telefono,p.correo,CASE WHEN e.id_persona IS NOT NULL THEN 'Empleado'WHEN c.id_persona IS NOT NULL THEN 'Cliente'ELSE null END AS rol,p.created_at,p.updated_at FROM persona p LEFT JOIN empleado e ON p.id_persona = e.id_persona LEFT JOIN cliente c ON p.id_persona = c.id_persona");
    res.json(rows);
  } catch (error) {
    return res.status(500).json({
      mesagge: "Error Interno del Servidor",
      error: error.message,
    });
  }
};

export const obtenerPersona = async (req, res) => {
  try {
    const personaId = parseInt(req.params.id, 10);

    if (isNaN(personaId)) {
      return res.status(400).json({
        message: "ID de persona no válida proporcionada",
      });
    }

    const [rows] = await pool.query(
      "SELECT p.id_persona,p.nombres,p.apellidos,p.telefono,p.correo,CASE WHEN e.id_persona IS NOT NULL THEN 'Empleado'WHEN c.id_persona IS NOT NULL THEN 'Cliente'ELSE null END AS rol,p.created_at,p.updated_at FROM persona p LEFT JOIN empleado e ON p.id_persona = e.id_persona LEFT JOIN cliente c ON p.id_persona = c.id_persona WHERE p.id_persona = ?",
      [personaId]
    );

    if (rows.length <= 0)
      return res.status(404).json({
        mesagge: "Persona no encontrada",
      });

    res.json(rows[0]);
  } catch (error) {
    return res.status(500).json({
      mesagge: "Error Interno del Servidor",
      error: error.message,
    });
  }
};

export const crearPersona = async (req, res) => {
  const { nombres, apellidos, telefono, correo,role,cargo,usuario,password } = req.body;

  const roles = ["empleado", "cliente"];

  try {
    // Validar campos únicos
    const correoExiste = await pool.query(
      "SELECT id_persona FROM persona WHERE correo = ?",
      [correo]
    );

    if (correoExiste[0].length > 0) {
      return res.status(400).json({
        message: "Correo electronico ya se encuentra registrado",
      });
    }

    const usuarioExiste = await pool.query(
      "SELECT id_usuario FROM usuario WHERE usuario = ?",
      [usuario]
    );

    if (usuarioExiste[0].length > 0) {
      return res.status(400).json({
        message: "Usuario ya se encuentra registrado",
      });
    }

    // Validar longitudes máximas
    const maxLongitudes = {
      nombres: 50,
      apellidos: 50,
      telefono: 15,
      correo: 70,
      usuario: 50,
      password: 50,
    };

    for (const [field, maxLength] of Object.entries(maxLongitudes)) {
      if (req.body[field] && req.body[field].length > maxLength) {
        return res.status(400).json({
          message: `Longitud inválida para ${field}. Máxima longitud permitida es ${maxLength}.`,
        });
      }
    }
   
    const [rows] = await pool.query(
      "INSERT INTO persona (nombres, apellidos, telefono, correo ) VALUES (?,?,?,?)",
      [nombres, apellidos, telefono, correo]
    );

    //Crear Usuario
    if(usuario && password){

      await pool.query(
        "INSERT INTO usuario (id_persona,usuario,password) VALUES (?,?,?)",
        [rows.insertId,usuario,password]
      );

    }

    //Creamos rol 

    if(role){
      if (!roles.includes(role)) {
        return res.status(400).json({
          message: "Rol no valido",
        });
      }
        if(role === "empleado"){
          if(!cargo){
            await pool.query(
            `INSERT INTO empleado (id_persona,cargo) VALUES (?,manicurista)`,
            [rows.insertId]
          );
          }else{
            await pool.query(
            `INSERT INTO empleado (id_persona,cargo) VALUES (?,?)`,
            [rows.insertId,cargo]
          );
          }
          
    }
  }else{
      await pool.query(
        `INSERT INTO cliente (id_persona) VALUES (?)`,
        [rows.insertId]
      );
    }

    res.send({
      id_persona: rows.insertId,
      nombres,
      apellidos,
      telefono,
      correo,
      usuario,
      rol: role || "cliente",
    });
  } catch (error) {
    return res.status(500).json({
      mesagge: "Error Interno del Servidor",
      error: error.message,
    });
  }
};

export const eliminarPersona = async (req, res) => {
  try {

    const personaId = parseInt(req.params.id, 10);

    if (isNaN(personaId)) {
      return res.status(400).json({
        message: "Invalid person ID provided",
      });
    }

    const [result] = await pool.query(
      "DELETE FROM persona WHERE id_persona = ?",
      [personaId]
    );

    if (result.affectedRows <= 0)
      return res.status(404).json({
        mesagge: "Persona no encontrada",
      });

    res.sendStatus(204);
  } catch (error) {
    return res.status(500).json({
      mesagge: "Error Interno del Servidor",
      error: error.message,
    });
  }
};

export const actualizarPersona = async (req, res) => {
  const { nombres, apellidos, telefono, correo,cargo,usuario,password } = req.body;
  const personaId = parseInt(req.params.id, 10);
  try {
    if (isNaN(personaId)){
      return res.status(400).json({
        message: "ID de persona no valido",
      });
    }

    // Validar longitudes máximas
    const maxLongitudes = {
      nombres: 50,
      apellidos: 50,
      telefono: 15,
      correo: 70,
      usuario: 50,
      password: 50,
    };

    for (const [field, maxLength] of Object.entries(maxLongitudes)) {
      if (req.body[field] && req.body[field].length > maxLength) {
        return res.status(400).json({
          message: `Longitud inválida para ${field}. Máxima longitud permitida es ${maxLength}.`,
        });
      }
    }
    // Actualizar persona
    const [result] = await pool.query(
      "UPDATE persona SET nombres = IFNULL(?,nombres), apellidos = IFNULL(?,apellidos), telefono = IFNULL(?,telefono), correo = IFNULL(?,correo) WHERE id_persona = ?",
      [nombres, apellidos, telefono, correo, personaId]
    );

    if (result.affectedRows <= 0)
      return res.status(404).json({
        mesagge: "Persona no encontrada",
      });


    //Actualizar Usuario
    if(usuario || password){
      await pool.query(
        "UPDATE usuario SET usuario = IFNULL(?,usuario), password = IFNULL(?,password) WHERE id_persona = ?",
        [usuario, password, personaId]
      );
    
    }

    // Actualizar Empleado
    if(cargo){
      await pool.query(
        "UPDATE empleado SET cargo = IFNULL(?,cargo) WHERE id_persona = ?",
        [cargo, personaId]
      );
    }

    
    res.sendStatus(204);
  } catch (error) {
    return res.status(500).json({
      mesagge: "Error Interno del Servidor",
      error: error.message,
    });
  }
};
