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

export const obtenerMarcas = async (req, res) => {
  try {
    const marcas = await obtener("marca");
    return res.status(200).json(marcas);
  } catch (error) {
    return res.status(500).json({
      mesagge: "Error Interno del Servidor",
      error: error.message,
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

    const marca = await obtenerPorId("marca", marcaId);
    if (marca.length <= 0) {
      return res.status(404).json({
        message: "Marca no encontrada",
      });
    }

    res.json(marca[0]);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Error Interno del Servidor",
      error: error.message,
    });
  }
};

export const crearMarca = async (req, res) => {
  const { nombre } = req.body;

  try {
    // Validar longitudes máximas
    const maxLongitudes = {
      nombre: 25,
    };

    const campoInvalido = validarLongitudesCampos(req.body, maxLongitudes);

    if (campoInvalido) {
      return res.status(400).json({
        message: `Longitud inválida para ${campoInvalido}. Máxima longitud permitida es ${maxLongitudes[campoInvalido]}.`,
      });
    }

    //Validar nombre unico
    const campoUnico = await validarCampoUnico("marca", "nombre", nombre);

    if (campoUnico) {
      return res.status(400).json({
        message: "Nombre de Marca ya se encuentra registrado",
      });
    }

    //Crear Marca
    const nuevaMarca = await insertarDatos("marca", ["nombre"], [nombre]);

    if (!nuevaMarca) {
      return res.status(400).json({
        message: "Error al crear Marca",
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

export const eliminarMarca = async (req, res) => {
  const marcaId = parseInt(req.params.id, 10);
  try {
    if (isNaN(marcaId)) {
      return res.status(400).json({
        message: "ID de Marca no valido",
      });
    }

    //validar si la marca existe
    const marca = await obtenerPorId("marca", marcaId);
    if (marca.length <= 0) {
      return res.status(404).json({
        message: "Marca no encontrada",
      });
    }

    const result = await eliminar("marca", marcaId);
    if (!result) {
      return res.status(404).json({
        message: "Marca no encontrada",
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

export const actualizarMarca = async (req, res) => {
  const { nombre } = req.body;
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
    };

    const campoInvalido = validarLongitudesCampos(req.body, maxLongitudes);

    if (campoInvalido) {
      return res.status(400).json({
        message: `Longitud inválida para ${campoInvalido}. Máxima longitud permitida es ${maxLongitudes[campoInvalido]}.`,
      });
    }

    //Validar nombre unico
    const campoUnico = await validarCampoUnicoUpdate(
      "marca",
      "nombre",
      "id_marca",
      nombre,
      marcaId
    );

    if (campoUnico) {
      return res.status(400).json({
        message: "Nombre de Marca ya se encuentra registrado",
      });
    }

    //Validar si la marca existe
    const marca = await obtenerPorId("marca", marcaId);
    if (marca.length <= 0) {
      return res.status(404).json({
        message: "Marca no encontrada",
      });
    }

    //Actualizar Marca
    const marcaActualizada = await actualizarDatos(
      "marca",
      ["nombre"],
      [nombre],
      marcaId
    );

    if (!marcaActualizada) {
      return res.status(400).json({
        message: "Error al actualizar Marca",
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
