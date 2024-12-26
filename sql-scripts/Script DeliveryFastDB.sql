-- ----------------------------------------------------------------------
--  S C R I P T  P A R A  C R E A R  L A  B A S E  D E  D A T O S 
-- ----------------------------------------------------------------------

-- Creación de la base de datos --
DROP DATABASE IF EXISTS DeliveryFast;
CREATE DATABASE DeliveryFast;
USE DeliveryFast;

-- Tabla de Entidades Federativas --
DROP TABLE IF EXISTS Entidades_Federativas;
CREATE TABLE Entidades_Federativas (
    clave CHAR(2) PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    nombre_extendido VARCHAR(100) NOT NULL,
    abreviatura CHAR(6) NOT NULL
);

-- Tabla de Sucursales --
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
	latitud_dec DECIMAL(13,7) NOT NULL,
    longitud_dec DECIMAL(13,7) NOT NULL,
    hora_salida_diaria TIME NOT NULL,

    estado CHAR(2) NOT NULL,
    
    FOREIGN KEY (estado) REFERENCES Entidades_Federativas(clave)
);

-- Tabla de Envíos --
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
    servicio VARCHAR(50),
    seguro BOOLEAN NOT NULL,
    conductor_asignado CHAR(6),
    numero_sucursal CHAR(5),
    
    FOREIGN KEY (numero_sucursal) REFERENCES Sucursales(numero_sucursal)
  );
  
-- Tabla de Roles --
DROP TABLE IF EXISTS Roles;
CREATE TABLE Roles (
    id_rol INT AUTO_INCREMENT PRIMARY KEY,
    nombre_rol VARCHAR(50) NOT NULL UNIQUE
);

-- Inserciones iniciales para Roles --
INSERT INTO Roles (nombre_rol) VALUES
('Administrador'),
('Colaborador'),
('Repartidor');

-- Tabla de Colaboradores --
DROP TABLE IF EXISTS Colaboradores;
CREATE TABLE Colaboradores (
    numero_personal CHAR(6) PRIMARY KEY,
    contrasena VARCHAR(20) NOT NULL,
    nombre VARCHAR(60) NOT NULL,
    apellido_paterno VARCHAR(60),
    apellido_materno VARCHAR(60),
    curp CHAR(18) NOT NULL UNIQUE,
    correo VARCHAR(255),
    telefono VARCHAR(13),
    fecha_contratacion DATE,

    id_rol INT NOT NULL,
    numero_sucursal CHAR(5) NOT NULL,

    FOREIGN KEY (id_rol) REFERENCES Roles(id_rol),
    FOREIGN KEY (numero_sucursal) REFERENCES Sucursales(numero_sucursal)
);

-- Inserciones iniciales para Entidades federativas --
INSERT INTO Entidades_Federativas (clave, nombre, nombre_extendido, abreviatura) VALUES
("01", 'Aguascalientes', 'Estado de Aguascalientes', 'AGS'),
("02", 'Baja California', 'Estado de Baja California', 'BC'),
("03", 'Baja California Sur', 'Estado de Baja California Sur', 'BCS'),
("04", 'Campeche', 'Estado de Campeche', 'CC'),
("05", 'Coahuila', 'Estado de Coahuila de Zaragoza', 'CC'),
("06", 'Colima', 'Estado de Colima', 'CL'),
("07", 'Chiapas', 'Estado de Chiapas', 'CM'),
("08", 'Chihuahua', 'Estado de Chihuahua', 'CS'),
("09", 'Ciudad de México', 'Ciudad de México', 'CDMX'),
("10", 'Durango', 'Estado de Durango', 'DG'),
("11", 'Guanajuato', 'Estado de Guanajuato', 'GT'),
("12", 'Guerrero', 'Estado de Guerrero', 'GR'),
("13", 'Hidalgo', 'Estado de Hidalgo', 'HG'),
("14", 'Jalisco', 'Estado de Jalisco', 'JC'),
("15", 'México', 'Estado de México', 'EM'),
("16", 'Michoacán', 'Estado de Michoacán de Ocampo', 'MC'),
("17", 'Morelos', 'Estado de Morelos', 'MN'),
("18", 'Nayarit', 'Estado de Nayarit', 'MS'),
("19", 'Nuevo León', 'Estado de Nuevo León', 'NL'),
("20", 'Oaxaca', 'Estado de Oaxaca', 'OA'),
("21", 'Puebla', 'Estado de Puebla', 'PB'),
("22", 'Querétaro', 'Estado de Querétaro', 'QT'),
("23", 'Quintana Roo', 'Estado de Quintana Roo', 'QR'),
("24", 'San Luis Potosí', 'Estado de San Luis Potosí', 'SLP'),
("25", 'Sinaloa', 'Estado de Sinaloa', 'SN'),
("26", 'Sonora', 'Estado de Sonora', 'SR'),
("27", 'Tabasco', 'Estado de Tabasco', 'TC'),
("28", 'Tamaulipas', 'Estado de Tamaulipas', 'TM'),
("29", 'Tlaxcala', 'Estado de Tlaxcala', 'TL'),
("30", 'Veracruz', 'Estado de Veracruz de Ignacio de la Llave', 'VZ'),
("31", 'Yucatán', 'Estado de Yucatán', 'YN'),
("32", 'Zacatecas', 'Estado de Zacatecas', 'ZS');

