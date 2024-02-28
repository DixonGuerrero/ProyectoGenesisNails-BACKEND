CREATE DATABASE ProyectoNails;
USE ProyectoNails;

-- Creacion de la tabla persona
CREATE TABLE IF NOT EXISTS persona(
  id_persona INT(15) NOT NULL AUTO_INCREMENT,
  nombres VARCHAR(50) NOT NULL,
  apellidos VARCHAR(50) NOT NULL,
  telefono VARCHAR(15) NOT NULL,
  correo VARCHAR(70) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id_persona)
  );
 
 -- Creacion de la tabla Usuario
 CREATE TABLE IF NOT EXISTS usuario(
 id_usuario INT NOT NULL AUTO_INCREMENT,
 id_persona INT NOT NULL,
 imagen VARCHAR(60) NOT NULL DEFAULT('default.jpg'),
 usuario VARCHAR(50) NOT NULL,
 password VARCHAR(255) NOT NULL ,
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
 	PRIMARY KEY (id_usuario),
 	CONSTRAINT FK_PERSONA 
 	FOREIGN KEY (id_persona)
 	REFERENCES persona (id_persona)
	ON DELETE CASCADE
 );
 

-- Creacion de la tabla empleado
CREATE TABLE IF NOT EXISTS admin(
  id_admin INT NOT NULL AUTO_INCREMENT,
  id_persona INT(25) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id_admin, id_persona),
  CONSTRAINT FK_PERSONA_ADMIN
    FOREIGN KEY (id_persona)
    REFERENCES persona (id_persona)
	ON DELETE CASCADE
    );

-- Creacion de la tabla cliente
CREATE TABLE IF NOT EXISTS cliente(
  id_cliente INT NOT NULL AUTO_INCREMENT,
  id_persona INT(25) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id_cliente, id_persona),
  CONSTRAINT FK_PERSONA_CLIENTE
    FOREIGN KEY (id_persona)
    REFERENCES persona (id_persona)
    ON DELETE CASCADE
    );

-- Creacion de la tabla servicio
CREATE TABLE IF NOT EXISTS servicio(
  id_servicio INT NOT NULL AUTO_INCREMENT,
  imagen VARCHAR(50) NOT NULL DEFAULT('default.jpg'),
  tipo_servicio VARCHAR(25) NOT NULL,
  descripcion_servicio TEXT NULL,
  PRIMARY KEY (id_servicio)
  );


-- Creacion de la tabla cita
CREATE TABLE IF NOT EXISTS cita(
  id_cita INT NOT NULL AUTO_INCREMENT,
  id_cliente INT NOT NULL,
  fecha_cita DATE NOT NULL,
  PRIMARY KEY (id_cita, id_cliente),
  CONSTRAINT FK_CLIENTE_CITA
    FOREIGN KEY (id_cliente)
    REFERENCES cliente (id_cliente)
    ON DELETE CASCADE,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Creacion de la tabla servicio_cita
CREATE TABLE IF NOT EXISTS servicio_cita(
  id_servicio INT NOT NULL,
  id_cita INT NOT NULL,
  PRIMARY KEY (id_servicio, id_cita),
  CONSTRAINT FK_SERVICIO
    FOREIGN KEY (id_servicio)
    REFERENCES servicio (id_servicio)
    ON DELETE CASCADE,
  CONSTRAINT FK_CITA
    FOREIGN KEY (id_cita)
    REFERENCES cita (id_cita)
ON DELETE CASCADE
    );

-- Creacion de la tabla salida
CREATE TABLE IF NOT EXISTS salida(
  id_salida INT NOT   NULL AUTO_INCREMENT,
  id_admin INT NOT NULL,
  PRIMARY KEY (id_salida , id_admin),
  CONSTRAINT FK_ADMIN_SALIDA
    FOREIGN KEY (id_admin)
    REFERENCES admin (id_admin)
ON DELETE CASCADE,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );

-- Creacion de la tabla categoria
CREATE TABLE IF NOT EXISTS categoria(
  id_categoria INT NOT NULL AUTO_INCREMENT,
  nombre VARCHAR(50) NOT NULL,
  PRIMARY KEY (id_categoria)
  );

-- Creacion de la tabla marca
CREATE TABLE IF NOT EXISTS marca(
  id_marca INT NOT NULL AUTO_INCREMENT,
  nombre VARCHAR(25) NOT NULL,
  PRIMARY KEY (id_marca)
);

-- Creacion de la tabla producto
CREATE TABLE IF NOT EXISTS producto(
  id_producto INT NOT NULL AUTO_INCREMENT,
  codigo VARCHAR(25) NOT NULL,
  nombre VARCHAR(45) NOT NULL,
  imagen VARCHAR(70) NOT NULL DEFAULT('default.jpg'),
  stock SMALLINT(4) NOT NULL,
  precio FLOAT UNSIGNED NOT NULL,
  id_marca INT NOT NULL,
  id_categoria INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id_producto , id_marca, id_categoria),
  CONSTRAINT FK_MARCA_PRODUCTO
    FOREIGN KEY (id_marca)
    REFERENCES marca (id_marca)
ON DELETE CASCADE,

  CONSTRAINT FK_CATEGORIA_PRODUCTO
    FOREIGN KEY (id_categoria)
    REFERENCES categoria (id_categoria)
ON DELETE CASCADE
    );

-- Creacion de la tabla salida_producto
CREATE TABLE IF NOT EXISTS salida_producto(
  id_salida INT NOT NULL,
  id_producto INT NOT NULL,
  cantidad smallint NOT NULL,
  PRIMARY KEY (id_salida , id_producto),
  CONSTRAINT FK_SALIDA
    FOREIGN KEY (id_salida)
    REFERENCES salida (id_salida)
ON DELETE CASCADE,
  CONSTRAINT FK_PRODUCTO
    FOREIGN KEY (id_producto)
    REFERENCES producto (id_producto)
ON DELETE CASCADE
    );
    
