import { pool } from "../db.js";
import {
  validarLongitudesCampos,
  obtenerPorId,
  insertarDatos,
} from "../utils.js";

export const obtenerEntradas = async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT s.id_entrada, s.created_at,sp.cantidad AS cantidad_entrada, p.codigo,p.nombre, p.stock, p.precio,p.id_marca,p.id_categoria FROM entrada s JOIN entrada_producto sp ON s.id_entrada = sp.id_entrada JOIN producto p ON sp.id_producto = p.id_producto ORDER BY id_entrada ASC"
    );
    res.json(rows);
  } catch (error) {
    return res.status(500).json({
      mesagge: "Error Interno del Servidor",
      error: error.message,
    });
  }
};

export const obtenerEntrada = async (req, res) => {
  const entradaId = parseInt(req.params.id, 10);
  try {
    if (isNaN(entradaId)) {
      return res.status(400).json({
        message: "El ID de entrada no valido ",
      });
    }
    const [rows] = await pool.query(
      "SELECT s.id_entrada, s.created_at,sp.cantidad AS cantidad_entrada,p.id_producto, p.codigo,p.nombre, p.stock, p.precio,p.id_marca,p.id_categoria FROM entrada s JOIN entrada_producto sp ON s.id_entrada = sp.id_entrada JOIN producto p ON sp.id_producto = p.id_producto  WHERE s.id_entrada = ?",
      [entradaId]
    );

    if (rows.length <= 0)
      return res.status(404).json({
        mesagge: "Entrada no encontrada",
      });
    res.json(rows);
  } catch (error) {
    return res.status(500).json({
      mesagge: "Error Interno del Servidor",
      error: error.message,
    });
  }
};

export const crearEntrada = async (req, res) => {
  const { id_admin, productos = [], id_proveedor } = req.body;

  try {
    // Validar longitudes máximas
    const maxLongitudes = {
      id_admin: 25,
      id_proveedor: 25,
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

    //Validar existencia de proveedor
    const existeProveedor = await obtenerPorId("proveedor", id_proveedor);

    if (existeProveedor.length <= 0) {
      return res.status(404).json({
        message: "Proveedor no encontrado",
      });
    }

    //Crear la entrada
    const nuevaEntrada = await insertarDatos(
      "entrada",
      ["id_admin", "id_proveedor"],
      [id_admin, id_proveedor]
    );
    console.log("AQUI TORY", nuevaEntrada);

    if (!nuevaEntrada) {
      return res.status(400).json({
        message: "Error al crear entrada",
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

    //Insertar los productos en la entrada
    for (const producto of productos) {
      const { id_producto, cantidad, precio } = producto;
      //Validar la existencia del producto
      const productoDB = await obtenerPorId("producto", id_producto);

      if (productoDB[0]) {
        console.log("Insertando Productos");
        //Crear el producto de la entrada
        const insertarProductos = await insertarDatos(
          "entrada_producto",
          ["id_entrada", "id_producto", "cantidad", "precio"],
          [nuevaEntrada, id_producto, cantidad, precio]
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

export const actualizarEntrada = async (req, res) => {
  const { productos = [] } = req.body;
  const entradaId = parseInt(req.params.id, 10);
  try {
    if (isNaN(entradaId)) {
      return res.status(400).json({
        message: "ID de entrada no valido",
      });
    }

    //Validar entrada
    const validarEntrada = await obtenerPorId("entrada", entradaId);

    if (validarEntrada.length <= 0) {
      return res.status(404).json({
        message: "Entrada no encontrada",
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
      const productosNoEncontrados = [];
      for (const producto of productos) {
        const { id_producto } = producto;
        //Validar la existencia del producto
        const productoDB = await pool.query(
          "SELECT * FROM entrada_producto WHERE id_producto = ? AND id_entrada = ?",
          [id_producto, entradaId]
        );

        if (productoDB[0].length <= 0) {
          productosNoEncontrados.push(id_producto);
          continue;
        }
      }

      if (productosNoEncontrados.length > 0) {
        console.log("entramos en la validacion para no encontrados");
        return res.status(400).json({
          message: "Productos no existen o no encontrados dentro de la salida",
          productos: productosNoEncontrados,
        });
      }
    }

    //Actualizar los productos en la entrada
    for (const producto of productos) {
      const { id_producto, cantidad, precio } = producto;
      //Validar la existencia del producto
      const productoDB = await obtenerPorId("producto", id_producto);

      if (productoDB[0]) {
        console.log("Actualizando Productos");
        //Crear el producto de la entrada
        const actualizarEP = await pool.query(
          "UPDATE entrada_producto SET cantidad =IFNULL(?,cantidad) , precio = IFNULL(?,precio) WHERE id_entrada = ? AND id_producto = ?",
          [cantidad, precio, entradaId, id_producto]
        );

        if (!actualizarEP) {
          return res.status(400).json({
            message: "Error al actualizar entrada",
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
