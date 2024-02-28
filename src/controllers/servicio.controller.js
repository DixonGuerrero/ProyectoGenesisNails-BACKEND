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

export const obtenerServicios = async (req, res) => {
  try {
    const servicios = await obtener("servicio");
    return res.status(200).json(servicios);
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

    //validar si el servicio existe
    const servicio = await obtenerPorId("servicio", servicioId);
    if (servicio.length <= 0) {
      return res.status(404).json({
        message: "Servicio no encontrado",
      });
    }

    res.json(servicio[0]);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      mesagge: "Error Interno del Servidor",
      error: error.message,
    });
  }
};

export const crearServicio = async (req, res) => {
  const { tipo_servicio, descripcion_servicio, imagen } = req.body;

  try {
    // Validar longitudes máximas
    const maxLongitudes = {
      tipo_servicio: 200,
      descripcion_servicio: 255,
      imagen: 70,
    };

    const campoInvalido = validarLongitudesCampos(req.body, maxLongitudes);

    if (campoInvalido) {
      return res.status(400).json({
        message: `El campo ${campoInvalido} excede la longitud máxima`,
      });
    }

    //Validar nombre unico
    const nombreServicio = await validarCampoUnico(
      "servicio",
      "tipo_servicio",
      tipo_servicio
    );

    if (nombreServicio) {
      return res.status(400).json({
        message: "Nombre de Servicio ya se encuentra registrado",
      });
    }

    let nuevoServicio;

    if (imagen) {
      //Validar si la imagen ya existe
      const imagenServicio = await validarCampoUnico(
        "servicio",
        "imagen",
        imagen
      );

      if (imagenServicio) {
        return res.status(400).json({
          message: "Imagen de Servicio ya se encuentra registrada",
        });
      }

      //Creacion de servicio con imagen
      nuevoServicio = await insertarDatos(
        "servicio",
        ["tipo_servicio", "descripcion_servicio", "imagen"],
        [tipo_servicio, descripcion_servicio, imagen]
      );

      if (!nuevoServicio) {
        return res.status(400).json({
          message: "Error al crear servicio",
        });
      }
    } else {
      //Insertar servicio
      nuevoServicio = await insertarDatos(
        "servicio",
        ["tipo_servicio", "descripcion_servicio"],
        [tipo_servicio, descripcion_servicio]
      );

      if (!nuevoServicio) {
        return res.status(400).json({
          message: "Error al crear servicio",
        });
      }
    }

    res.sendStatus(201);
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

    //Validar si el servicio existe
    const servicio = await obtenerPorId("servicio", servicioId);
    if (servicio.length <= 0) {
      return res.status(404).json({
        message: "Servicio no encontrado",
      });
    }

    const result = await eliminar("servicio", servicioId);

    if (!result) {
      return res.status(404).json({
        message: "Error no encontrado",
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

export const actualizarServicio = async (req, res) => {
  const { tipo_servicio, descripcion_servicio, imagen } = req.body;
  const servicioId = parseInt(req.params.id, 10);
  try {
    if (isNaN(servicioId)) {
      return res.status(400).json({
        message: "ID de Servicio no valido",
      });
    }

    // Validar longitudes máximas
    const maxLongitudes = {
      tipo_servicio: 200,
      descripcion_servicio: 255,
      imagen: 70,
    };

    const campoInvalido = validarLongitudesCampos(req.body, maxLongitudes);

    if (campoInvalido) {
      return res.status(400).json({
        message: `El campo ${campoInvalido} excede la longitud máxima`,
      });
    }

    if (tipo_servicio) {
      //Validar nombre unico
      const nombreServicio = await validarCampoUnicoUpdate(
        "servicio",
        "tipo_servicio",
        "id_servicio",
        tipo_servicio,
        servicioId
      );
      if (nombreServicio) {
        return res.status(400).json({
          message: "Nombre de Servicio ya se encuentra registrado",
        });
      }
    }

    if (imagen) {
      //Validar si la imagen ya existe
      const imagenServicio = await validarCampoUnicoUpdate(
        "servicio",
        "imagen",
        "id_servicio",
        imagen,
        servicioId
      );
      if (imagenServicio) {
        return res.status(400).json({
          message: "Imagen de Servicio ya se encuentra registrada",
        });
      }
    }

    //Validar si el servicio existe
    const servicio = await obtenerPorId("servicio", servicioId);
    if (servicio.length <= 0) {
      return res.status(404).json({
        message: "Servicio no encontrado",
      });
    }

    //Actualizar servicio
    const campos = ["tipo_servicio", "descripcion_servicio", "imagen"];
    const valores = [tipo_servicio, descripcion_servicio, imagen];

    const result = await actualizarDatos(
      "servicio",
      campos,
      valores,
      servicioId
    );

    if (!result) {
      return res.status(404).json({
        message: "Error en la actualizacion",
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
