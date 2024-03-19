/**
 * Middleware de validación de Persona
 */
export const validacionPersona = (req, res, next) => {
  const jsonData = req.body;
  const camposRequeridos = [
    { nombres: "string" },
    { apellidos: "string" },
    { telefono: "string" },
    { correo: "string" },
    { usuario: "string" },
    { password: "string" },
  ];

  // Verificar la presencia de campos requeridos
  const camposAusentes = verificarCamposRequeridos(jsonData, camposRequeridos);
  if (camposAusentes.length > 0) {
    return res.status(400).json({
      message: `Los siguientes campos son obligatorios: ${camposAusentes
        .map((campo) => Object.keys(campo)[0])
        .join(", ")}`,
    });
  }

  // Validar tipos de datos de los campos
  const tiposDeDatoIncorrectos = verificarTiposDeDato(
    jsonData,
    camposRequeridos
  );
  if (tiposDeDatoIncorrectos.length > 0) {
    return res.status(400).json({
      message: `Los siguientes campos no tienen el tipo de dato correcto: ${tiposDeDatoIncorrectos
        .map((campo) => Object.keys(campo)[0])
        .join(", ")}`,
    });
  }

  // Validar correo electrónico válido
  const correoValido = validarCorreoElectronico(jsonData.correo);
  if (!correoValido) {
    return res.status(400).json({
      message: "El campo de correo electrónico no tiene un formato válido.",
    });
  }

  // Todos los campos requeridos están presentes y no están vacíos, pasar al siguiente middleware
  next();
};

/**
 * Middleware de validación de Usuario
 */
/*export const validacionUsuario = (req, res, next) => {
  const jsonData = req.body;
  const camposRequeridos = [
    { usuario: "string" },
    { password: "string" },
    { id_persona: "number" },
  ];

  // Verificar la presencia de campos requeridos
  const camposAusentes = verificarCamposRequeridos(jsonData, camposRequeridos);
  if (camposAusentes.length > 0) {
    return res.status(400).json({
      mensaje: `Los siguientes campos son obligatorios: ${camposAusentes
        .map((campo) => Object.keys(campo)[0])
        .join(", ")}`,
    });
  }

  // Validar tipos de datos de los campos
  const tiposDeDatoIncorrectos = verificarTiposDeDato(
    jsonData,
    camposRequeridos
  );
  if (tiposDeDatoIncorrectos.length > 0) {
    return res.status(400).json({
      mensaje: `Los siguientes campos no tienen el tipo de dato correcto: ${tiposDeDatoIncorrectos
        .map((campo) => Object.keys(campo)[0])
        .join(", ")}`,
    });
  }

  // Todos los campos requeridos están presentes y no están vacíos, pasar al siguiente middleware
  next();
};*/

/**
 * Middleware de validación de Categoria
 */
export const validacionCategoria = (req, res, next) => {
  const jsonData = req.body;
  const camposRequeridos = [{ nombre: "string" }];

  // Verificar la presencia de campos requeridos
  const camposAusentes = verificarCamposRequeridos(jsonData, camposRequeridos);
  if (camposAusentes.length > 0) {
    return res.status(400).json({
      message: `Los siguientes campos son obligatorios: ${camposAusentes
        .map((campo) => Object.keys(campo)[0])
        .join(", ")}`,
    });
  }

  // Validar tipos de datos de los campos
  const tiposDeDatoIncorrectos = verificarTiposDeDato(
    jsonData,
    camposRequeridos
  );
  if (tiposDeDatoIncorrectos.length > 0) {
    return res.status(400).json({
      message: `Los siguientes campos no tienen el tipo de dato correcto: ${tiposDeDatoIncorrectos
        .map((campo) => Object.keys(campo)[0])
        .join(", ")}`,
    });
  }

  // Todos los campos requeridos están presentes y no están vacíos, pasar al siguiente middleware
  next();
};
/**
 * Middleware de validación de Proveedor
 */
