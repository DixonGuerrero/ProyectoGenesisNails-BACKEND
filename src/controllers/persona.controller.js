import {
  validarCampoUnico,
  insertarDatos,
  validarLongitudesCampos,
  obtenerPorId,
  eliminar,
  actualizarDatosUsuario,
  actualizarDatos,
  validarCampoUnicoUpdate,
} from "../utils.js";
import bcrypt from "bcryptjs";
import { pool } from "../db.js";

export const obtenerPersonas = async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT p.id_persona,p.nombres,p.apellidos,p.telefono,p.correo,CASE WHEN a.id_persona IS NOT NULL THEN 'Admin' WHEN c.id_persona IS NOT NULL THEN 'Cliente'ELSE null END AS rol,p.created_at,p.updated_at , u.imagen, u.usuario, u.password, c.id_cliente FROM persona p LEFT JOIN admin a ON p.id_persona = a.id_persona LEFT JOIN cliente c ON p.id_persona = c.id_persona LEFT JOIN usuario u ON p.id_persona = u.id_persona"
    );
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
      "SELECT p.id_persona,p.nombres,p.apellidos,p.telefono,p.correo,CASE WHEN a.id_persona IS NOT NULL THEN 'Admin' WHEN c.id_persona IS NOT NULL THEN 'Cliente'ELSE null END AS rol,p.created_at,p.updated_at , u.imagen, u.usuario, u.password, c.id_cliente FROM persona p LEFT JOIN admin a ON p.id_persona = a.id_persona LEFT JOIN cliente c ON p.id_persona = c.id_persona LEFT JOIN usuario u ON p.id_persona = u.id_persona WHERE p.id_persona = ?",
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

export const obtenerPersonaUsuario = async (req, res) => {
  try {
    const usuarioId = parseInt(req.params.id, 10);

    if (isNaN(usuarioId)) {
      return res.status(400).json({
        message: "ID de Usuario no válida proporcionada",
      });
    }

    const [rows] = await pool.query(
      "SELECT p.id_persona,p.nombres, p.apellidos,p.telefono,p.correo, u.id_usuario,u.imagen,u.usuario,u.password  FROM persona p JOIN usuario u ON p.id_persona = u.id_persona WHERE id_usuario = ?",
      [usuarioId]
    );

    if (rows.length <= 0)
      return res.status(404).json({
        mesagge: "Usuario no encontrado",
      });

    res.json(rows[0]);
  } catch (error) {
    return res.status(500).json({
      mesagge: "Error Interno del Servidor",
      error: error.message,
    });
  }
};

export const obtenerPersonaCliente = async (req, res) => {
  try {
    const clienteId = parseInt(req.params.id, 10);

    if (isNaN(clienteId)) {
      return res.status(400).json({
        message: "ID de Cliente no válida proporcionada",
      });
    }

    const [rows] = await pool.query(
      "SELECT p.id_persona,p.nombres, p.apellidos,p.telefono,p.correo, c.id_cliente FROM persona p JOIN cliente c ON p.id_persona = c.id_persona WHERE id_cliente = ?",
      [clienteId]
    );

    if (rows.length <= 0)
      return res.status(404).json({
        mesagge: "Cliente no encontrado",
      });

    res.json(rows[0]);
  } catch (error) {
    return res.status(500).json({
      mesagge: "Error Interno del Servidor",
      error: error.message,
    });
  }
};

