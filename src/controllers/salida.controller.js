import { pool } from '../db.js';

export const obtenerSalidas = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT s.id_salida, s.fecha, sp.cantidad AS cantidad_salida, p.codigo, p.nombre, p.cantidad AS cantidad_stock, p.precio, p.id_marca FROM salida s JOIN salida_producto sp ON s.id_salida = sp.id_salida JOIN producto p ON sp.id_producto = p.id_producto ORDER BY id_salida ASC');
    res.json(rows);
  } catch (error) {
    return res.status(500).json({
      message: 'Error Interno del Servidor',
      error: error.message
    });
  }
};

export const obtenerSalida = async (req, res) => { 
  const salidaId = parseInt(req.params.id, 10);
  try {
    if (isNaN(salidaId)) {
      return res.status(400).json({
        message: 'El ID de salida no valido '
      });
    }
    const [rows] = await pool.query('SELECT s.id_salida, s.fecha, sp.cantidad AS cantidad_salida, p.codigo, p.nombre, p.cantidad AS cantidad_stock, p.precio, p.id_marca FROM salida s JOIN salida_producto sp ON s.id_salida = sp.id_salida JOIN producto p ON sp.id_producto = p.id_producto WHERE s.id_salida = ?', [salidaId]);

    if (rows.length <= 0) return res.status(404).json({
      message: 'Salida no encontrada'
    });
    res.json(rows);
  } catch (error) {
    return res.status(500).json({
      message: 'Error Interno del Servidor',
      error: error.message
    });
  }
};

export const crearSalida = async (req, res) => { 
  const { id_empleado, productos = [], fecha } = req.body;
  
  try {
    // Validar longitudes máximas
    const maxLongitudes = {
      id_empleado: 25,
      fecha: 15,
    };
    for (const [field, maxLength] of Object.entries(maxLongitudes)) {
      if (req.body[field] && req.body[field].length > maxLength) {
        return res.status(400).json({
          message: `Longitud inválida para ${field}. Máxima longitud permitida es ${maxLength}.`
        });
      }
    }
    // Validar Fecha
    if (fecha && !/^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
      return res.status(400).json({
        message: 'Formato de fecha invalido'
      });
    }
    //Validar existencia de empleado
    const empleado = await pool.query('SELECT id_empleado FROM empleado WHERE id_empleado = ?', [id_empleado]);
    if (empleado[0].length <= 0) {
      return res.status(400).json({
        message: 'Empleado no encontrado'
      });
    }
    
    //Crear la salida
    const [rows2] = await pool.query('INSERT INTO salida (id_empleado, fecha) VALUES (?,?)', [id_empleado, fecha]);

    //Validar si vienen productos
    if (!productos || productos.length <= 0) {
      return res.status(400).json({
        message: 'Debe ingresar al menos un producto'
      });
    }

    //Validar si vienen varios productos
    if (productos.length > 1) {
      //Crear los productos de la salida
      const productosNoEncontrados = [];
      for (const producto of productos) {
        const { id_producto, cantidad } = producto;
        //Validar la existencia del producto
        const productoDB = await pool.query('SELECT id_producto FROM producto WHERE id_producto = ?', [id_producto]);

        if (productoDB[0].length <= 0) {
          productosNoEncontrados.push(id_producto);
          continue;
        }

        const [rows] = await pool.query('INSERT INTO salida_producto (id_salida, id_producto, cantidad) VALUES (?,?,?)', [rows2.insertId, id_producto, cantidad]);
      }

      if (productosNoEncontrados.length > 0) return res.status(400).json({
        message: 'Productos no encontrados',
        productos: productosNoEncontrados
      });
    } else {
      const { id_producto, cantidad } = productos[0];
      //Validar la existencia del producto
      const productoDB = await pool.query('SELECT id_producto FROM producto WHERE id_producto = ?', [id_producto]);

      if (productoDB[0].length <= 0) {
        return res.status(400).json({
          message: 'Producto no encontrado'
        });
      }

      const [rows3] = await pool.query('INSERT INTO salida_producto (id_salida, id_producto, cantidad) VALUES (?,?,?)', [rows2.insertId, id_producto, cantidad]);
    }

    res.status(201).json({
      message: 'Salida creada'
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Error Interno del Servidor',
      error: error.message
    });
  }
};

export const actualizarSalida = async (req, res) => {  
    const { id_empleado, productos = [], fecha } = req.body;
    const salidaId = parseInt(req.params.id, 10);
    try {
      if (isNaN(salidaId)) {
        return res.status(400).json({
          message: 'ID de salida no valido'
        });
      }
  
      // Validar longitudes máximas
      const maxLongitudes = {
        cantidad: 10,
        fecha: 15
      };
      for (const [field, maxLength] of Object.entries(maxLongitudes)) {
        if (req.body[field] && req.body[field].length > maxLength) {
          return res.status(400).json({
            message: `Longitud inválida para ${field}. Máxima longitud permitida es ${maxLength}.`
          });
        }
      }
  
      // Validar fecha
      if(fecha){
        if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
          return res.status(400).json({
            message: 'Formato de fecha invalido'
          });
        }
      }
  
      // Validar salida
      const salida = await pool.query('SELECT id_salida FROM salida WHERE id_salida = ?', [salidaId]);
      if (salida[0].length <= 0) {
        return res.status(404).json({
          message: 'Salida no encontrada'
        });
      }
  
      // Validar si vienen productos
      if (productos || productos.length > 0) {
        
        // Validamos cuantos productos vienen
        if (productos.length > 1) {
          // Actualizar los productos de la salida
          const productosNoEncontrados = [];
          for (const producto of productos) {
            const { id_producto, cantidad } = producto;
            // Validar la existencia del producto
            const productoDB = await pool.query('SELECT id_producto FROM producto WHERE id_producto = ?', [id_producto]);
  
            if (productoDB[0].length <= 0) {
              productosNoEncontrados.push(id_producto);
              continue;
            }
  
            await pool.query('UPDATE salida_producto SET cantidad = IFNULL(?, cantidad) WHERE id_salida = ? AND id_producto = ?', [cantidad, salidaId, id_producto]);
          }
  
          if (productosNoEncontrados.length > 0) return res.status(400).json({
            message: 'Productos no encontrados',
            productos: productosNoEncontrados
          });
        } else {
          const { id_producto, cantidad } = productos[0];
          // Validar la existencia del producto
          const productoDB = await pool.query('SELECT id_producto FROM producto WHERE id_producto = ?', [id_producto]);
  
          if (productoDB[0].length <= 0) {
            return res.status(400).json({
              message: 'Producto no encontrado'
            });
          }
  
          await pool.query('UPDATE salida_producto SET cantidad = ? WHERE id_salida = ? AND id_producto = ?', [cantidad, salidaId, id_producto]);
        }
      }
  
      // Actualizar salida
      if (fecha) {
        await pool.query('UPDATE salida SET fecha = ? WHERE id_salida = ?', [fecha, salidaId]);
      }
  
      res.json({
        message: 'Salida actualizada'
      });
    } catch (error) {
      return res.status(500).json({
        message: 'Error Interno del Servidor',
        error: error.message
      });
    }
  };
  