export const validacionProveedor = (req, res, next) => {
  const jsonData = req.body;
  const camposRequeridos = [
    { nombre: "string" },
    { telefono: "string" },
    { email: "string" },
    { nit: "string" },
    { direccion: "string" },
  ];

  // Verificar la presencia de campos requeridos
  const camposAusentes = verificarCamposRequeridos(jsonData, camposRequeridos);
  if (camposAusentes.length > 0) {
    return res.status(400).json({
      message: `Los siguientes campos son obligatorios: ${camposAusentes
        .map((campo) => Object.keys(campo)[0])
        .join(", ")}`,
    });
  }

  // Validar tipos de datos de los campos
  const tiposDeDatoIncorrectos = verificarTiposDeDato(
    jsonData,
    camposRequeridos
  );

  if (tiposDeDatoIncorrectos.length > 0) {
    return res.status(400).json({
      message: `Los siguientes campos no tienen el tipo de dato correcto: ${tiposDeDatoIncorrectos
        .map((campo) => Object.keys(campo)[0])
        .join(", ")}`,
    });
  }

  //Validar email valido
  const emailValido = validarCorreoElectronico(jsonData.email);
  if (!emailValido) {
    return res.status(400).json({
      message: "El campo de correo electrónico no tiene un formato válido.",
    });
  }
  // Todos los campos requeridos están presentes y no están vacíos, pasar al siguiente middleware
  next();
};

/**
 * Middleware de validación de Cliente
 */
/*export const validacionCliente = (req, res, next) => {
  const jsonData = req.body;
  const camposRequeridos = [{ id_persona: "number" }];

  // Verificar la presencia de campos requeridos
  const camposAusentes = verificarCamposRequeridos(jsonData, camposRequeridos);
  if (camposAusentes.length > 0) {
    return res.status(400).json({
      mensaje: `Los siguientes campos son obligatorios: ${camposAusentes
        .map((campo) => Object.keys(campo)[0])
        .join(", ")}`,
    });
  }

  // Validar tipos de datos de los campos
  const tiposDeDatoIncorrectos = verificarTiposDeDato(
    jsonData,
    camposRequeridos
  );
  if (tiposDeDatoIncorrectos.length > 0) {
    return res.status(400).json({
      mensaje: `Los siguientes campos no tienen el tipo de dato correcto: ${tiposDeDatoIncorrectos
        .map((campo) => Object.keys(campo)[0])
        .join(", ")}`,
    });
  }

  // Todos los campos requeridos están presentes y no están vacíos, pasar al siguiente middleware
  next();
};*/

/**
 * Middleware de validación de Empleado
 */

/*export const validacionEmpleado = (req, res, next) => {
  const jsonData = req.body;
  const camposRequeridos = [{ id_persona: "number" }, { cargo: "string" }];

  // Verificar la presencia de campos requeridos
  const camposAusentes = verificarCamposRequeridos(jsonData, camposRequeridos);
  if (camposAusentes.length > 0) {
    return res.status(400).json({
      mensaje: `Los siguientes campos son obligatorios: ${camposAusentes
        .map((campo) => Object.keys(campo)[0])
        .join(", ")}`,
    });
  }

  // Validar tipos de datos de los campos
  const tiposDeDatoIncorrectos = verificarTiposDeDato(
    jsonData,
    camposRequeridos
  );
  if (tiposDeDatoIncorrectos.length > 0) {
    return res.status(400).json({
      mensaje: `Los siguientes campos no tienen el tipo de dato correcto: ${tiposDeDatoIncorrectos
        .map((campo) => Object.keys(campo)[0])
        .join(", ")}`,
    });
  }

  // Todos los campos requeridos están presentes y no están vacíos, pasar al siguiente middleware
  next();
};
*/

/**
 * Middleware de validación de Servicio
 */