export const obtenerPersonaAdmin = async (req, res) => {
  try {
    const adminId = parseInt(req.params.id, 10);

    if (isNaN(adminId)) {
      return res.status(400).json({
        message: "ID de Admin no válida proporcionada",
      });
    }

    const [rows] = await pool.query(
      "SELECT p.id_persona,p.nombres, p.apellidos,p.telefono,p.correo, a.id_admin FROM persona p JOIN admin a ON p.id_persona = a.id_persona WHERE id_admin = ?",
      [adminId]
    );

    if (rows.length <= 0)
      return res.status(404).json({
        mesagge: "Admin no encontrado",
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
  const { nombres, apellidos, telefono, correo, rol, usuario, password ,imagen} =
    req.body;

  const roles = ["admin", "cliente"];

  try {
    // Validar longitudes máximas
    const Longitudes = {
      nombres: 50,
      apellidos: 50,
      telefono: 15,
      correo: 70,
      usuario: 50,
      password: 50,
    };

    const camposLongitudInvalida = validarLongitudesCampos(
      req.body,
      Longitudes
    );

    if (camposLongitudInvalida) {
      return res.status(400).json({
        message: `El campo ${camposLongitudInvalida} excede la longitud máxima.`,
      });
    }

    // Validar campos únicos
    const correoExiste = await validarCampoUnico("persona", "correo", correo);
    const usuarioExiste = await validarCampoUnico(
      "usuario",
      "usuario",
      usuario
    );

    if (usuarioExiste) {
      return res.status(400).json({
        message: `El usuario ${usuario} ya está en uso.`,
      });
    }
    if (correoExiste) {
      return res.status(400).json({
        message: `El correo ${correo} ya está en uso.`,
      });
    }
    //Crear Persona
    const campos = ["nombres", "apellidos", "telefono", "correo"];
    const valores = [nombres, apellidos, telefono, correo];
    const nuevaPersona = await insertarDatos("persona", campos, valores);

    if (!nuevaPersona) {
      return res.status(400).json({
        message: "Error al crear persona",
      });
    }


    //Crear Usuario
    if (usuario && password) {
      //Encriptar contraseña
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password, salt);
        let passwordHash = hash;

      
      if(imagen){
        const camposUsuario = ["id_persona", "usuario", "password", "imagen"];
        const valoresUsuario = [nuevaPersona, usuario, passwordHash, imagen];

        const nuevoUsuario = await insertarDatos(
          "usuario",
          camposUsuario,
          valoresUsuario
        );

        if (!nuevoUsuario) {
          return res.status(400).json({
            message: "Error al crear usuario",
          });
        }
      }else{

      const camposUsuario = ["id_persona", "usuario", "password"];
      const valoresUsuario = [nuevaPersona, usuario, passwordHash];
    
      const nuevoUsuario = await insertarDatos(
        "usuario",
        camposUsuario,
        valoresUsuario
      );

      if (!nuevoUsuario) {
        return res.status(400).json({
          message: "Error al crear usuario",
        });
      }
    }
    }

    //Insertamos Persona en Cliente o Empleado
    console.log("antes de crear el rol");
    if (rol) {
      console.log("si existe el rol");
      if (!roles.includes(rol)) {
        console.log("no es un rol valido");
        return res.status(400).json({
          message: "Rol no valido",
        });
      }
      if (rol == "admin") {
        console.log("es admin");
        const nuevoAdmin = await insertarDatos(
          "admin",
          ["id_persona"],
          [nuevaPersona]
        );

        if (!nuevoAdmin) {
          return res.status(400).json({
            message: "Error al crear admin",
          });
        }
      } else {
        console.log("es cliente");
        const nuevoCliente = await insertarDatos(
          "cliente",
          ["id_persona"],
          [nuevaPersona]
        );
      }
    } else {
      console.log("es cliente");
      const nuevoCliente = await insertarDatos(
        "cliente",
        ["id_persona"],
        [nuevaPersona]
      );
    }

    res.sendStatus(201);
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

    //Validar si la persona existe
    const persona = await obtenerPorId("persona", personaId);
    if (persona.length <= 0) {
      return res.status(404).json({
        message: "Persona no encontrada",
      });
    }

    const result = await eliminar("persona", personaId);

    if (!result) {
      return res.status(404).json({
        message: "Persona no encontrada",
      });
    }

    res.sendStatus(201);
  } catch (error) {
    return res.status(500).json({
      mesagge: "Error Interno del Servidor",
      error: error.message,
    });
  }
};

export const actualizarPersona = async (req, res) => {
  const { nombres, apellidos, telefono, correo, imagen, usuario, password } =
    req.body;
  const personaId = parseInt(req.params.id, 10);
  try {
    if (isNaN(personaId)) {
      return res.status(400).json({
        message: "ID de persona no válida proporcionada",
      });
    }

    // Validar longitudes máximas
    const Longitudes = {
      nombres: 50,
      apellidos: 50,
      telefono: 15,
      imagen: 60,
      correo: 70,
      usuario: 50,
      password: 255,
    };

    const camposLongitudInvalida = validarLongitudesCampos(
      req.body,
      Longitudes
    );

    if (camposLongitudInvalida) {
      return res.status(400).json({
        message: `El campo ${camposLongitudInvalida} excede la longitud máxima.`,
      });
    }

    // Validar campos únicos

    if (usuario) {
      const usuarioExiste = await validarCampoUnicoUpdate(
        "usuario",
        "usuario",
        "id_persona",
        usuario,
        personaId
      );

      if (usuarioExiste) {
        return res.status(400).json({
          message: `El usuario ${usuario} ya está en uso.`,
        });
      }
    }
    if (correo) {
      const correoExiste = await validarCampoUnicoUpdate(
        "persona",
        "correo",
        "id_persona",
        correo,
        personaId
      );

      if (correoExiste) {
        return res.status(400).json({
          message: `El correo ${correo} ya está en uso.`,
        });
      }
    }

    //Validar si la persona existe
    const persona = await obtenerPorId("persona", personaId);
    console.log(persona);
    if (persona.length <= 0) {
      return res.status(404).json({
        message: "Persona no encontrada",
      });
    }

    //Actualizar Persona
    const campos = ["nombres", "apellidos", "telefono", "correo"];
    const valores = [nombres, apellidos, telefono, correo];
    const result = await actualizarDatos("persona", campos, valores, personaId);

    if (imagen || usuario || password) {
      //Actualizar Usuario
      let passwordHash;
      if (password) {
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password, salt);
        passwordHash = hash;
      }

      const camposUsuario = ["usuario", "imagen", "password"];
      const valoresUsuario = [usuario, imagen, passwordHash];
      const result = await actualizarDatosUsuario(
        camposUsuario,
        valoresUsuario,
        personaId
      );
    }

    res.sendStatus(200);
  } catch (error) {
    return res.status(500).json({
      mesagge: "Error Interno del Servidor",
      error: error.message,
    });
  }
};
