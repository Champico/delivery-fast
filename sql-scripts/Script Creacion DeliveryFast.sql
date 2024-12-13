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
    telefono VARCHAR(13) NOT NULL,
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

-- Tabla de entidades federativas
DROP TABLE IF EXISTS Entidades_Federativas;
CREATE TABLE Entidades_Federativas (
    id_entidad INT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    nombre_extendido VARCHAR(100) NOT NULL,
    abreviatura CHAR(6) NOT NULL,
    min_cp TINYINT,
    max_cp TINYINT,
    latitud DECIMAL(10, 7),
    longitud DECIMAL(10, 7)
);

INSERT INTO Entidades_Federativas (id_entidad, nombre, nombre_extendido, abreviatura, min_cp, max_cp, latitud, longitud) VALUES
(1, 'Aguascalientes', 'Estado de Aguascalientes', 'AGS', 20, 20, 22.0724247, -102.3076925),
(2, 'Baja California', 'Estado de Baja California', 'BC', 21, 22, 32.1636117, -116.3031437),
(3, 'Baja California Sur', 'Estado de Baja California Sur', 'BCS', 23, 23, 25.1448734, -111.2262671),
(4, 'Campeche', 'Estado de Campeche', 'CC', 24, 24, 19.1578254, -90.4921726),
(5, 'Coahuila', 'Estado de Coahuila de Zaragoza', 'CC', 25, 27, 27.1719759, -101.5544302),
(6, 'Colima', 'Estado de Colima', 'CL', 28, 28, 19.1719996, -103.8596560),
(7, 'Chiapas', 'Estado de Chiapas', 'CM', 29, 30, 16.4980000, -92.6397034),
(8, 'Chihuahua', 'Estado de Chihuahua', 'CS', 31, 33, 28.3510503, -106.6160957),
(9, 'Ciudad de México', 'Ciudad de México', 'CDMX', 1, 16, 19.3450894, -99.1532516),
(10, 'Durango', 'Estado de Durango', 'DG', 34, 35, 24.9361354, -104.7118333),
(11, 'Guanajuato', 'Estado de Guanajuato', 'GT', 36, 38, 20.7087239, -100.9782212),
(12, 'Guerrero', 'Estado de Guerrero', 'GR', 39, 41, 17.6030727, -99.4330865),
(13, 'Hidalgo', 'Estado de Hidalgo', 'HG', 42, 43, 20.4147457, -98.8285380),
(14, 'Jalisco', 'Estado de Jalisco', 'JC', 44, 49, 20.5039744, -103.4780113),
(15, 'México', 'Estado de México', 'EM', 50, 57, 19.3997811, -99.4181191),
(16, 'Michoacán', 'Estado de Michoacán de Ocampo', 'MC', 58, 61, 19.5920937, -101.7289468),
(17, 'Morelos', 'Estado de Morelos', 'MN', 62, 62, 18.7852731, -99.0644756),
(18, 'Nayarit', 'Estado de Nayarit', 'MS', 63, 63, 21.6120478, -104.9045737),
(19, 'Nuevo León', 'Estado de Nuevo León', 'NL', 64, 67, 25.6778490, -99.9785496),
(20, 'Oaxaca', 'Estado de Oaxaca', 'OA', 68, 71, 17.0948029, -96.8537151),
(21, 'Puebla', 'Estado de Puebla', 'PB', 72, 75, 19.1207678, -97.9056539),
(22, 'Querétaro', 'Estado de Querétaro', 'QT', 76, 76, 20.7879598, -99.9141013),
(23, 'Quintana Roo', 'Estado de Quintana Roo', 'QR', 77, 77, 20.2273805, -87.6169463),
(24, 'San Luis Potosí', 'Estado de San Luis Potosí', 'SLP', 78, 79, 22.2118083, -100.0177798),
(25, 'Sinaloa', 'Estado de Sinaloa', 'SN', 80, 82, 24.7967726, -107.3904539),
(26, 'Sonora', 'Estado de Sonora', 'SR', 83, 85, 29.6204208, -110.2837409),
(27, 'Tabasco', 'Estado de Tabasco', 'TC', 86, 86, 17.9514465, -92.7092385),
(28, 'Tamaulipas', 'Estado de Tamaulipas', 'TM', 87, 89, 24.2199113, -98.8231737),
(29, 'Tlaxcala', 'Estado de Tlaxcala', 'TL', 90, 90, 19.3429507, -98.1770951),
(30, 'Veracruz', 'Estado de Veracruz de Ignacio de la Llave', 'VZ', 91, 96, 19.3461124, -96.6971134),
(31, 'Yucatán', 'Estado de Yucatán', 'YN', 97, 97, 20.8145152, -89.1240009),
(32, 'Zacatecas', 'Estado de Zacatecas', 'ZS', 98, 99, 22.6152649, -102.7721144);



