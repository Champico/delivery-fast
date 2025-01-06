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
    abreviatura CHAR(6) NOT NULL,
    abreviatura_informal CHAR(6) NOT NULL
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
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
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
INSERT INTO Entidades_Federativas (clave, nombre, nombre_extendido, abreviatura, abreviatura_informal) VALUES
("01", 'Aguascalientes', 'Estado de Aguascalientes', 'AGS', 'Agu'),
("02", 'Baja California', 'Estado de Baja California', 'BC', 'Bc'),
("03", 'Baja California Sur', 'Estado de Baja California Sur', 'BCS', 'Bcs'),
("04", 'Campeche', 'Estado de Campeche', 'CC', 'Camp'),
("05", 'Coahuila', 'Estado de Coahuila de Zaragoza', 'COA', 'Coah'),
("06", 'Colima', 'Estado de Colima', 'CL', 'Col'),
("07", 'Chiapas', 'Estado de Chiapas', 'CH', 'Chis'),
("08", 'Chihuahua', 'Estado de Chihuahua', 'CS', 'Chih'),
("09", 'Ciudad de México', 'Ciudad de México', 'CDMX', 'Cdmx'),
("10", 'Durango', 'Estado de Durango', 'DG', 'Dgo'),
("11", 'Guanajuato', 'Estado de Guanajuato', 'GT', 'Gto'),
("12", 'Guerrero', 'Estado de Guerrero', 'GR', 'Gro'),
("13", 'Hidalgo', 'Estado de Hidalgo', 'HG', 'Hgo'),
("14", 'Jalisco', 'Estado de Jalisco', 'JC', 'Jal'),
("15", 'México', 'Estado de México', 'EM', 'Mex'),
("16", 'Michoacán', 'Estado de Michoacán de Ocampo', 'MC', 'Mic'),
("17", 'Morelos', 'Estado de Morelos', 'MN', 'Mor'),
("18", 'Nayarit', 'Estado de Nayarit', 'NA', 'Nay'),
("19", 'Nuevo León', 'Estado de Nuevo León', 'NL', 'Nl'),
("20", 'Oaxaca', 'Estado de Oaxaca', 'OA', 'Oax'),
("21", 'Puebla', 'Estado de Puebla', 'PB', 'Pue'),
("22", 'Querétaro', 'Estado de Querétaro', 'QT', 'Qro'),
("23", 'Quintana Roo', 'Estado de Quintana Roo', 'QR', 'Qr'),
("24", 'San Luis Potosí', 'Estado de San Luis Potosí', 'SLP', 'Slp'),
("25", 'Sinaloa', 'Estado de Sinaloa', 'SN', 'Sin'),
("26", 'Sonora', 'Estado de Sonora', 'SR', 'Son'),
("27", 'Tabasco', 'Estado de Tabasco', 'TC', 'Tab'),
("28", 'Tamaulipas', 'Estado de Tamaulipas', 'TM', 'Tamps'),
("29", 'Tlaxcala', 'Estado de Tlaxcala', 'TL', 'Tlax'),
("30", 'Veracruz', 'Estado de Veracruz de Ignacio de la Llave', 'VZ', 'Ver'),
("31", 'Yucatán', 'Estado de Yucatán', 'YN', 'Yuc'),
("32", 'Zacatecas', 'Estado de Zacatecas', 'ZS', 'Zac');


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

-- Tabla de los nombres de los estatus --
DROP TABLE IF EXISTS Estatus;
CREATE TABLE Estatus (
    id VARCHAR(20) PRIMARY KEY,
    descripcion VARCHAR(255) NOT NULL
);

-- Insertar valores permitidos --
INSERT INTO Estatus (id, descripcion) VALUES
    ('Pendiente',   'El paquete aún no ha sido procesado para su envío. Está esperando confirmación o preparación.'),
    ('En_transito', 'El paquete ya fue enviado y se encuentra en camino hacia su destino. Puede estar en transporte terrestre o aéreo.'),
    ('Detenido',    'El paquete enfrenta un retraso debido a inspecciones o algún inconveniente en la entrega.'),
    ('Entregado',   'El paquete ha llegado satisfactoriamente a su destino y ha sido recibido por el destinatario o persona autorizada.'),
    ('Cancelado',   'El envío del paquete fue cancelado. Esto puede deberse a solicitud del cliente o problemas internos en el proceso de envío.'),
    ('No_pagado',   'El paquete no ha sido enviado porque el pago correspondiente no ha sido realizado o confirmado.');