export const validacionServicio = (req, res, next) => {
  const jsonData = req.body;
  const camposRequeridos = [
    { tipo_servicio: "string" },
    { descripcion_servicio: "string" },
  ];

  // Verificar la presencia de campos requeridos
  const camposAusentes = verificarCamposRequeridos(jsonData, camposRequeridos);
  if (camposAusentes.length > 0) {
    return res.status(400).json({
      message: `Los siguientes campos son obligatorios: ${camposAusentes
        .map((campo) => Object.keys(campo)[0])
        .join(", ")}`,
    });
  }

  // Validar tipos de datos de los campos
  const tiposDeDatoIncorrectos = verificarTiposDeDato(
    jsonData,
    camposRequeridos
  );
  if (tiposDeDatoIncorrectos.length > 0) {
    return res.status(400).json({
      message: `Los siguientes campos no tienen el tipo de dato correcto: ${tiposDeDatoIncorrectos
        .map((campo) => Object.keys(campo)[0])
        .join(", ")}`,
    });
  }

  // Todos los campos requeridos están presentes y no están vacíos, pasar al siguiente middleware
  next();
};

/**
 * Middleware de validación de Marca
 */

export const validacionMarca = (req, res, next) => {
  const jsonData = req.body;
  const camposRequeridos = [{ nombre: "string" }];

  // Verificar la presencia de campos requeridos
  const camposAusentes = verificarCamposRequeridos(jsonData, camposRequeridos);

  if (camposAusentes.length > 0) {
    return res.status(400).json({
      message: `Los siguientes campos son obligatorios: ${camposAusentes
        .map((campo) => Object.keys(campo)[0])
        .join(", ")}`,
    });
  }

  // Validar tipos de datos de los campos
  const tiposDeDatoIncorrectos = verificarTiposDeDato(
    jsonData,
    camposRequeridos
  );

  if (tiposDeDatoIncorrectos.length > 0) {
    return res.status(400).json({
      message: `Los siguientes campos no tienen el tipo de dato correcto: ${tiposDeDatoIncorrectos
        .map((campo) => Object.keys(campo)[0])
        .join(", ")}`,
    });
  }

  // Todos los campos requeridos están presentes y no están vacíos, pasar al siguiente middleware
  next();
};

/**
 * Middleware de validación de Producto
 */

export const validacionProducto = (req, res, next) => {
  const jsonData = req.body;
  const camposRequeridos = [
    { codigo: "string" },
    { nombre: "string" },
    { stock: "number" },
    { precio: "number" },
    { id_marca: "number" },
    { id_proveedor: "number" },
    { id_categoria: "number" },
  ];

  // Verificar la presencia de campos requeridos
  const camposAusentes = verificarCamposRequeridos(jsonData, camposRequeridos);

  if (camposAusentes.length > 0) {
    return res.status(400).json({
      message: `Los siguientes campos son obligatorios: ${camposAusentes
        .map((campo) => Object.keys(campo)[0])
        .join(", ")}`,
    });
  }

  // Validar tipos de datos de los campos
  const tiposDeDatoIncorrectos = verificarTiposDeDato(
    jsonData,
    camposRequeridos
  );

  if (tiposDeDatoIncorrectos.length > 0) {
    return res.status(400).json({
      message: `Los siguientes campos no tienen el tipo de dato correcto: ${tiposDeDatoIncorrectos
        .map((campo) => Object.keys(campo)[0])
        .join(", ")}`,
    });
  }

  // Todos los campos requeridos están presentes y no están vacíos, pasar al siguiente middleware
  next();
};

/**
 * Middleware de validación de Entrada
 */

export const validacionEntrada = (req, res, next) => {
  const jsonData = req.body;
  const camposRequeridos = [{ id_admin: "number" }, { id_proveedor: "number" }];

  // Verificar la presencia de campos requeridos
  const camposAusentes = verificarCamposRequeridos(jsonData, camposRequeridos);

  if (camposAusentes.length > 0) {
    return res.status(400).json({
      message: `Los siguientes campos son obligatorios: ${camposAusentes
        .map((campo) => Object.keys(campo)[0])
        .join(", ")}`,
    });
  }

  // Validar tipos de datos de los campos
  const tiposDeDatoIncorrectos = verificarTiposDeDato(
    jsonData,
    camposRequeridos
  );

  if (tiposDeDatoIncorrectos.length > 0) {
    return res.status(400).json({
      message: `Los siguientes campos no tienen el tipo de dato correcto: ${tiposDeDatoIncorrectos
        .map((campo) => Object.keys(campo)[0])
        .join(", ")}`,
    });
  }

  // Todos los campos requeridos están presentes y no están vacíos, pasar al siguiente middleware
  next();
};