-- Tabla de datos de remitentes y destinatarios --
DROP TABLE IF EXISTS Contactos;
CREATE TABLE Contactos (
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

    estado CHAR(2) NOT NULL,

    FOREIGN KEY (guia) REFERENCES envios(guia), 
    FOREIGN KEY (estado) REFERENCES Entidades_Federativas(clave)
);


-- Tabla de Estatus de Paquetes --
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

-- Ticket de compra --
DROP TABLE IF EXISTS Ticket;
CREATE TABLE ticket (
    id INT AUTO_INCREMENT PRIMARY KEY,
    total DECIMAL(10,2) NOT NULL,
    fecha_creacion TIMESTAMP DEFAULT NOW(),
    metodo_de_pago ENUM("Efectivo", "Tarjeta de debito"),
    pago_con DECIMAL(10,2),
    cambio DECIMAL(10,2),
    guia CHAR(15),
    FOREIGN KEY (guia) REFERENCES envios(guia)
);

-- Concepto de compra --
DROP TABLE IF EXISTS Concepto_ticket;
CREATE TABLE concepto_ticket (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_ticket INT,
    nombre VARCHAR(255),
    valor DECIMAL(10,2),
    FOREIGN KEY (id_ticket) REFERENCES ticket(id)
);









-- ----------------------------------------------------------------------
--               V      I    S     T     A     S 
-- ----------------------------------------------------------------------

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
    e.servicio,
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
    c.nombre_estado_remitente,
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
    c.estado_destinatario,
    c.nombre_estado_destinatario,
    
    e.numero_sucursal
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
        efr.nombre AS nombre_estado_remitente,

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
        d.estado AS estado_destinatario,
        efd.nombre AS nombre_estado_destinatario

    FROM 
		Contactos AS r
    JOIN Contactos AS d ON r.guia = d.guia
    INNER JOIN Entidades_Federativas AS efr ON r.estado = efr.clave
    INNER JOIN Entidades_Federativas AS efd ON d.estado = efd.clave
	WHERE r.tipo = 'Remitente' AND d.tipo = 'Destinatario'
) AS c ON c.guia = e.guia;



-- Vista con datos del envío reducidas
DROP VIEW IF EXISTS Envios_General;
CREATE VIEW Envios_General AS
SELECT
    e.guia,
    e.folio,
    e.servicio,
    c.nombre_completo AS destinatario,
    c.ciudad AS ciudad_destino,
    ef.nombre AS estado_destino,
    ep.estatus,
    e.numero_sucursal
FROM Entidades_Federativas AS ef
INNER JOIN Contactos AS c 
    ON c.estado = ef.clave
INNER JOIN Envios AS e 
    ON e.guia = c.guia
INNER JOIN (
    SELECT ep1.guia, ep1.estatus
    FROM Estatus_Paquete AS ep1
    WHERE ep1.fecha_cambio = (
        SELECT MAX(ep2.fecha_cambio)
        FROM Estatus_Paquete AS ep2
        WHERE ep2.guia = ep1.guia
    )
) AS ep
    ON e.guia = ep.guia
WHERE c.tipo = 'Destinatario';











-- ----------------------------------------------------------------------
--          F   U   N   C   I   O   N   E   S  
-- ----------------------------------------------------------------------

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








-- ----------------------------------------------------------------------
--          D  A  T  O  S   C  O  N  S  T  A  N  T  E  S  
-- ----------------------------------------------------------------------

-- Configuración global
DROP TABLE IF EXISTS Configuracion_global;
CREATE TABLE Configuracion_global(
	id INT AUTO_INCREMENT PRIMARY KEY,
	const_peso_volumetrico INT,
	peso_maximo DECIMAL(10,2),
	largo_maximo DECIMAL(10,2),
	alto_maximo DECIMAL(10,2),
	ancho_maximo DECIMAL(10,2),
    cargo_por_combustible INT,
    precio_seguro DECIMAL(10,2),
    use_google_services BOOLEAN
);

-- Insertar datos 
INSERT INTO Configuracion_global(const_peso_volumetrico, peso_maximo, largo_maximo, alto_maximo, ancho_maximo, cargo_por_combustible, precio_seguro) VALUES
(6000, 69, 200, 150, 200, 10, 300);

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

-- Crear tabla de tipo de servicio
DROP TABLE IF EXISTS Tipo_Servicio;
CREATE TABLE Tipo_Servicio (
    nombre VARCHAR(30) PRIMARY KEY,
    peso_max_amparado DECIMAL(10, 2) NOT NULL
);

