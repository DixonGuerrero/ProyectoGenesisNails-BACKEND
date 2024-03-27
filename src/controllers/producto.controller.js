import { pool } from "../db.js";
import {
  obtenerPorCampo,
  obtenerPorId,
  validarLongitudesCampos,
  validarCampoUnico,
  insertarDatos,
  eliminar,
  actualizarDatos,
  validarCampoUnicoUpdate,
} from "../utils.js";

export const obtenerProductos = async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT p.id_producto , p.codigo, p.nombre, p. stock, p.precio ,p.imagen, pr.nombre as proveedor, m.nombre as marca, c.nombre as categoria FROM producto as p JOIN proveedor_producto as pp ON p.id_producto = pp.id_producto JOIN proveedor as pr ON pp.id_proveedor = pr.id_proveedor JOIN marca as m ON m.id_marca = p.id_marca JOIN categoria as c ON p.id_categoria = c.id_categoria ORDER BY id_producto ASC"
    );

    res.json(rows);
  } catch (error) {
    return res.status(500).json({
      mesagge: "Error Interno del Servidor",
      error: error.message,
    });
  }
};

export const obtenerProductosPorProveedor = async (req, res) => {
  const proveedorId = parseInt(req.params.id, 10);
  try {
    //Validar ID como numero
    if (isNaN(proveedorId)) {
      return res.status(400).json({
        message: "El ID de proveedor no valido ",
      });
    }

    //Validar proveedor existente
    const proveedor = await obtenerPorId("proveedor", proveedorId);

    if (proveedor.length <= 0) {
      return res.status(400).json({
        message: "Proveedor no encontrado",
      });
    }

    //Realizamos la consulta
    const [rows] = await pool.query(
      "SELECT p.id_producto , p.codigo, p.nombre, p. stock, p.precio , pr.nombre as proveedor, m.nombre as marca, c.nombre as categoria FROM producto as p JOIN proveedor_producto as pp ON p.id_producto = pp.id_producto JOIN proveedor as pr ON pp.id_proveedor = pr.id_proveedor JOIN marca as m ON m.id_marca = p.id_marca JOIN categoria as c ON p.id_categoria = c.id_categoria WHERE pr.id_proveedor = ? ORDER BY id_producto ASC",
      [proveedorId]
    );

    if (rows.length <= 0)
      return res.status(404).json({
        mesagge: "Producto no encontrado",
      });

    res.json(rows);
  } catch (error) {
    return res.status(500).json({
      mesagge: "Error Interno del Servidor",
      error: error.message,
    });
  }
};

export const obtenerProductosPorMarca = async (req, res) => {
  const marcaId = parseInt(req.params.id, 10);
  try {
    //Validar ID como numero

    if (isNaN(marcaId)) {
      return res.status(400).json({
        message: "El ID de marca no valido ",
      });
    }

    //Validar marca existente
    const marca = await obtenerPorId("marca", marcaId);

    if (marca.length <= 0) {
      return res.status(400).json({
        message: "Marca no encontrada",
      });
    }

    //Realizamos la consulta
    const [rows] = await pool.query(
      "SELECT p.id_producto , p.codigo, p.nombre, p. stock, p.precio , pr.nombre as proveedor, m.nombre as marca, c.nombre as categoria FROM producto as p JOIN proveedor_producto as pp ON p.id_producto = pp.id_producto JOIN proveedor as pr ON pp.id_proveedor = pr.id_proveedor JOIN marca as m ON m.id_marca = p.id_marca JOIN categoria as c ON p.id_categoria = c.id_categoria WHERE m.id_marca = ? ORDER BY id_producto ASC",
      [marcaId]
    );

    if (rows.length <= 0)
      return res.status(404).json({
        mesagge: "Producto no encontrado",
      });

    res.json(rows);
  } catch (error) {
    return res.status(500).json({
      mesagge: "Error Interno del Servidor",
      error: error.message,
    });
  }
};