DROP TABLE IF EXISTS Contactos;
CREATE TABLE Contactos (
    -- Llave primaria referencia a su envío
    guia CHAR(15),
    tipo ENUM("Remitente","Destinatario"),

    -- Datos de contacto
    nombre_completo VARCHAR(255) NOT NULL,
    correo VARCHAR(255),
    telefono VARCHAR(13),

    -- Dirección
    calle VARCHAR(50) NOT NULL,
    numero_ext VARCHAR(10) NOT NULL,
    numero_int VARCHAR(10),
    colonia VARCHAR(50) NOT NULL,
    cp CHAR(5) NOT NULL CHECK (cp REGEXP '^[0-9]{5}$'),
    ciudad VARCHAR(50) NOT NULL,
    referencias VARCHAR(255),

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

-- Ticket de compra
DROP TABLE IF EXISTS ticket;
CREATE TABLE ticket (
    id INT AUTO_INCREMENT PRIMARY KEY,
    costo_guia DECIMAL(10,2) NOT NULL,
    cargo_por_combustible DECIMAL(10,2) NOT NULL,
    costo_sobrepeso DECIMAL(10,2) NOT NULL,
    seguro DECIMAL(10,2) NOT NULL,
    total DECIMAL(10,2) NOT NULL,
    fecha_creacion TIMESTAMP DEFAULT NOW(),

    guia CHAR(15),
    FOREIGN KEY (guia) REFERENCES envios(guia)
);

-- Vista con datos del envío completo
DROP VIEW IF EXISTS Datos_Completos_Envio;
CREATE VIEW Datos_Completos_Envio AS 
SELECT
    e.guia,
    e.folio,
    e.costo,
    e.peso,
    e.largo,
    e.alto,
    e.ancho,
    e.contenido,
    e.tipo,
    e.seguro,
    e.conductor_asignado,

    c.nombre_remitente,
    c.correo_remitente,
    c.telefono_remitente,
    c.calle_remitente,
    c.numero_ext_remitente,
    c.numero_int_remitente,
    c.colonia_remitente,
    c.cp_remitente,
    c.ciudad_remitente,
    c.referencias_remitente,
    c.estado_remitente,
    c.nombre_destinatario,
    c.correo_destinatario,
    c.telefono_destinatario,
    c.calle_destinatario,
    c.numero_ext_destinatario,
    c.numero_int_destinatario,
    c.colonia_destinatario,
    c.cp_destinatario,
    c.ciudad_destinatario,
    c.referencias_destinatario,
    c.estado_destinatario
FROM Envios AS e
INNER JOIN (
    SELECT
        r.guia AS guia,
        r.nombre_completo AS nombre_remitente,
        r.correo AS correo_remitente,
        r.telefono AS telefono_remitente,
        r.calle AS calle_remitente,
        r.numero_ext AS numero_ext_remitente,
        r.numero_int AS numero_int_remitente,
        r.colonia AS colonia_remitente,
        r.cp AS cp_remitente,
        r.ciudad AS ciudad_remitente,
        r.referencias AS referencias_remitente,
        r.estado AS estado_remitente,

        d.nombre_completo AS nombre_destinatario,
        d.correo AS correo_destinatario,
        d.telefono AS telefono_destinatario,
        d.calle AS calle_destinatario,
        d.numero_ext AS numero_ext_destinatario,
        d.numero_int AS numero_int_destinatario,
        d.colonia AS colonia_destinatario,
        d.cp AS cp_destinatario,
        d.ciudad AS ciudad_destinatario,
        d.referencias AS referencias_destinatario,
        d.estado AS estado_destinatario
    FROM Contactos AS r
    JOIN Contactos AS d
    ON r.guia = d.guia 
    WHERE r.tipo = 'Remitente' AND d.tipo = 'Destinatario'
) AS c
ON c.guia = e.guia;








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
    distancia_min INT NOT NULL,
    distancia_max INT NOT NULL
);

INSERT INTO Zonas (nombre, distancia_min) VALUES
("Zona 1", 0, 250)
("Zona 2", 251, 500)
("Zona 3", 501, 1,000)
("Zona 4", 1001, 1500)
("Zona 5", 1501, 2000)
("Zona 6", 2001, 2001)
("Zona 7", 2001, 999999);

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


DELIMITER //

CREATE FUNCTION generarGuia()
RETURNS CHAR(15)
DETERMINISTIC
BEGIN
    DECLARE nuevaGuia CHAR(15);
    DECLARE existe INT;

    -- Intentar generar una guía única
    REPEAT
        -- Generar una cadena aleatoria de 15 números
        SET nuevaGuia = LPAD(FLOOR(RAND() * 1000000000000000), 15, '0');
        
        -- Comprobar si existe en la tabla Envios
        SELECT COUNT(*) INTO existe FROM Envios WHERE guia = nuevaGuia;
    UNTIL existe = 0 -- Repetir hasta que no exista en la tabla
    END REPEAT;

    RETURN nuevaGuia;
END; //

DELIMITER ;


DELIMITER //

CREATE FUNCTION obtenerFolio()
RETURNS INT
DETERMINISTIC
BEGIN
    DECLARE ultimoFolio INT;

    -- Obtener el folio más alto
    SELECT IFNULL(MAX(folio), 0) INTO ultimoFolio FROM Envios;

    -- Devolver el siguiente folio
    RETURN ultimoFolio + 1;
END; //

DELIMITER ;
