import {
  obtener,
  obtenerPorId,
  actualizarDatos,
  insertarDatos,
  validarCampoUnico,
  validarLongitudesCampos,
  eliminar,
  validarCampoUnicoUpdate,
} from "../utils.js";

export const obtenerCategorias = async (req, res) => {
  try {
    const categorias = await obtener("categoria");
    return res.status(200).json(categorias);
  } catch (error) {
    return res.status(500).json({
      message: "Error Interno del Servidor",
      error: error.message,
    });
  }
};

export const obtenerCategoria = async (req, res) => {
  const { id } = req.params;
  try {
    const categoria = await obtenerPorId("categoria", id);
    if (categoria.length <= 0) {
      return res.status(404).json({
        message: "Categoria no encontrada",
      });
    }
    res.json(categoria[0]);
  } catch (error) {
    return res.status(500).json({
      mesagge: "Error Interno del Servidor",
      error: error.message,
    });
  }
};

export const crearCategoria = async (req, res) => {
  const { nombre } = req.body;
  try {
    const campos = { nombre };
    const maxLongitudes = { nombre: 50 };
    const campoInvalido = validarLongitudesCampos(campos, maxLongitudes);
    if (campoInvalido) {
      return res.status(400).json({
        message: `El campo ${campoInvalido} excede la longitud máxima`,
      });
    }
    const campoUnico = await validarCampoUnico("categoria", "nombre", nombre);
    if (campoUnico) {
      return res.status(400).json({
        message: `El nombre de la categoria ya existe`,
      });
    }
    const nuevaCategoria = await insertarDatos(
      "categoria",
      ["nombre"],
      [nombre]
    );
    if (!nuevaCategoria) {
      return res.status(400).json({
        message: "Error al crear categoria",
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

export const actualizarCategoria = async (req, res) => {
  const { id } = req.params;
  const { nombre } = req.body;
  try {
    //Validar ID valido
    if (isNaN(id)) {
      return res.status(400).json({
        message: "ID de categoria no valido",
      });
    }

    const campos = { nombre };
    const maxLongitudes = { nombre: 50 };
    const campoInvalido = validarLongitudesCampos(campos, maxLongitudes);
    if (campoInvalido) {
      return res.status(400).json({
        message: `El campo ${campoInvalido} excede la longitud máxima`,
      });
    }

    //validar si la categoria existe
    const categoria = await obtenerPorId("categoria", id);
    if (categoria.length <= 0) {
      return res.status(404).json({
        message: "Categoria no encontrada",
      });
    }

    //Validar campo unico
    const campoUnico = await validarCampoUnicoUpdate(
      "categoria",
      "nombre",
      "id_categoria",
      nombre,
      id
    );
    if (campoUnico) {
      return res.status(400).json({
        message: `El nombre de la categoria ya existe`,
      });
    }

    //Actualizar categoria
    const categoriaActualizada = await actualizarDatos(
      "categoria",
      ["nombre"],
      nombre,
      id
    );

    res.sendStatus(200);
  } catch (error) {
    return res.status(500).json({
      mesagge: "Error Interno del Servidor",
      error: error.message,
    });
  }
};

export const eliminarCategoria = async (req, res) => {
  const { id } = req.params;
  try {
    //Validar ID valido
    if (isNaN(id)) {
      return res.status(400).json({
        message: "ID de categoria no valido",
      });
    }

    //validar si la categoria existe
    const categoria = await obtenerPorId("categoria", id);
    if (categoria.length <= 0) {
      return res.status(404).json({
        message: "Categoria no encontrada",
      });
    }

    const categoriaEliminada = await eliminar("categoria", id);
    if (!categoriaEliminada) {
      return res.status(400).json({
        message: "Error al eliminar categoria",
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