/**
 * Middleware de validación de Salida
 */

export const validacionSalida = (req, res, next) => {
  const jsonData = req.body;
  const camposRequeridos = [{ id_admin: "number" }];

  // Verificar la presencia de campos requeridos
  const camposAusentes = verificarCamposRequeridos(jsonData, camposRequeridos);

  if (camposAusentes.length > 0) {
    return res.status(400).json({
      message: `Los siguientes campos son obligatorios: ${camposAusentes
        .map((campo) => Object.keys(campo)[0])
        .join(", ")}`,
    });
  }

  // Validar tipos de datos de los campos
  const tiposDeDatoIncorrectos = verificarTiposDeDato(
    jsonData,
    camposRequeridos
  );

  if (tiposDeDatoIncorrectos.length > 0) {
    return res.status(400).json({
      message: `Los siguientes campos no tienen el tipo de dato correcto: ${tiposDeDatoIncorrectos
        .map((campo) => Object.keys(campo)[0])
        .join(", ")}`,
    });
  }

  // Todos los campos requeridos están presentes y no están vacíos, pasar al siguiente middleware
  next();
};

/**
 * Middleware de validación de Cita
 */

export const validacionCita = (req, res, next) => {
  const jsonData = req.body;
  const camposRequeridos = [
    { fecha: "string" },
    { id_servicio: "number" },
    { id_cliente: "number" },
  ];

  // Verificar la presencia de campos requeridos
  const camposAusentes = verificarCamposRequeridos(jsonData, camposRequeridos);

  if (camposAusentes.length > 0) {
    return res.status(400).json({
      message: `Los siguientes campos son obligatorios: ${camposAusentes
        .map((campo) => Object.keys(campo)[0])
        .join(", ")}`,
    });
  }

  // Validar tipos de datos de los campos
  const tiposDeDatoIncorrectos = verificarTiposDeDato(
    jsonData,
    camposRequeridos
  );

  if (tiposDeDatoIncorrectos.length > 0) {
    return res.status(400).json({
      message: `Los siguientes campos no tienen el tipo de dato correcto: ${tiposDeDatoIncorrectos
        .map((campo) => Object.keys(campo)[0])
        .join(", ")}`,
    });
  }

  // Todos los campos requeridos están presentes y no están vacíos, pasar al siguiente middleware
  next();
};

/**
 * Middleware de validación de login
 */

export const validacionLogin = (req, res, next) => {
  const jsonData = req.body;
  const camposRequeridos = [{ usuario: "string" }, { password: "string" }];

  // Verificar la presencia de campos requeridos
  const camposAusentes = verificarCamposRequeridos(jsonData, camposRequeridos);

  if (camposAusentes.length > 0) {
    return res.status(400).json({
      message: `Los siguientes campos son obligatorios: ${camposAusentes
        .map((campo) => Object.keys(campo)[0])
        .join(", ")}`,
    });
  }

  // Todos los campos requeridos están presentes y no están vacíos, pasar al siguiente middleware
  next();
};

/**
 *
 * FUNCIONES ESPECIALES DE AYUDA
 *
 */

//Funcion para validar campos requeridos
function verificarCamposRequeridos(jsonData, camposRequeridos) {
  const camposAusentes = camposRequeridos.filter(
    (campo) => !(Object.keys(campo)[0] in jsonData)
  );

  return camposAusentes;
}

// Función para verificar los tipos de datos de los campos
function verificarTiposDeDato(jsonData, camposRequeridos) {
  const tiposDeDatoIncorrectos = camposRequeridos.filter(
    (campo) =>
      typeof jsonData[Object.keys(campo)[0]] !== Object.values(campo)[0]
  );

  return tiposDeDatoIncorrectos;
}

// Función para validar un correo electrónico
function validarCorreoElectronico(correo) {
  const expresionRegular = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return expresionRegular.test(correo);
}

//Funcion para validar una fecha valida
function validarFecha(fecha) {
  const expresionRegular = /^\d{4}-\d{2}-\d{2}$/;
  return expresionRegular.test(fecha);
}
