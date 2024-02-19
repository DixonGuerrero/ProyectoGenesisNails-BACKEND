import {pool} from "../db.js";

export const obtenerProductos = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT p.id_producto , p.codigo, p.nombre, p. cantidad, p.precio , pr.nombre as proveedor FROM producto as p JOIN proveedor_producto as pp ON p.id_producto = pp.id_producto JOIN proveedor as pr ON pp.id_proveedor = pr.id_proveedor ORDER BY id_producto ASC");

    res.json(rows);
  } catch (error) {
    return res.status(500).json({
      mesagge: "Error Interno del Servidor",
      error: error.message,
    });
  }
}

export const obtenerProducto = async (req, res) => {  
  const productoId = parseInt(req.params.id, 10);
  try {
    //Validar ID como numero
    if (isNaN(productoId)) {
      return res.status(400).json({
        message: "El ID de producto no valido ",
      });
    }

    //Realizamos la consulta
    const [rows] = await pool.query(
      "SELECT p.id_producto , p.codigo, p.nombre, p. cantidad, p.precio , pr.nombre as proveedor FROM producto as p JOIN proveedor_producto as pp ON p.id_producto = pp.id_producto JOIN proveedor as pr ON pp.id_proveedor = pr.id_proveedor WHERE p.id_producto = ?",
      [productoId]
    );

    if (rows.length <= 0)
      return res.status(404).json({
        mesagge: "Producto no encontrado",
      });

    res.json(rows[0]);
  } catch (error) {
    return res.status(500).json({
      mesagge: "Error Interno del Servidor",
      error: error.message,
    });
  }
}

export const crearProducto = async (req, res) => {
  const { codigo, nombre, cantidad, precio, id_marca, id_proveedor } = req.body;
  try {
    // Validar longitudes máximas
    const maxLongitudes = {
      codigo: 25,
      nombre: 50,
      cantidad: 10,
      precio: 10,
      id_marca: 10,
      id_proveedor: 10,
    };

    for (const [field, maxLength] of Object.entries(maxLongitudes)) {
      if (req.body[field] && req.body[field].length > maxLength) {
        return res.status(400).json({
          message: `Longitud inválida para ${field}. Máxima longitud permitida es ${maxLength}.`,
        });
      }
    }

    //Validacion Campos unicos(nombre, Codigo)
    const codigoExiste = await pool.query(
      "SELECT id_producto FROM producto WHERE codigo = ?",
      [codigo]
    );

    if (codigoExiste[0].length > 0) {
      return res.status(400).json({
        message: "Codigo ya se encuentra registrado",
      });
    }

    const nombreExiste = await pool.query(
      "SELECT id_producto FROM producto WHERE nombre = ?",
      [nombre]
    );

    if (nombreExiste[0].length > 0) {
      return res.status(400).json({
        message: "Nombre ya se encuentra registrado",
      });
    }
    
    //Validar proveedor existente
    const proveedor = await pool.query( "SELECT id_proveedor FROM proveedor WHERE id_proveedor = ?", [id_proveedor]);

    if (proveedor[0].length <= 0) {
      return res.status(400).json({
        message: "Proveedor no encontrado",
      });
    }

  
    //Validar marca existente
    const marca = await pool.query( "SELECT id_marca FROM marca WHERE id_marca = ?", [id_marca]);

    if (marca[0].length <= 0) {
      return res.status(400).json({
        message: "Marca no encontrada",
      });
    }

    
    //Realizamos la creacion
    const [rows] = await pool.query(
      "INSERT INTO producto ( codigo, nombre, cantidad, precio, id_marca ) VALUES (?,?,?,?,?)",
      [codigo, nombre, cantidad, precio, id_marca]
    );


    //Realizamos la creacion en proveedor_producto
    const [rows2] = await pool.query(
      "INSERT INTO proveedor_producto ( id_producto, id_proveedor ) VALUES (?,?)",
      [rows.insertId, id_proveedor]
    );

    res.status(201);
    res.send({
      id_producto: rows.insertId,
      codigo,
      nombre,
      cantidad,
      precio,
      id_marca,
      id_proveedor,
    });
  } catch (error) {
    return res.status(500).json({
      mesagge: "Error Interno del Servidor",
      error: error.message,
    });
  }
}

