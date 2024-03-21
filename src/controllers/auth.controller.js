import {
  obtenerPorCampo,
  insertarDatos,
  validarCampoUnico,
  validarLongitudesCampos,
} from "../utils.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { SECRET_KEY } from "../config.js";

export const login = async (req, res) => {
  const { usuario, password } = req.body;

  try {
    const rows = await obtenerPorCampo("usuario", "usuario", usuario);

    console.log(rows)

    if (rows.length <= 0)
      return res.status(404).json({
        message: "Usuario no encontrado",
      });

    const validPassword = bcrypt.compareSync(password, rows[0].password);

    if (!validPassword) {
      return res.status(400).json({
        message: "Contraseña incorrecta",
      });
    }



    const token = jwt.sign({ id: rows[0].id_persona }, SECRET_KEY, {
      expiresIn: 60 * 60 * 24,
    });

    res.status(200).json({
      token,
    });
  } catch (error) {
    return res.status(500).json({
      mesagge: "Error Interno del Servidor",
      error: error.message,
    });
  }
};

export const registrar = async (req, res) => {
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

    //Respuesta Token
    const token = jwt.sign({ id: nuevaPersona }, SECRET_KEY, {
      expiresIn: 60 * 60 * 24,
    });

    res.status(200).json({
      token,
    });
  } catch (error) {
    console.log("BUENAS");
    return res.status(500).json({
      mesagge: "Error Interno del Servidor",
      error: error.message,
    });
  }
};
