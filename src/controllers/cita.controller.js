import { pool } from "../db.js";


export const obtenerCitas = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT c.id_cita, s.id_servicio,c.fecha_cita, s.tipo_servicio, s.descripcion_servicio FROM cita c JOIN servicio_cita ON c.id_cita = servicio_cita.id_cita JOIN servicio s ON s.id_servicio = servicio_cita.id_servicio ORDER BY id_cita ASC;");
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

    const [rows] = await pool.query("SELECT c.id_cita, s.id_servicio,c.fecha_cita, s.tipo_servicio, s.descripcion_servicio FROM cita c JOIN servicio_cita ON c.id_cita = servicio_cita.id_cita JOIN servicio s ON s.id_servicio = servicio_cita.id_servicio WHERE c.id_cita = ? ORDER BY id_cita ASC ", [
      citaId
    ]);

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
    // Validar longitudes máximas
    const maxLongitudes = {
      id_cliente: 10,
      id_servicio: 10,
      fecha: 20,
    };

    for (const [field, maxLength] of Object.entries(maxLongitudes)) {
      if (req.body[field] && req.body[field].length > maxLength) {
        return res.status(400).json({
          message: `Longitud inválida para ${field}. Máxima longitud permitida es ${maxLength}.`,
        });
      }
    }

    //Validar fecha valida
    if (!validarFechaConHora(fecha)) {
      return res.status(400).json({
        message: "Fecha no válida",
      });
    }

    //Validar cliente existente
    const cliente = await pool.query(
      "SELECT id_cliente FROM cliente WHERE id_cliente = ?",
      [id_cliente]
    );

    if (cliente[0].length <= 0) {
      return res.status(400).json({
        message: "Cliente no encontrado",
      });
    }

    //Validar servicio existente
    let servicio = await pool.query(
      "SELECT * FROM servicio WHERE id_servicio = ?",
      [id_servicio]
    );

    if (servicio[0].length <= 0) {
      return res.status(400).json({
        message: "Servicio no encontrado",
      });
    }

    //Creamos Cita
    const [rows] = await pool.query(
      "INSERT INTO cita ( id_cliente, fecha_cita) VALUES (?,?)",
      [id_cliente, fecha]
    );

    //Crear servicio_cita
    const [rows2] = await pool.query(
      "INSERT INTO servicio_cita ( id_cita, id_servicio ) VALUES (?,?)",
      [rows.insertId, id_servicio]
    );

    servicio = servicio[0][0];
    res.status(201);
    res.send({
      id_cita: rows.insertId,
      id_cliente,
      fecha,
      id_servicio,
      servicio: servicio.tipo_servicio,
      descripcion: servicio.descripcion_servicio,
    });
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
    
        const [result] = await pool.query("DELETE FROM cita WHERE id_cita = ?", [
        req.params.id,
        ]);
    
        if (result.affectedRows <= 0)
        return res.status(404).json({
            mesagge: "Cita no encontrada",
        });
    
        res.sendStatus(204);
    } catch (error) {
        return res.status(500).json({
        mesagge: "Error Interno del Servidor",
        error: error.message,
        });
    }
}

export const actualizarCita = async (req, res) => {
    const {id_servicio, fecha } = req.body;
    const citaId = parseInt(req.params.id, 10);
    try {
        if (isNaN(citaId)) {
        return res.status(400).json({
            message: "ID de cita no valido",
        })
        
        };

        //Validar longitudes máximas
        const maxLongitudes = {
        id_servicio: 10,
        fecha: 20,
        };

        for (const [field, maxLength] of Object.entries(maxLongitudes)) {
        if (req.body[field] && req.body[field].length > maxLength) {
            return res.status(400).json({
            message: `Longitud inválida para ${field}. Máxima longitud permitida es ${maxLength}.`,
            });
        }
        }

        //Validar si la cita existe
        const [cita] = await pool.query(
        "SELECT * FROM cita WHERE id_cita = ?",
        [citaId]
        );

        if (cita.length <= 0) {
        return res.status(404).json({
            message: "Cita no encontrada",
        });
        }


        if(fecha){
            //Validar fecha valida
            if (!validarFechaConHora(fecha)) {
                return res.status(400).json({
                    message: "Fecha no válida",
                });
            }
        }
        
        if(id_servicio){
            //Validar servicio existente
            let servicio = await pool.query(
            "SELECT * FROM servicio WHERE id_servicio = ?",
            [id_servicio]
            );

            if (servicio[0].length <= 0) {
            return res.status(400).json({
                message: "Servicio no encontrado",
            });
            }
        }

        

        //Actualizar Cita
        const [result] = await pool.query(
        "UPDATE cita SET fecha_cita = IFNULL(?,fecha_cita ) WHERE id_cita = ?",
        [ fecha, citaId]
        );

        if(id_servicio){
            //Actualizar servicio_cita
            const [result2] = await pool.query(
            "UPDATE servicio_cita SET id_servicio = IFNULL(?,id_servicio ) WHERE id_cita = ?",
            [ id_servicio, citaId]
            );
        }

    
            
        
        res.status(200).json({
            id_cita: citaId,
        });
    } catch (error) {
        return res.status(500).json({
        mesagge: "Error Interno del Servidor",
        error: error.message,
        });
    }
}






/*
 * Funciones de ayuda
 */

function validarFechaConHora(fecha) {
    // La expresión regular ahora incluye un patrón para la hora y los minutos después de la 'T'
    const regex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;
    if (!fecha.match(regex)) {
        return false; // Formato inválido
    }
    
    // Extraemos la fecha y la hora por separado antes de convertirlos a números
    const [fechaParte, horaParte] = fecha.split('T');
    const [year, month, day] = fechaParte.split('-').map(Number);
    const [hours, minutes] = horaParte.split(':').map(Number);
    
    // Creamos un objeto de fecha con la fecha y la hora
    const date = new Date(year, month - 1, day, hours, minutes);
    
    // Verificamos que cada parte de la fecha coincida con la entrada
    return date.getFullYear() === year && 
           date.getMonth() + 1 === month && 
           date.getDate() === day && 
           date.getHours() === hours &&
           date.getMinutes() === minutes;
}