export const eliminarProducto = async (req, res) => {
  const productoId = parseInt(req.params.id, 10);
  try {
    if (isNaN(productoId)) {
      return res.status(400).json({
        message: "ID de Producto no valido",
      });
    }

    const [result] = await pool.query(
      "DELETE FROM producto WHERE id_producto = ?",
      [productoId]
    );

    if (result.affectedRows <= 0)
      return res.status(404).json({
        mesagge: "Producto no encontrado",
      });

    res.sendStatus(204); 
  } catch (error) {
    return res.status(500).json({
      mesagge: "Error Interno del Servidor",
      error: error.message,
    });
  }
}

export const actualizarProducto = async (req, res) => {
  const { codigo, nombre, cantidad, precio, id_marca, id_proveedor } = req.body;
  const productoId = parseInt(req.params.id, 10);
  try {
    if (isNaN(productoId) || isNaN(id_marca) || isNaN(id_proveedor)){
      return res.status(400).json({
        message: "ID producto, marca o proveedor no valido",
      });
    }

    //Validar longitudes máximas
    const maxLongitudes = {
      codigo: 25,
      nombre: 50,
      cantidad: 10,
      precio: 10,
      id_marca: 10,
      id_proveedor: 10,
    };

    for (const [field, maxLength] of Object.entries(maxLongitudes)) {
      if (req.body[field] && req.body[field].length > maxLength) {
        return res.status(400).json({
          message: `Longitud inválida para ${field}. Máxima longitud permitida es ${maxLength}.`,
        });
      }
    }

    //Validar campos unicos (nombre, codigo)
    if(codigo){
      const codigoExiste = await pool.query(
        "SELECT id_producto FROM producto WHERE codigo = ? AND id_producto != ?",
        [codigo,productoId]
      );
  
      if (codigoExiste[0].length > 0) {
        return res.status(400).json({
          message: "Codigo ya se encuentra registrado",
        });
      }
    }

    if(nombre){
      const nombreExiste = await pool.query(
        "SELECT id_producto FROM producto WHERE nombre = ? AND id_producto != ?",
        [nombre,productoId]
      );
  
      if (nombreExiste[0].length > 0) {
        return res.status(400).json({
          message: "Nombre ya se encuentra registrado",
        });
      }
    }

    

    //Validar marca existente
    if(id_marca){
      const marca = await pool.query( "SELECT id_marca FROM marca WHERE id_marca = ?", [id_marca]);

    if (marca[0].length <= 0) {
      return res.status(400).json({
        message: "Marca no encontrada",
      });
    }
    }

    //Realizamos la Actualizacion
    const [result] = await pool.query(
      "UPDATE producto SET codigo = IFNULL(?, codigo), nombre = IFNULL(?, nombre), cantidad = IFNULL(?, cantidad), precio = IFNULL(?, precio), id_marca = IFNULL(?, id_marca) WHERE id_producto = ?",
      [codigo, nombre, cantidad, precio, id_marca, productoId]
    );

    if(id_proveedor){
      //Realizamos la actualizacion de proveedor
      const [result2] = await pool.query(
        "UPDATE proveedor_producto SET id_proveedor = IFNULL(?,id_proveedor) WHERE id_producto = ?",
        [id_proveedor, productoId]
      );
    }

    if (result.affectedRows <= 0)
      return res.status(404).json({
        mesagge: "Producto no encontrado",
      });

    res.sendStatus(204);
  } catch (error) {
    return res.status(500).json({
      mesagge: "Error Interno del Servidor",
      error: error.message,
    });
  }
}