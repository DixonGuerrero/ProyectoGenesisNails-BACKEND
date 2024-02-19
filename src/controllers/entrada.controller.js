import {pool} from '../db.js'

export const obtenerEntradas = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT s.id_entrada, s.fecha,sp.cantidad AS cantidad_entrada, p.codigo,p.nombre, p.cantidad AS cantidad_stock, p.precio,p.id_marca FROM entrada s JOIN entrada_producto sp ON s.id_entrada = sp.id_entrada JOIN producto p ON sp.id_producto = p.id_producto ORDER BY id_entrada ASC')
    res.json(rows)
  } catch (error) {
    return res.status(500).json({
      mesagge: 'Error Interno del Servidor',
      error: error.message
    })
  }
}

export const obtenerEntrada = async (req, res) => { 
  const entradaId = parseInt(req.params.id, 10)
  try {
    if (isNaN(entradaId)) {
      return res.status(400).json({
        message: 'El ID de entrada no valido '
      })
    }
    const [rows] = await pool.query('SELECT s.id_entrada, s.fecha,sp.cantidad AS cantidad_entrada, p.codigo,p.nombre, p.cantidad AS cantidad_stock, p.precio,p.id_marca FROM entrada s JOIN entrada_producto sp ON s.id_entrada = sp.id_entrada JOIN producto p ON sp.id_producto = p.id_producto  WHERE s.id_entrada = ?', [entradaId])

    if (rows.length <= 0) return res.status(404).json({
      mesagge: 'Entrada no encontrada'
    })
    res.json(rows)
  } catch (error) {
    return res.status(500).json({
      mesagge: 'Error Interno del Servidor',
      error: error.message
    })
  }
}

export const crearEntrada = async (req, res) => { 
  const {id_empleado,productos = [], fecha} = req.body
  
  try {
    // Validar longitudes máximas
    const maxLongitudes = {
      id_empleado: 25,
      fecha:15,
    }
    for (const [field, maxLength] of Object.entries(maxLongitudes)) {
      if (req.body[field] && req.body[field].length > maxLength) {
        return res.status(400).json({
          message: `Longitud inválida para ${field}. Máxima longitud permitida es ${maxLength}.`
        })
      }
    }
    // Validar Fecha
    if (fecha && !/^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
      return res.status(400).json({
        message: 'Formato de fecha invalido'
      })
    }
    //Validar existencia de empleado
    const empleado = await pool.query('SELECT id_empleado FROM empleado WHERE id_empleado = ?', [id_empleado])
    if (empleado[0].length <= 0) {
      return res.status(400).json({
        message: 'Empleado no encontrado'
      })
    }
    
    //Crear la entrada
    const [rows2] = await pool.query('INSERT INTO entrada (id_empleado, fecha) VALUES (?,?)', [id_empleado, fecha])

    //Validar si vienen productos
    if (!productos || productos.length <= 0) {
      return res.status(400).json({
        message: 'Debe ingresar al menos un producto'
      })
    }

    //Validar si vienen varios productos
    if (productos.length > 1) {
          //Crear los productos de la entrada
    const productosNoEncontrados = [];
    for (const producto of productos) {
      const {id_producto, cantidad} = producto
      //Validar la existencia del producto
      const productoDB = await pool.query('SELECT id_producto FROM producto WHERE id_producto = ?', [id_producto])

      if (productoDB[0].length <= 0) {
        productosNoEncontrados.push(id_producto)
        continue
      }

      const [rows] = await pool.query('INSERT INTO entrada_producto (id_entrada, id_producto, cantidad) VALUES (?,?,?)', [rows2.insertId, id_producto, cantidad])
    }

    if(productosNoEncontrados.length > 0) return res.status(400).json({
      message: 'Productos no encontrados',
      productos: productosNoEncontrados
    })
    } else {
      const {id_producto, cantidad} = productos[0]
      //Validar la existencia del producto
      const productoDB = await pool.query('SELECT id_producto FROM producto WHERE id_producto = ?', [id_producto])

      if (productoDB[0].length <= 0) {
        return res.status(400).json({
          message: 'Producto no encontrado'
        })
      }

      const [rows3] = await pool.query('INSERT INTO entrada_producto (id_entrada, id_producto, cantidad) VALUES (?,?,?)', [rows2.insertId, id_producto, cantidad])

    }

    
    res.status(201).json({
      mesagge: 'Entrada creada'
    
    })
  
  } catch (error) {
    return res.status(500).json({
      mesagge: 'Error Interno del Servidor',
      error: error.message
    })
  }
}


