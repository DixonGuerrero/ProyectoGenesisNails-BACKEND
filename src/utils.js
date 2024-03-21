import { pool } from "./db.js";

export const obtener = async (tabla) => {
  try {
    const [rows] = await pool.query(`SELECT * FROM ${tabla}`);
    return rows;
  } catch (error) {
    return error;
  }
};

export const obtenerPorId = async (tabla, id) => {
  try {
    const [rows] = await pool.query(
      `SELECT * FROM ${tabla} WHERE id_${tabla} = ?`,
      [id]
    );
    return rows;
  } catch (error) {
    return error;
  }
};

export const obtenerPorIdPersona = async (tabla, id) => {
  try {
    const [rows] = await pool.query(
      `SELECT * FROM ${tabla} WHERE id_persona = ?`,
      [id]
    );
    return rows;
  } catch (error) {
    return error;
  }
};

export const obtenerPorCampo = async (tabla, campo, valor) => {
  try {
    const [rows] = await pool.query(
      `SELECT * FROM ${tabla} WHERE ${campo} = ?`,
      [valor]
    );
    return rows;
  } catch (error) {
    
    return error;
  }
};

export const eliminar = async (tabla, id) => {
  try {
    await pool.query(`DELETE FROM ${tabla} WHERE id_${tabla} = ?`, [id]);
    return true;
  } catch (error) {
    return error;
  }
};

export function validarLongitudesCampos(fields, maxLongitudes) {
  for (const [field, maxLength] of Object.entries(maxLongitudes)) {
    if (fields[field] && fields[field].length > maxLength) {
      return field; // Retorna el nombre del campo que no cumple con la longitud máxima.
    }
  }
  return null; // Todos los campos cumplen con sus longitudes máximas.
}

export const validarCampoUnico = async (tabla, campo, valor) => {
  try {
    const query = `SELECT id_${tabla} FROM ${tabla} WHERE ${campo} = ?`;
    const [rows] = await pool.query(query, [valor]);
    if (rows.length > 0) {
      return campo; // Retorna el nombre del campo que no es único.
    }
    return null; // El campo es único.
  } catch (error) {
    console.error(error);
    throw new Error("Error al validar la unicidad del campo.");
  }
};

export const insertarDatos = async (tabla, campos, valores) => {
  try {
    const query = `INSERT INTO ${tabla} (${campos.join(", ")}) VALUES (${Array(
      campos.length
    )
      .fill("?")
      .join(", ")})`;
    console.log(query);
    const [rows] = await pool.query(query, valores);
    console.log(rows);
    if (rows.affectedRows > 0) {
      return rows.insertId;
    }

    return false;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const actualizarDatos = async (tabla, campos, valores, id) => {
  console.log(valores);
  try {
    const query = `UPDATE ${tabla} SET ${campos
      .map((campo) => `${campo} = IFNULL(?,${campo})`)
      .join(", ")} WHERE id_${tabla} = ?`;
    console.log(query);

    // Aquí combinamos 'valores' e 'id' en un solo array
    const parametros = [...valores, id];
    const [rows] = await pool.query(query, parametros);

    if (rows.affectedRows > 0) {
      return true;
    }

    return false;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const actualizarDatosUsuario = async (campos, valores, id) => {
  console.log(valores);
  try {
    // Construye la parte SET de la consulta SQL
    const setClause = campos
      .map((campo) => `${campo} = IFNULL(?, ${campo})`)
      .join(", ");

    // Construye la consulta completa
    const query = `UPDATE usuario SET ${setClause} WHERE id_persona = ?`;
    console.log(query);

    // Combina los valores y el id en un solo array para pasar a la consulta
    const parametrosConsulta = [...valores, id];

    // Ejecuta la consulta con los parámetros
    const [rows] = await pool.query(query, parametrosConsulta);

    // Chequea si se afectaron filas y retorna true o false
    return rows.affectedRows > 0;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const validarCampoUnicoUpdate = async (
  tabla,
  campo,
  campo_id,
  valor,
  id
) => {
  try {
    const query = `SELECT id_${tabla} FROM ${tabla} WHERE ${campo} = ? AND ${campo_id} != ?`;
    const [rows] = await pool.query(query, [valor, id]);
    if (rows.length > 0) {
      return campo; // Retorna el nombre del campo que no es único.
    }
    return null; // El campo es único.
  } catch (error) {
    console.error(error);
    throw new Error("Error al validar la unicidad del campo.");
  }
};

export function validarFechaConHora(fecha) {
  // La expresión regular ahora incluye un patrón para la hora y los minutos después de la 'T'
  const regex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;
  if (!fecha.match(regex)) {
    return false; // Formato inválido
  }

  // Extraemos la fecha y la hora por separado antes de convertirlos a números
  const [fechaParte, horaParte] = fecha.split("T");
  const [year, month, day] = fechaParte.split("-").map(Number);
  const [hours, minutes] = horaParte.split(":").map(Number);

  // Creamos un objeto de fecha con la fecha y la hora
  const date = new Date(year, month - 1, day, hours, minutes);

  // Verificamos que cada parte de la fecha coincida con la entrada
  return (
    date.getFullYear() === year &&
    date.getMonth() + 1 === month &&
    date.getDate() === day &&
    date.getHours() === hours &&
    date.getMinutes() === minutes
  );
}
