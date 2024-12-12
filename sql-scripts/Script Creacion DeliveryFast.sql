-- -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -
--  S C R I P T  P A R A  C R E A R  L A  B A S E  D E  D A T O S 
-- -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -

-- Creación de la base de datos
DROP DATABASE IF EXISTS DeliveryFast;
CREATE DATABASE DeliveryFast;
USE DeliveryFast;

-- Tabla de Envíos
DROP TABLE IF EXISTS Envios;
CREATE TABLE Envios (
    guia CHAR(15) PRIMARY KEY,
    folio INT,
    costo DECIMAL(10, 2) NOT NULL,
    peso DECIMAL(10, 2),
    largo DECIMAL(10, 2),
    alto DECIMAL(10, 2),
    ancho DECIMAL(10, 2),
    contenido VARCHAR(255),
    tipo VARCHAR(50),
    seguro BOOLEAN NOT NULL,
    conductor_asignado CHAR(6)
  );

-- Tabla de Sucursales
DROP TABLE IF EXISTS Sucursales;  
CREATE TABLE Sucursales (
    numero_sucursal CHAR(5) PRIMARY KEY,
    correo VARCHAR(255) NOT NULL,
    telefono CHAR(13) NOT NULL,
    calle VARCHAR(50) NOT NULL,
    numero_ext VARCHAR(10) NOT NULL,
    numero_int VARCHAR(10),
    cp VARCHAR(5)  NOT NULL CHECK (cp REGEXP '^[0-9]{5}$'),
    colonia VARCHAR(50) NOT NULL,
    ciudad VARCHAR(50) NOT NULL,
    estado VARCHAR(50) NOT NULL,
    hora_salida_diaria TIME NOT NULL
);

-- Tabla de Roles
DROP TABLE IF EXISTS Roles;
CREATE TABLE Roles (
    id_rol INT AUTO_INCREMENT PRIMARY KEY,
    nombre_rol VARCHAR(50) NOT NULL UNIQUE
);

-- Inserciones iniciales para Roles
INSERT INTO Roles (nombre_rol) VALUES
('Administrador'),
('Colaborador'),
('Repartidor');

-- Tabla de Colaboradores
DROP TABLE IF EXISTS Colaboradores;
CREATE TABLE Colaboradores (
    numero_personal CHAR(6) PRIMARY KEY,
    contrasena VARCHAR(20) NOT NULL,
    nombre VARCHAR(60) NOT NULL,
    apellido_paterno VARCHAR(60),
    apellido_materno VARCHAR(60),
    curp CHAR(18) NOT NULL UNIQUE,
    correo VARCHAR(255),
    telefono CHAR(13),
    fecha_contratacion DATE,

    id_rol INT NOT NULL,
    numero_sucursal CHAR(5) NOT NULL,

    FOREIGN KEY (id_rol) REFERENCES Roles(id_rol),
    FOREIGN KEY (numero_sucursal) REFERENCES Sucursales(numero_sucursal)
);

DROP TABLE IF EXISTS Entidades_Federativas;
CREATE TABLE Entidades_Federativas (
    id_entidad INT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    nombre_extendido VARCHAR(100) NOT NULL,
    abreviatura CHAR(6) NOT NULL
);

INSERT INTO Entidades_Federativas (id_entidad, nombre, nombre_extendido, abreviatura) VALUES
(1, 'Aguascalientes', 'Estado de Aguascalientes', 'AGS'),
(2, 'Baja California', 'Estado de Baja California', 'BC'),
(3, 'Baja California Sur', 'Estado de Baja California Sur', 'BCS'),
(4, 'Campeche', 'Estado de Campeche', 'CC'),
(5, 'Coahuila', 'Estado de Coahuila de Zaragoza', 'CC'),
(6, 'Colima', 'Estado de Colima', 'CL'),
(7, 'Chiapas', 'Estado de Chiapas', 'CM'),
(8, 'Chihuahua', 'Estado de Chihuahua', 'CS'),
(9, 'Ciudad de México', 'Ciudad de México', 'CDMX'),
(10, 'Durango', 'Estado de Durango', 'DG'),
(11, 'Guanajuato', 'Estado de Guanajuato', 'GT'),
(12, 'Guerrero', 'Estado de Guerrero', 'GR'),
(13, 'Hidalgo', 'Estado de Hidalgo', 'HG'),
(14, 'Jalisco', 'Estado de Jalisco', 'JC'),
(15, 'México', 'Estado de México', 'EM'),
(16, 'Michoacán', 'Estado de Michoacán de Ocampo', 'MC'),
(17, 'Morelos', 'Estado de Morelos', 'MN'),
(18, 'Nayarit', 'Estado de Nayarit', 'MS'),
(19, 'Nuevo León', 'Estado de Nuevo León', 'NL'),
(20, 'Oaxaca', 'Estado de Oaxaca', 'OA'),
(21, 'Puebla', 'Estado de Puebla', 'PB'),
(22, 'Querétaro', 'Estado de Querétaro', 'QT'),
(23, 'Quintana Roo', 'Estado de Quintana Roo', 'QR'),
(24, 'San Luis Potosí', 'Estado de San Luis Potosí', 'SLP'),
(25, 'Sinaloa', 'Estado de Sinaloa', 'SN'),
(26, 'Sonora', 'Estado de Sonora', 'SR'),
(27, 'Tabasco', 'Estado de Tabasco', 'TC'),
(28, 'Tamaulipas', 'Estado de Tamaulipas', 'TM'),
(29, 'Tlaxcala', 'Estado de Tlaxcala', 'TL'),
(30, 'Veracruz', 'Estado de Veracruz de Ignacio de la Llave', 'VZ'),
(31, 'Yucatán', 'Estado de Yucatán', 'YN'),
(32, 'Zacatecas', 'Estado de Zacatecas', 'ZS');