export const actualizarEntrada = async (req, res) => {  
  const {productos = [], fecha,} = req.body
  const entradaId = parseInt(req.params.id, 10)
  try {
    if (isNaN(entradaId)) {
      return res.status(400).json({
        message: 'ID de entrada no valido'
      })
    }
    // Validar longitudes máximas
    const maxLongitudes = {
      cantidad: 10,
      fecha: 15
    }
    for (const [field, maxLength] of Object.entries(maxLongitudes)) {
      if (req.body[field] && req.body[field].length > maxLength) {
        return res.status(400).json({
          message: `Longitud inválida para ${field}. Máxima longitud permitida es ${maxLength}.`
        })
      }
    }

    //validar fecha
    if(fecha){
      if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
        return res.status(400).json({
          message: 'Formato de fecha invalido'
        })
      }
    }

    //Validar entrada
    const entrada = await pool.query('SELECT id_entrada FROM entrada WHERE id_entrada = ?', [entradaId])
    if (entrada[0].length <= 0) {
      return res.status(404).json({
        message: 'Entrada no encontrada'
      })
    }

    //Validar si vienen productos
    if (productos || productos.length > 0) {
      
      //Validamos cuantos productos vienen
      if (productos.length > 1) {
        //Crear los productos de la entrada
        const productosNoEncontrados = [];
        for (const producto of productos) {
          const {id_producto, cantidad} = producto
          //Validar la existencia del producto
          const productoDB = await pool.query('SELECT id_producto FROM producto WHERE id_producto = ?', [id_producto])

          if (productoDB[0].length <= 0) {
            productosNoEncontrados.push(id_producto)
            continue
          }

          const [rows7] = await pool.query('UPDATE entrada_producto SET cantidad = IFNULL(?,cantidad) WHERE id_entrada = ? AND id_producto = ?', [cantidad, entradaId, id_producto])
        }

        if(productosNoEncontrados.length > 0) return res.status(400).json({
          message: 'Productos no encontrados',
          productos: productosNoEncontrados
        })
      } else {
        const {id_producto, cantidad} = productos[0]
        //Validar la existencia del producto
        const productoDB = await pool.query('SELECT id_producto FROM producto WHERE id_producto = ?', [id_producto])

        if (productoDB[0].length <= 0) {
          return res.status(400).json({
            message: 'Producto no encontrado'
          })
        }

        const [rows3] = await pool.query('UPDATE entrada_producto SET cantidad = ? WHERE id_entrada = ? AND id_producto = ?', [cantidad, entradaId, id_producto])

      }
    }

    //Actualizar entrada
    if(fecha){
      const [rows5] = await pool.query('UPDATE entrada SET fecha = ? WHERE id_entrada = ?', [fecha, entradaId])

      if(rows5.affectedRows <= 0) return res.status(404).json({
        mesagge: 'Entrada no encontrada'
      })
    }

    const [rows] = await pool.query('UPDATE entrada SET id_empleado = IFNULL(?,id_empleado), fecha = IFNULL(?,fecha) WHERE id_entrada = ?', [id_empleado, fecha, entradaId])
    if (rows.affectedRows <= 0) return res.status(404).json({
      mesagge: 'Entrada no encontrada'
    })
    res.json({
      mesagge: 'Entrada actualizada'
    })
  } catch (error) {
    return res.status(500).json({
      mesagge: 'Error Interno del Servidor',
      error: error.message
    })
  }
}