export const obtenerProductosPorCategoria = async (req, res) => {
  const categoriaId = parseInt(req.params.id, 10);
  try {
    //Validar ID como numero
    if (isNaN(categoriaId)) {
      return res.status(400).json({
        message: "El ID de categoria no valido ",
      });
    }

    //Validar categoria existente
    const categoria = await obtenerPorId("categoria", categoriaId);

    if (categoria.length <= 0) {
      return res.status(400).json({
        message: "Categoria no encontrada",
      });
    }

    //Realizamos la consulta
    const [rows] = await pool.query(
      "SELECT p.id_producto , p.codigo, p.nombre, p. stock, p.precio , pr.nombre as proveedor, m.nombre as marca, c.nombre as categoria FROM producto as p JOIN proveedor_producto as pp ON p.id_producto = pp.id_producto JOIN proveedor as pr ON pp.id_proveedor = pr.id_proveedor JOIN marca as m ON m.id_marca = p.id_marca JOIN categoria as c ON p.id_categoria = c.id_categoria WHERE c.id_categoria = ? ORDER BY id_producto ASC",
      [categoriaId]
    );

    if (rows.length <= 0)
      return res.status(404).json({
        mesagge: "Producto no encontrado",
      });

    res.json(rows);
  } catch (error) {
    return res.status(500).json({
      mesagge: "Error Interno del Servidor",
      error: error.message,
    });
  }
};

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
      "SELECT p.id_producto , p.codigo, p.nombre, p. stock, p.precio,p.imagen , pr.nombre as proveedor, m.nombre as marca, c.nombre as categoria FROM producto as p JOIN proveedor_producto as pp ON p.id_producto = pp.id_producto JOIN proveedor as pr ON pp.id_proveedor = pr.id_proveedor JOIN marca as m ON m.id_marca = p.id_marca JOIN categoria as c ON p.id_categoria = c.id_categoria WHERE p.id_producto = ?",
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
};

