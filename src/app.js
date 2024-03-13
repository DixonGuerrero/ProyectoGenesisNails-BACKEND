import express from "express";
import cors from "cors";
//import usuarioRoutes from "./routes/usuario.routes.js";
import personaRoutes from "./routes/persona.routes.js";
import proveedorRoutes from "./routes/proveedor.routes.js";
import categoriaRoutes from "./routes/categoria.routes.js";
//import clienteRoutes from "./routes/cliente.routes.js"
//import empleadoRoutes from "./routes/empleado.routes.js"
import marcaRoutes from "./routes/marca.routes.js";
import servicioRoutes from "./routes/servicio.routes.js";
import productoRoutes from "./routes/producto.routes.js";
import entradaRoutes from "./routes/entrada.routes.js";

import citaRoutes from "./routes/cita.routes.js";

import authRoutes from "./routes/auth.routes.js";

import salidaRoutes from "./routes/salida.routes.js";


const app = express();
app.use(express.json());
app.use(cors());

//app.use("/api/", usuarioRoutes);
app.use("/api/persona/", personaRoutes);
app.use("/api/proveedor/", proveedorRoutes);
app.use("/api/categoria/", categoriaRoutes);
//app.use("/api/", clienteRoutes);
//app.use("/api/", empleadoRoutes);
app.use("/api/servicio/", servicioRoutes);
app.use("/api/marca/", marcaRoutes);
app.use("/api/salida/", salidaRoutes);
app.use("/api/producto/", productoRoutes);
app.use("/api/entrada/", entradaRoutes);
app.use("/api/cita/", citaRoutes);
app.use("/api/", authRoutes);

//La ruta no existe
app.use((req, res) => {
  res.status(404).json({
    message: "Ruta no encontrada",
  });
});







export default app;
