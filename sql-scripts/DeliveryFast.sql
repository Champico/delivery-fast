/*
:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
    S  C  R  I  P  T    B  A  S  E   D  E    D  A  T  O  S
        D  E  L  I  V  E  R  Y    F  A  S  T 

            Ultima modificación: 9/12/24
:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
*/


DROP DATABASE IF EXISTS DeliveryFast;
CREATE DATABASE DeliveryFast;
USE DeliveryFast;

-- Tabla de Roles
DROP TABLE IF EXISTS Roles;
CREATE TABLE Roles (
    id_rol INT AUTO_INCREMENT PRIMARY KEY,
    nombre_rol VARCHAR(50) NOT NULL UNIQUE
);

-- Tabla de Colaboradores
CREATE TABLE Colaboradores (
    numero_personal CHAR(15) PRIMARY KEY,
    contraseña VARCHAR(20) NOT NULL,
    id_rol INT NOT NULL,
    nombre VARCHAR(60) NOT NULL,
    apellido_paterno VARCHAR(60),
    apellido_materno VARCHAR(60),
    curp CHAR(18) NOT NULL UNIQUE,
    correo_electronico VARCHAR(255),
    FOREIGN KEY (id_rol) REFERENCES Roles(id_rol)
);

-- Tabla de Clientes
CREATE TABLE Clientes (
    id_cliente INT AUTO_INCREMENT PRIMARY KEY,
    nombre_completo VARCHAR(255) NOT NULL,
    correo_electronico VARCHAR(255),
    telefono CHAR(13)
);

-- Tabla de Sucursales
CREATE TABLE Sucursales (
    id_sucursal CHAR(5) PRIMARY KEY,
    direccion_origen VARCHAR(255) NOT NULL,
    direccion_destino VARCHAR(255) NOT NULL,
    colonia VARCHAR(50) NOT NULL,
    ciudad VARCHAR(50) NOT NULL,
    estado VARCHAR(50) NOT NULL
);

-- Tabla de Envíos
CREATE TABLE Envios (
    numero_guia CHAR(15) PRIMARY KEY,
    id_cliente INT NOT NULL,
    origen_calle VARCHAR(50) NOT NULL,
    origen_numero VARCHAR(10) NOT NULL,
    origen_colonia VARCHAR(50) NOT NULL,
    origen_codigo_postal CHAR(5) NOT NULL,
    origen_ciudad VARCHAR(50) NOT NULL,
    origen_estado VARCHAR(50) NOT NULL,
    destino_calle VARCHAR(50) NOT NULL,
    destino_numero VARCHAR(10) NOT NULL,
    destino_colonia VARCHAR(50) NOT NULL,
    destino_codigo_postal CHAR(5) NOT NULL,
    destino_ciudad VARCHAR(50) NOT NULL,
    destino_estado VARCHAR(50) NOT NULL,
    costo DECIMAL(10, 2) NOT NULL,
    conductor_asignado CHAR(6),
    FOREIGN KEY (id_cliente) REFERENCES Clientes(id_cliente),
    FOREIGN KEY (conductor_asignado) REFERENCES Colaboradores(numero_personal)
);

-- Tabla de Estatus de Paquetes
CREATE TABLE EstatusPaquete (
    id_estatus INT AUTO_INCREMENT PRIMARY KEY,
    numero_guia CHAR(15) NOT NULL,
    estado_envio ENUM('Pendiente', 'En tránsito', 'Detenido', 'Entregado', 'Cancelado') NOT NULL,
    fecha_cambio TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    colaborador_modifico CHAR(6) NOT NULL,
    FOREIGN KEY (numero_guia) REFERENCES Envios(numero_guia),
    FOREIGN KEY (colaborador_modifico) REFERENCES Colaboradores(numero_personal)
);