-- Tabla de Estatus de Paquetes --
DROP TABLE IF EXISTS Estatus_Paquete;
CREATE TABLE Estatus_Paquete (
    id_estatus INT AUTO_INCREMENT PRIMARY KEY,
    fecha_cambio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    estatus VARCHAR(20) NOT NULL,
    guia CHAR(15) NOT NULL,
    colaborador CHAR(15) NOT NULL,
    notas VARCHAR(255),

    FOREIGN KEY (guia) REFERENCES Envios(guia),
    FOREIGN KEY (colaborador) REFERENCES Colaboradores(numero_personal),
    FOREIGN KEY (estatus) REFERENCES Estatus(id)    
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

-- Datos fiscales --
DROP TABLE IF EXISTS Datos_fiscales;
CREATE TABLE Datos_fiscales(
    RFC VARCHAR(13) PRIMARY KEY,
    nombre VARCHAR(64) NOT NULL,
    apellido_paterno VARCHAR(64),
    apellido_materno VARCHAR(64),
    curp VARCHAR(18),
    fecha_inicio_de_operaciones VARCHAR(64),
    estatus_en_el_padron VARCHAR(32) NOT NULL,
    fecha_ultimo_cambio_estado VARCHAR(64),
    nombre_comercial VARCHAR(64),

    codigo_postal VARCHAR(5) NOT NULL,
    tipo_vialidad VARCHAR(32),
    nombre_vialidad VARCHAR(64),
    numero_exterior VARCHAR(16),
    numero_interior VARCHAR(16),
    colonia VARCHAR(64),
    localidad VARCHAR(64),
    municipio VARCHAR(64),
    entidad_federativa CHAR(2) NOT NULL,

    orden_ae VARCHAR(16),
    descripcion_actividad_economica_ae VARCHAR(255),
    porcentaje_ae VARCHAR(32),
    fecha_inicio_ae VARCHAR(32),
    
    regimen VARCHAR(255),
    fecha_inicio_regimen VARCHAR(32),

    constancia_de_situacion_fiscal LONGBLOB,
    
	FOREIGN KEY (entidad_federativa) REFERENCES Entidades_Federativas(clave)
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
    e.fecha_creacion,
    e.numero_sucursal,

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
    c.nombre_estado_destinatario
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


-- Vista que nos da la lista de envios con la ultima actualización
DROP VIEW IF EXISTS Ultimo_estatus;
CREATE VIEW Ultimo_estatus AS
SELECT estatus_datos.estatus,
       estatus_datos.fecha_cambio,
       estatus_datos.guia,
       estatus_datos.colaborador, 
       estatus_datos.notas
FROM Estatus_Paquete AS estatus_datos
JOIN (
    SELECT guia, MAX(fecha_cambio) AS max_fecha
    FROM Estatus_Paquete
    GROUP BY guia
) AS estatus_reciente
    ON  estatus_datos.guia = estatus_reciente.guia 
    AND estatus_datos.fecha_cambio = estatus_reciente.max_fecha;


-- Vista con datos del envío reducidas
DROP VIEW IF EXISTS Envios_general;
CREATE VIEW Envios_general AS
SELECT
    e.guia,
    e.folio,
    e.servicio,
    e.seguro,
    c.nombre_completo AS destinatario,
    c.ciudad AS ciudad_destino,
    f.nombre AS estado_destino,
    f.abreviatura_informal,
    e.fecha_creacion,
    u.estatus,
    u.fecha_cambio AS ultimo_cambio_de_estatus,
    e.numero_sucursal
FROM Entidades_Federativas AS f
INNER JOIN Contactos       AS c ON c.estado = f.clave
INNER JOIN Envios          AS e ON e.guia = c.guia
INNER JOIN Ultimo_estatus  AS u ON e.guia = u.guia
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
(6000, 69, 200, 150, 200, 10, 150);

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
    ('Día_siguiente', 3),
    ('2-5_Dias', 3),
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
    ('Día_siguiente', 'Zona 1', 260, 1, 34),
    ('2-5_Dias', 'Zona 1', 220, 1, 28),
    ('Terrestre', 'Zona 1', 180, 1, 5),

    -- Zona 2
    ('Express', 'Zona 2', 330, 1, 50),
    ('Día_siguiente', 'Zona 2', 290, 1, 44),
    ('2-5_Dias', 'Zona 2', 250, 1, 38),
    ('Terrestre', 'Zona 2', 210, 1, 10),

    -- Zona 3
    ('Express', 'Zona 3', 360, 1, 40),
    ('Día_siguiente', 'Zona 3', 320, 1, 34),
    ('2-5_Dias', 'Zona 3', 280, 1, 28),
    ('Terrestre', 'Zona 3', 240, 1, 15),

    -- Zona 4
    ('Express', 'Zona 4', 390, 1, 50),
    ('Día_siguiente', 'Zona 4', 350, 1, 44),
    ('2-5_Dias', 'Zona 4', 310, 1, 38),
    ('Terrestre', 'Zona 4', 270, 1, 20),

    -- Zona 5
    ('Express', 'Zona 5', 420, 1, 60),
    ('Día_siguiente', 'Zona 5', 380, 1, 54),
    ('2-5_Dias', 'Zona 5', 340, 1, 48),
    ('Terrestre', 'Zona 5', 300, 1, 25),

    -- Zona 6
    ('Express', 'Zona 6', 450, 1, 70),
    ('Día_siguiente', 'Zona 6', 410, 1, 64),
    ('2-5_Dias', 'Zona 6', 370, 1, 58),
    ('Terrestre', 'Zona 6', 330, 1, 30),

    -- Zona 7
    ('Express', 'Zona 7', 490, 1, 80),
    ('Día_siguiente', 'Zona 7', 440, 1, 74),
    ('2-5_Dias', 'Zona 7', 400, 1, 68),
    ('Terrestre', 'Zona 7', 360, 1, 35);
