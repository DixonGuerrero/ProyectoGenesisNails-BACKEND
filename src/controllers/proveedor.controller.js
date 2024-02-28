import { pool } from "../db.js";
import {
  validarLongitudesCampos,
  obtener,
  obtenerPorId,
  validarCampoUnico,
  insertarDatos,
  eliminar,
  actualizarDatos,
  validarCampoUnicoUpdate,
} from "../utils.js";

export const obtenerProveedores = async (req, res) => {
  try {
    const proveedores = await obtener("proveedor");
    return res.status(200).json(proveedores);
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

    const proveedor = await obtenerPorId("proveedor", proveedorId);
    if (proveedor.length <= 0) {
      return res.status(404).json({
        message: "Proveedor no encontrado",
      });
    }

    res.json(proveedor[0]);
  } catch (error) {
    return res.status(500).json({
      mesagge: "Error Interno del Servidor",
      error: error.message,
    });
  }
};

export const crearProveedor = async (req, res) => {
  const { nombre, telefono, email, nit, direccion } = req.body;
  try {
    // Validar longitudes máximas
    const maxLongitudes = {
      nombre: 100,
      telefono: 20,
      email: 255,
      nit: 25,
      direccion: 50,
    };

    const campoInvalido = validarLongitudesCampos(req.body, maxLongitudes);

    if (campoInvalido) {
      return res.status(400).json({
        message: `Longitud inválida para ${campoInvalido}.`,
      });
    }

    //Validacion Nit como unico
    const nitProveedor = await validarCampoUnico("proveedor", "nit", nit);

    if (nitProveedor) {
      return res.status(400).json({
        message: "NIT ya se encuentra registrado",
      });
    }

    //Validacion nombre como unico
    const nombreProveedor = await validarCampoUnico(
      "proveedor",
      "nombre",
      nombre
    );

    if (nombreProveedor) {
      return res.status(400).json({
        message: "Nombre ya se encuentra registrado",
      });
    }

    //Validacion email como unico
    const emailProveedor = await validarCampoUnico("proveedor", "email", email);

    if (emailProveedor) {
      return res.status(400).json({
        message: "Email ya se encuentra registrado",
      });
    }

    //Registro de Proveedor en BD
    const result = await insertarDatos(
      "proveedor",
      ["nombre", "telefono", "email", "nit", "direccion"],
      [nombre, telefono, email, nit, direccion]
    );

    if (!result) {
      return res.status(400).json({
        message: "Error al crear proveedor",
      });
    }

    res.sendStatus(201);
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

    const result = await eliminar("proveedor", proveedorId);
    if (!result) {
      return res.status(404).json({
        message: "Proveedor no encontrado",
      });
    }

    res.sendStatus(200);
  } catch (error) {
    return res.status(500).json({
      mesagge: "Error Interno del Servidor",
      error: error.message,
    });
  }
};

export const actualizarProveedor = async (req, res) => {
  const { id } = req.params;
  const { nombre, telefono, email, nit, direccion } = req.body;

  try {
    if (isNaN(id)) {
      return res.status(400).json({
        message: "ID de proveedor no valido",
      });
    }

    // Validar longitudes máximas
    const maxLongitudes = {
      nombre: 100,
      telefono: 20,
      email: 255,
      nit: 25,
      direccion: 50,
    };

    const campoInvalido = validarLongitudesCampos(req.body, maxLongitudes);

    if (campoInvalido) {
      return res.status(400).json({
        message: `Longitud inválida para ${campoInvalido}.`,
      });
    }

    if (nit) {
      // Validar nit como Unico
      const nitExiste = await validarCampoUnicoUpdate(
        "proveedor",
        "nit",
        "id_proveedor",
        nit,
        id
      );

      if (nitExiste) {
        return res.status(400).json({
          message: "El NIT ya se encuentra registrado",
        });
      }
    }

    //Validar si viene el email
    if (email) {
      // Validar email como Unico
      const emailExiste = await validarCampoUnicoUpdate(
        "proveedor",
        "email",
        "id_proveedor",
        email,
        id
      );

      if (emailExiste) {
        return res.status(400).json({
          message: "El Email ya se encuentra registrado",
        });
      }
    }

    //Validar si viene el nombre
    if (nombre) {
      // Validar nombre como Unico
      const nombreExiste = await validarCampoUnicoUpdate(
        "proveedor",
        "nombre",
        "id_proveedor",
        nombre,
        id
      );

      if (nombreExiste) {
        return res.status(400).json({
          message: "El Nombre ya se encuentra registrado",
        });
      }
    }

    //Actualizar Proveedor

    const campos = ["nombre", "telefono", "email", "nit", "direccion"];
    const valores = [nombre, telefono, email, nit, direccion];
    const result = await actualizarDatos("proveedor", campos, valores, id);

    if (!result) {
      return res.status(400).json({
        message: "Error al actualizar proveedor",
      });
    }

    res.sendStatus(200);
  } catch (error) {
    return res.status(500).json({
      mesagge: "Error Interno del Servidor",
      error: error.message,
    });
  }
};