export const crearProducto = async (req, res) => {
  const {
    codigo,
    nombre,
    stock,
    precio,
    id_marca,
    id_proveedor,
    id_categoria,
    imagen,
  } = req.body;
  try {
    // Validar longitudes máximas
    const maxLongitudes = {
      codigo: 25,
      nombre: 50,
      stock: 10,
      precio: 10,
      id_marca: 10,
      id_proveedor: 10,
      id_categoria: 10,
      imagen: 70,
    };

    const campoInvalido = validarLongitudesCampos(req.body, maxLongitudes);

    if (campoInvalido) {
      return res.status(400).json({
        message: `Longitud inválida para ${campoInvalido}.`,
      });
    }

    //Validacion Campos unicos(nombre, Codigo)
    const codigoExiste = await validarCampoUnico("producto", "codigo", codigo);

    if (codigoExiste) {
      return res.status(400).json({
        message: "Codigo ya se encuentra registrado",
      });
    }

    const nombreExiste = await validarCampoUnico("producto", "nombre", nombre);

    if (nombreExiste) {
      return res.status(400).json({
        message: "Nombre ya se encuentra registrado",
      });
    }

    //Validar proveedor existente
    const proveedor = await obtenerPorId("proveedor", id_proveedor);

    if (proveedor.length <= 0) {
      return res.status(400).json({
        message: "Proveedor no encontrado",
      });
    }

    //Validar marca existente
    const marca = await obtenerPorId("marca", id_marca);

    if (marca.length <= 0) {
      return res.status(400).json({
        message: "Marca no encontrada",
      });
    }

    //Validar si categoria existe
    const categoria = await obtenerPorId("categoria", id_categoria);

    if (categoria.length <= 0) {
      return res.status(400).json({
        message: "Categoria no encontrada",
      });
    }

    let nuevoProducto;
    if (!imagen) {
      //Realizamos la creacion
      nuevoProducto = await insertarDatos(
        "producto",
        ["codigo", "nombre", "stock", "precio", "id_marca", "id_categoria"],
        [codigo, nombre, stock, precio, id_marca, id_categoria]
      );

      if (!nuevoProducto) {
        return res.status(400).json({
          message: "Error al crear Producto",
        });
      }
    } else {
      //Realizamos la creacion
      nuevoProducto = await insertarDatos(
        "producto",
        [
          "codigo",
          "nombre",
          "stock",
          "precio",
          "id_marca",
          "id_categoria",
          "imagen",
        ],
        [codigo, nombre, stock, precio, id_marca, id_categoria, imagen]
      );
    }

    //Realizamos la creacion en proveedor_producto
    const nuevoProveedorProducto = await insertarDatos(
      "proveedor_producto",
      ["id_proveedor", "id_producto"],
      [id_proveedor, nuevoProducto]
    );

    if (!nuevoProveedorProducto) {
      return res.status(400).json({
        message: "Error al crear Producto",
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

export const eliminarProducto = async (req, res) => {
  const productoId = parseInt(req.params.id, 10);
  try {
    if (isNaN(productoId)) {
      return res.status(400).json({
        message: "ID de Producto no valido",
      });
    }

    //validar si producto existe
    const producto = await obtenerPorId("producto", productoId);
    if (producto.length <= 0) {
      return res.status(404).json({
        message: "Producto no encontrado",
      });
    }

    //Realizamos la eliminacion
    const result = await eliminar("producto", productoId);

    if (!result) {
      return res.status(404).json({
        message: "Producto no encontrado",
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

export const actualizarProducto = async (req, res) => {
  const {
    codigo,
    nombre,
    stock,
    precio,
    id_marca,
    id_proveedor,
    id_categoria,
    imagen,
  } = req.body;
  const productoId = parseInt(req.params.id, 10);
  try {
    if (isNaN(productoId)) {
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
      id_categoria: 10,
      imagen: 70,
    };

    const campoInvalido = validarLongitudesCampos(req.body, maxLongitudes);

    if (campoInvalido) {
      return res.status(400).json({
        message: `Longitud inválida para ${campoInvalido}.`,
      });
    }

    //Validar campos unicos (nombre, codigo)
    if (codigo) {
      const codigoExiste = await validarCampoUnicoUpdate(
        "producto",
        "codigo",
        "id_producto",
        codigo,
        productoId
      );

      if (codigoExiste) {
        return res.status(400).json({
          message: "Codigo ya se encuentra registrado",
        });
      }
    }

    if (nombre) {
      const nombreExiste = await validarCampoUnicoUpdate(
        "producto",
        "nombre",
        "id_producto",
        nombre,
        productoId
      );

      if (nombreExiste) {
        return res.status(400).json({
          message: "Nombre ya se encuentra registrado",
        });
      }
    }

    //Validar marca existente
    if (id_marca) {
      const marca = await obtenerPorId("marca", id_marca);
      if (marca.length <= 0) {
        return res.status(400).json({
          message: "Marca no encontrada",
        });
      }
    }

    //Validar si categoria existe
    if (id_categoria) {
      const categoria = await obtenerPorId("categoria", id_categoria);
      if (categoria.length <= 0) {
        return res.status(400).json({
          message: "Categoria no encontrada",
        });
      }
    }

    //Validar proveedor existente
    if (id_proveedor) {
      const proveedor = await obtenerPorId("proveedor", id_proveedor);
      if (proveedor.length <= 0) {
        return res.status(400).json({
          message: "Proveedor no encontrado",
        });
      }
    }

    //validar si producto existe
    const producto = await obtenerPorId("producto", productoId);
    if (producto.length <= 0) {
      return res.status(404).json({
        message: "Producto no encontrado",
      });
    }

    //Realizamos la Actualizacion
    const campos = [
      "codigo",
      "nombre",
      "stock",
      "precio",
      "id_marca",
      "id_categoria",
      "imagen",
    ];
    const valores = [
      codigo,
      nombre,
      stock,
      precio,
      id_marca,
      id_categoria,
      imagen,
    ];
    const productoUpdate = await actualizarDatos(
      "producto",
      campos,
      valores,
      productoId
    );

    console.log(productoUpdate);
    console.log(nombre);

    if (!productoUpdate) {
      return res.status(404).json({
        message: "Error al actualizar Producto",
      });
    }

    if (id_proveedor) {
      //Realizamos la actualizacion de proveedor
      const campos = ["id_proveedor"];
      const valores = [id_proveedor];
      const proveedorUpdate = await actualizarDatos(
        "proveedor_producto",
        campos,
        valores,
        productoId
      );
    }

    res.sendStatus(200);
  } catch (error) {
    return res.status(500).json({
      mesagge: "Error Interno del Servidor",
      error: error.message,
    });
  }
};
