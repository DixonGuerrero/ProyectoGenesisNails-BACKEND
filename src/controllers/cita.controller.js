import { pool } from "../db.js";
import {
  obtenerPorId,
  validarLongitudesCampos,
  validarFechaConHora,
  eliminar,
  actualizarDatos,
  insertarDatos,
} from "../utils.js";

export const obtenerCitas = async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT c.id_cita, s.id_servicio,c.fecha_cita,s.imagen, s.tipo_servicio, s.descripcion_servicio, cl.id_cliente FROM cita c JOIN servicio_cita ON c.id_cita = servicio_cita.id_cita JOIN servicio s ON s.id_servicio = servicio_cita.id_servicio JOIN cliente as cl ON cl.id_cliente = c.id_cliente ORDER BY id_cita ASC;"
    );

    console.log(rows);
    res.json(rows);
  } catch (error) {
    return res.status(500).json({
      mesagge: "Error Interno del Servidor",
      error: error.message,
    });
  }
};

export const obtenerCita = async (req, res) => {
  const citaId = parseInt(req.params.id, 10);
  try {
    //Validar ID como numero
    if (isNaN(citaId)) {
      return res.status(400).json({
        message: "El ID de cita no valido ",
      });
    }

    const [rows] = await pool.query(
      "SELECT c.id_cita, s.id_servicio,c.fecha_cita,s.imagen, s.tipo_servicio, s.descripcion_servicio FROM cita c JOIN servicio_cita ON c.id_cita = servicio_cita.id_cita JOIN servicio s ON s.id_servicio = servicio_cita.id_servicio WHERE c.id_cita = ? ORDER BY id_cita ASC ",
      [citaId]
    );

    if (rows.length <= 0)
      return res.status(404).json({
        mesagge: "Cita no encontrada",
      });

    res.json(rows[0]);
  } catch (error) {
    return res.status(500).json({
      mesagge: "Error Interno del Servidor",
      error: error.message,
    });
  }
};

export const crearCita = async (req, res) => {
  const { id_cliente, id_servicio, fecha } = req.body;
  try {
    //Validar longitudes máximas
    const maxLongitudes = {
      id_cliente: 10,
      id_servicio: 10,
      fecha: 20,
    };

    const campoInvalido = validarLongitudesCampos(req.body, maxLongitudes);

    if (campoInvalido) {
      return res.status(400).json({
        message: `Longitud inválida para ${campoInvalido}. Máxima longitud permitida es ${maxLongitudes[campoInvalido]}.`,
      });
    }

    //Validar si el cliente existe
    const cliente = await obtenerPorId("cliente", id_cliente);
    if (cliente.length <= 0) {
      return res.status(400).json({
        message: "Cliente no encontrado",
      });
    }

    //Validar si el servicio existe
    const servicio = await obtenerPorId("servicio", id_servicio);
    if (servicio.length <= 0) {
      return res.status(400).json({
        message: "Servicio no encontrado",
      });
    }

    //Validar fecha valida
    if (!validarFechaConHora(fecha)) {
      return res.status(400).json({
        message: "Fecha no válida",
      });
    }

    //Crear Cita
    const nuevaCita = await insertarDatos(
      "cita",
      ["id_cliente", "fecha_cita"],
      [id_cliente, fecha]
    );

    if (!nuevaCita) {
      return res.status(400).json({
        message: "Error al crear cita",
      });
    }

    //Crear servicio_cita
    const nuevoServicioCita = await insertarDatos(
      "servicio_cita",
      ["id_servicio", "id_cita"],
      [id_servicio, nuevaCita]
    );

    if (!nuevoServicioCita) {
      return res.status(400).json({
        message: "Error al crear servicio_cita",
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

export const eliminarCita = async (req, res) => {
  const citaId = parseInt(req.params.id, 10);
  try {
    if (isNaN(citaId)) {
      return res.status(400).json({
        message: "ID de cita no valido",
      });
    }

    const result = await eliminar("cita", citaId);
    if (!result) {
      return res.status(404).json({
        message: "Cita no encontrada",
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

export const actualizarCita = async (req, res) => {
  const { id_servicio, fecha } = req.body;
  const citaId = parseInt(req.params.id, 10);
  try {
    if (isNaN(citaId)) {
      return res.status(400).json({
        message: "ID de cita no valido",
      });
    }

    //Validar longitudes máximas
    const maxLongitudes = {
      id_servicio: 10,
      fecha: 20,
    };

    const campoInvalido = validarLongitudesCampos(req.body, maxLongitudes);

    if (campoInvalido) {
      return res.status(400).json({
        message: `Longitud inválida para ${campoInvalido}. Máxima longitud permitida es ${maxLongitudes[campoInvalido]}.`,
      });
    }

    //Validar si la cita existe
    const cita = await obtenerPorId("cita", citaId);
    if (cita.length <= 0) {
      return res.status(400).json({
        message: "Cita no encontrada",
      });
    }

    if (fecha) {
      //Validar fecha valida
      if (!validarFechaConHora(fecha)) {
        return res.status(400).json({
          message: "Fecha no válida",
        });
      }
    }

    if (id_servicio) {
      //Validar si el servicio existe
      const servicio = await obtenerPorId("servicio", id_servicio);
      if (servicio.length <= 0) {
        return res.status(400).json({
          message: "Servicio no encontrado",
        });
      }
    }

    //Actualizar Cita
    const campos = ["fecha_cita"];
    const valores = [fecha];
    const result = await actualizarDatos("cita", campos, valores, citaId);

    if (!result) {
      return res.status(404).json({
        message: "Cita no encontrada",
      });
    }

    if (id_servicio) {
      //Actualizar servicio_cita
      const campos = ["id_servicio"];
      const valores = [id_servicio];
      const result = await actualizarDatos(
        "servicio_cita",
        campos,
        valores,
        citaId
      );

      if (!result) {
        return res.status(404).json({
          message: "Servicio no encontrado",
        });
      }
    }

    res.sendStatus(200);
  } catch (error) {
    return res.status(500).json({
      mesagge: "Error Interno del Servidor",
      error: error.message,
    });
  }
};