DROP TABLE IF EXISTS Contactos;
CREATE TABLE Contactos (
    -- Llave primaria referencia a su envío
    guia CHAR(15),
    tipo ENUM("Remitente","Destinatario"),

    -- Datos de contacto
    nombre_completo VARCHAR(255) NOT NULL,
    correo VARCHAR(255),
    telefono CHAR(13),

    -- Dirección
    calle VARCHAR(50) NOT NULL,
    numero_ext VARCHAR(10) NOT NULL,
    numero_int VARCHAR(10),
    colonia VARCHAR(50) NOT NULL,
    cp CHAR(5) NOT NULL CHECK (cp REGEXP '^[0-9]{5}$'),
    ciudad VARCHAR(50) NOT NULL,
    referencias VARCHAR(300),

    estado INT NOT NULL,

    FOREIGN KEY (guia) REFERENCES envios(guia), 
    FOREIGN KEY (estado) REFERENCES Entidades_Federativas(id_entidad)
);


-- Tabla de Estatus de Paquetes
DROP TABLE IF EXISTS Estatus_Paquete;
CREATE TABLE Estatus_Paquete (
    id_estatus INT AUTO_INCREMENT PRIMARY KEY,
    estatus ENUM('Pendiente', 'En tránsito', 'Detenido', 'Entregado', 'Cancelado', 'No pagado') NOT NULL,
    fecha_cambio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    guia CHAR(15) NOT NULL,
    colaborador CHAR(15) NOT NULL,

    FOREIGN KEY (guia) REFERENCES Envios(guia),
    FOREIGN KEY (colaborador) REFERENCES Colaboradores(numero_personal)
);









-- -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -
--       D  A  T  O  S   C  O  N  S  T  A  N  T  E  S  
-- -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -

-- Tabla de horario
DROP TABLE IF EXISTS Horario;
CREATE TABLE Horario (
    numero_sucursal CHAR(5) NOT NULL,
    dia ENUM('Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo') NOT NULL,
    hora_apertura TIME NOT NULL,
    hora_cierre TIME NOT NULL,

    FOREIGN KEY (numero_sucursal) REFERENCES Sucursales(numero_sucursal),
    PRIMARY KEY (numero_sucursal, dia)
);

DROP TABLE IF EXISTS Tipo_Servicio;
CREATE TABLE Tipo_Servicio (
    nombre VARCHAR(30) PRIMARY KEY,
    sobrepeso DECIMAL(10, 2) NOT NULL,
    largo_amp DECIMAL(10, 2) NOT NULL,
    ancho_amp DECIMAL(10, 2) NOT NULL,
    alto_amp DECIMAL(10, 2) NOT NULL
);

DROP TABLE IF EXISTS Zonas;
CREATE TABLE Zonas (
    nombre VARCHAR(30) PRIMARY KEY,
    distancia DECIMAL(10, 2) NOT NULL
);

DROP TABLE IF EXISTS Costo;
CREATE TABLE Costo (
    servicio VARCHAR(30) NOT NULL,
    zona VARCHAR(30) NOT NULL,
    precio DECIMAL(10, 2) NOT NULL,
    medida_aumento_peso DECIMAL(10, 2) NOT NULL,
    precio_aumento DECIMAL(10, 2) NOT NULL,
    PRIMARY KEY (servicio, zona),
    FOREIGN KEY (servicio) REFERENCES tipo_servicio(nombre),
    FOREIGN KEY (zona) REFERENCES zonas(nombre)
);