-- Creacion de la tabla proveedor
CREATE TABLE IF NOT EXISTS proveedor(
  id_proveedor INT NOT NULL AUTO_INCREMENT,
  nombre VARCHAR(100) NOT NULL,
  telefono VARCHAR(20) NOT NULL,
  email VARCHAR(255) NOT NULL,
  nit VARCHAR(25) NOT NULL,
  direccion VARCHAR(50) NULL,
  PRIMARY KEY (id_proveedor),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );

-- Creacion de la tabla proveedor_producto
CREATE TABLE IF NOT EXISTS proveedor_producto(
  id_proveedor INT NOT NULL,
  id_producto INT NOT NULL,
  PRIMARY KEY (id_proveedor , id_producto),
  CONSTRAINT FK_PROVEEDOR_PP
    FOREIGN KEY (id_proveedor)
    REFERENCES proveedor (id_proveedor)
ON DELETE CASCADE,
  CONSTRAINT FK_PRODUCTO_PP
    FOREIGN KEY (id_producto)
    REFERENCES producto (id_producto)
ON DELETE CASCADE
    );

-- Creacion de la tabla entrada
CREATE TABLE IF NOT EXISTS entrada(
  id_entrada INT NOT NULL AUTO_INCREMENT,
  id_admin INT NOT NULL,
  id_proveedor INT NOT NULL,
  PRIMARY KEY (id_entrada, id_admin,id_proveedor),
  CONSTRAINT FK_EMPLEADO_ENTRADA
    FOREIGN KEY (id_admin)
    REFERENCES admin (id_admin)
ON DELETE CASCADE,

  CONSTRAINT FK_PROVEEDOR_ENTRADA
    FOREIGN KEY (id_proveedor)
    REFERENCES proveedor (id_proveedor)
ON DELETE CASCADE,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );

-- Creacion de la tabla entrada_producto
CREATE TABLE IF NOT EXISTS entrada_producto(
  id_entrada INT NOT NULL,
  id_producto INT NOT NULL,
  cantidad smallint NOT NULL,
  precio FLOAT NOT NULL,
  PRIMARY KEY (id_entrada, id_producto),
  CONSTRAINT FK_ENTRADA_EP
    FOREIGN KEY (id_entrada)
    REFERENCES entrada (id_entrada)
ON DELETE CASCADE,
  CONSTRAINT FK_PRODUCTO_EP
  FOREIGN KEY (id_producto)
    REFERENCES producto (id_producto)
ON DELETE CASCADE
    );
    
    -- INDICES


-- Para empleado(id_persona), si decides que es necesario:
CREATE INDEX idx_admin_persona ON admin(id_persona);

-- Para cliente(id_persona), si decides que es necesario:
CREATE INDEX idx_cliente_persona ON cliente(id_persona);

-- Para producto(id_marca), para mejorar JOINs con la tabla marca:
CREATE INDEX idx_producto_marca ON producto(id_marca);

-- Para búsquedas por usuario:
CREATE INDEX idx_usuario ON usuario(usuario);

-- Para búsquedas por NIT de proveedor:
CREATE INDEX idx_proveedor_nit ON proveedor(nit);

-- Para búsquedas por código de producto:
CREATE INDEX idx_producto_codigo ON producto(codigo);

-- Para salida_producto(id_producto), mejora las consultas de salidas por producto:
CREATE INDEX idx_salida_producto ON salida_producto(id_producto);

-- Para entrada_producto(id_producto), mejora las consultas de entradas por producto:
CREATE INDEX idx_entrada_producto ON entrada_producto(id_producto);

-- Para proveedor_producto(id_producto), optimiza las consultas de proveedores por producto:
CREATE INDEX idx_proveedor_producto ON proveedor_producto(id_producto);

-- Para servicio_cita(id_servicio), facilita las búsquedas de citas por servicio:
CREATE INDEX idx_servicio_cita ON servicio_cita(id_servicio);

-- Para servicio_cita(id_cita), facilita las búsquedas de servicios por cita:
CREATE INDEX idx_cita_servicio ON servicio_cita(id_cita);

-- Para la busquedad de cita por fecha
CREATE INDEX idx_cita_fecha_cita ON cita(fecha_cita);

-- Para la busquedad de productos por stock
CREATE INDEX idx_producto_stock ON producto(stock);

-- Para la futura generacion de informes
CREATE INDEX idx_usuario_created_at ON usuario(created_at);
CREATE INDEX idx_producto_created_at ON producto(created_at);


-- DISPARADORES

-- Actualizar STOCK en producto cuando se realiza una nueva SALIDA
DELIMITER //
CREATE TRIGGER actualizar_stock_salida
AFTER INSERT ON salida_producto
FOR EACH ROW
BEGIN
    UPDATE producto
    SET stock = stock - NEW.cantidad
    WHERE id_producto = NEW.id_producto;
END; //
DELIMITER ;


-- Actualizar STOCK en producto cuando se realiza una nueva entrada
-- Actualizar PRECIO de producto con el PRECIO de entrada_producto
DELIMITER //
CREATE TRIGGER actualizar_stock_precio_despues_entrada
AFTER INSERT ON entrada_producto
FOR EACH ROW
BEGIN
    -- Actualiza el stock del producto
    UPDATE producto
    SET stock = stock + NEW.cantidad
    WHERE id_producto = NEW.id_producto;
    
    -- Actualiza el precio del producto
    UPDATE producto
    SET precio = NEW.precio
    WHERE id_producto = NEW.id_producto;
END; //
DELIMITER ;