-- Insertar datos de tipo de servicio
INSERT INTO Tipo_Servicio (nombre, peso_max_amparado) VALUES
    ('Express', 3),
    ('Día siguiente', 3),
    ('2-5 Dias', 3),
    ('Terrestre', 5);

-- Crear tabla de zonas
DROP TABLE IF EXISTS Zonas;
CREATE TABLE Zonas (
    nombre VARCHAR(30) PRIMARY KEY,
    rango_min INT NOT NULL,
    rango_max INT NOT NULL
);

-- Insertar datos de zonas
INSERT INTO Zonas (nombre, rango_min, rango_max) VALUES
("Zona 1", 0, 250),
("Zona 2", 251, 500),
("Zona 3", 501, 1000),
("Zona 4", 1001, 1500),
("Zona 5", 1501, 2000),
("Zona 6", 2001, 2001),
("Zona 7", 2001, 999999);

-- Crear tabla de calculo de precios
DROP TABLE IF EXISTS Precios;
CREATE TABLE Precios (
    servicio VARCHAR(30) NOT NULL,
    zona VARCHAR(30) NOT NULL,
    precio DECIMAL(10, 2) NOT NULL,
    medida_aumento_peso DECIMAL(10, 2) NOT NULL,
    precio_aumento DECIMAL(10, 2) NOT NULL,
    PRIMARY KEY (servicio, zona),
    FOREIGN KEY (servicio) REFERENCES tipo_servicio(nombre),
    FOREIGN KEY (zona) REFERENCES zonas(nombre)
);

-- Insertar datos en la tabla Costo
INSERT INTO Precios (servicio, zona, precio, medida_aumento_peso, precio_aumento) VALUES
    -- Zona 1
    ('Express', 'Zona 1', 300, 1, 40),
    ('Dia siguiente', 'Zona 1', 260, 1, 34),
    ('2-5 Dias', 'Zona 1', 220, 1, 28),
    ('Terrestre', 'Zona 1', 180, 1, 5),

    -- Zona 2
    ('Express', 'Zona 2', 330, 1, 50),
    ('Dia siguiente', 'Zona 2', 290, 1, 44),
    ('2-5 Dias', 'Zona 2', 250, 1, 38),
    ('Terrestre', 'Zona 2', 210, 1, 10),

    -- Zona 3
    ('Express', 'Zona 3', 360, 1, 40),
    ('Dia siguiente', 'Zona 3', 320, 1, 34),
    ('2-5 Dias', 'Zona 3', 280, 1, 28),
    ('Terrestre', 'Zona 3', 240, 1, 15),

    -- Zona 4
    ('Express', 'Zona 4', 390, 1, 50),
    ('Dia siguiente', 'Zona 4', 350, 1, 44),
    ('2-5 Dias', 'Zona 4', 310, 1, 38),
    ('Terrestre', 'Zona 4', 270, 1, 20),

    -- Zona 5
    ('Express', 'Zona 5', 420, 1, 60),
    ('Dia siguiente', 'Zona 5', 380, 1, 54),
    ('2-5 Dias', 'Zona 5', 340, 1, 48),
    ('Terrestre', 'Zona 5', 300, 1, 25),

    -- Zona 6
    ('Express', 'Zona 6', 450, 1, 70),
    ('Dia siguiente', 'Zona 6', 410, 1, 64),
    ('2-5 Dias', 'Zona 6', 370, 1, 58),
    ('Terrestre', 'Zona 6', 330, 1, 30),

    -- Zona 7
    ('Express', 'Zona 7', 490, 1, 80),
    ('Dia siguiente', 'Zona 7', 440, 1, 74),
    ('2-5 Dias', 'Zona 7', 400, 1, 68),
    ('Terrestre', 'Zona 7', 360, 1, 35);







-- ----------------------------------------------------------------------
--     I N S E R T A R  U S U A R I O  P O R  D E F E C T O 
-- ----------------------------------------------------------------------

-- Insertar sucursal
INSERT INTO Sucursales (numero_sucursal, correo, telefono, calle, numero_ext, cp, colonia, ciudad, estado, latitud_dec, longitud_dec, hora_salida_diaria) VALUES 
('00000', 'deliveryFastNacional@deliveryfast.com', '5551234567', 'Av. Xalapa', 's/n', '91020', 'Obrero Campesina', ' Xalapa-Enríquez', '30', 19.541211, -96.926956, '18:00:00');

-- Insertar colaborador
INSERT INTO Colaboradores (numero_personal, contrasena, nombre, apellido_paterno, apellido_materno, curp, correo, telefono, fecha_contratacion, id_rol, numero_sucursal)
VALUES ('000000', 'password', 'Sistema', NULL, NULL, 'SIS000000HDFSRNA1', 'deliveryFastNacional@deliveryfast.com', NULL, CURDATE(), 1, '00000');
