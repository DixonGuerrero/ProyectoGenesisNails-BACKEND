import { pool } from "../db.js";
import {
  validarLongitudesCampos,
  obtenerPorId,
  insertarDatos,
} from "../utils.js";

export const obtenerSalidas = async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT s.id_salida, s.created_at,sp.cantidad AS cantidad_salida, p.codigo,p.nombre, p.stock, p.precio,p.id_marca,p.id_categoria FROM salida s JOIN salida_producto sp ON s.id_salida = sp.id_salida JOIN producto p ON sp.id_producto = p.id_producto ORDER BY id_salida ASC"
    );
    res.json(rows);
  } catch (error) {
    return res.status(500).json({
      mesagge: "Error Interno del Servidor",
      error: error.message,
    });
  }
};

export const obtenerSalida = async (req, res) => {
  const salidaId = parseInt(req.params.id, 10);
  try {
    if (isNaN(salidaId)) {
      return res.status(400).json({
        message: "El ID de salida no valido ",
      });
    }
    const [rows] = await pool.query(
      "SELECT s.id_salida, s.created_at,sp.cantidad AS cantidad_salida,p.id_producto, p.codigo,p.nombre, p.stock, p.precio,p.id_marca,p.id_categoria FROM salida s JOIN salida_producto sp ON s.id_salida = sp.id_salida JOIN producto p ON sp.id_producto = p.id_producto  WHERE s.id_salida = ?",
      [salidaId]
    );

    if (rows.length <= 0)
      return res.status(404).json({
        mesagge: "salida no encontrada",
      });
    res.json(rows);
  } catch (error) {
    return res.status(500).json({
      mesagge: "Error Interno del Servidor",
      error: error.message,
    });
  }
};

export const crearSalida = async (req, res) => {
  const { id_admin, productos = [] } = req.body;

  try {
    // Validar longitudes máximas
    const maxLongitudes = {
      id_admin: 25,
    };

    const camposLongitudInvalida = validarLongitudesCampos(
      req.body,
      maxLongitudes
    );
    if (camposLongitudInvalida) {
      return res.status(400).json({
        message: `Longitud inválida para ${camposLongitudInvalida}. Máxima longitud permitida es ${maxLongitudes[camposLongitudInvalida]}.`,
      });
    }

    //Validar existencia de admin
    const existeAdmin = await obtenerPorId("admin", id_admin);

    if (existeAdmin.length <= 0) {
      return res.status(404).json({
        message: "Admin no encontrado",
      });
    }

    //Crear la salida
    const nuevaSalida = await insertarDatos("salida", ["id_admin"], [id_admin]);
    console.log("AQUI TORY", nuevaSalida);

    if (!nuevaSalida) {
      return res.status(400).json({
        message: "Error al crear salida",
      });
    }

    //Validar si vienen productos
    if (!productos || productos.length <= 0) {
      return res.status(400).json({
        message: "Debe ingresar al menos un producto",
      });
    }

    //Validar si vienen varios productos
    if (productos.length > 1) {
      //Validar que todos los productos existan
      const productosNoEncontrados = [];
      for (const producto of productos) {
        const { id_producto } = producto;
        //Validar la existencia del producto
        const productoDB = await obtenerPorId("producto", id_producto);

        if (!productoDB[0]) {
          productosNoEncontrados.push(id_producto);
          continue;
        }
      }

      if (productosNoEncontrados.length > 0)
        return res.status(400).json({
          message: "Productos no encontrados",
          productos: productosNoEncontrados,
        });
      console.log("DESPUES DE PRODUCTOS NO ENCONTRADOS");
    }

    console.log("hora de insertar los productos");

    //Insertar los productos salida
    for (const producto of productos) {
      const { id_producto, cantidad } = producto;
      //Validar la existencia del producto
      const productoDB = await obtenerPorId("producto", id_producto);

      if (productoDB[0]) {
        console.log("Insertando Productos");
        //Crear el producto de la salida
        const insertarProductos = await insertarDatos(
          "salida_producto",
          ["id_salida", "id_producto", "cantidad"],
          [nuevaSalida, id_producto, cantidad]
        );

        continue;
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

export const actualizarSalida = async (req, res) => {
  const { productos = [] } = req.body;
  const salidaId = parseInt(req.params.id, 10);
  try {
    if (isNaN(salidaId)) {
      return res.status(400).json({
        message: "ID de salida no valido",
      });
    }

    //Validar salida
    const validarSalida = await obtenerPorId("salida", salidaId);

    if (validarSalida.length <= 0) {
      return res.status(404).json({
        message: "salida no encontrada",
      });
    }

    //Validar si vienen productos
    if (!productos || productos.length <= 0) {
      return res.status(400).json({
        message: "Debe ingresar al menos un producto",
      });
    }

    //Validamos cuantos productos vienen
    if (productos.length >= 1) {
      //Validar que todos los productos existan
      let productosNoEncontrados = [];
      for (const producto of productos) {
        const { id_producto } = producto;
        //Validar la existencia del producto
        const productoDB = await pool.query(
          "SELECT * FROM salida_producto WHERE id_producto = ? AND id_salida = ?",
          [id_producto, salidaId]
        );

        if (productoDB[0].length <= 0) {
          productosNoEncontrados.push(id_producto);
          continue;
        }
      }
      console.log("Productos no encontrados", productosNoEncontrados);

      if (productosNoEncontrados.length > 0) {
        console.log("entramos en la validacion para no encontrados");
        return res.status(400).json({
          message: "Productos no existen o no encontrados dentro de la salida",
          productos: productosNoEncontrados,
        });
      }
    }

    //Actualizar los productos en la salida
    for (const producto of productos) {
      const { id_producto, cantidad } = producto;
      //Validar la existencia del producto
      const productoDB = await obtenerPorId("producto", id_producto);

      if (productoDB[0]) {
        console.log("Actualizando Productos");
        //Crear el producto de la salida
        const actualizarEP = await pool.query(
          "UPDATE salida_producto SET cantidad =IFNULL(?,cantidad) WHERE id_salida = ? AND id_producto = ?",
          [cantidad, salidaId, id_producto]
        );

        if (!actualizarEP) {
          return res.status(400).json({
            message: "Error al actualizar salida",
          });
        }

        continue;
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
