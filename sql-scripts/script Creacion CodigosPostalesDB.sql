DROP DATABASE IF EXISTS CodigosPostalesDB;
CREATE DATABASE CodigosPostalesDB;
USE CodigosPostalesDB;

DROP TABLE IF EXISTS estado;
CREATE TABLE estado(
	id_estado_sis INT AUTO_INCREMENT PRIMARY KEY,
    clave CHAR(2) UNIQUE,
    nombre VARCHAR(50) NOT NULL,
    nombre_extendido VARCHAR(100) NOT NULL,
    abreviatura CHAR(6) NOT NULL,
    min_cp TINYINT,
    max_cp TINYINT,
    latitud_dec DECIMAL(13,7),
    longitud_dec DECIMAL(13,7)
);

DROP TABLE IF EXISTS municipio;
CREATE TABLE municipio(
	id_municipio_sis INT AUTO_INCREMENT PRIMARY KEY,
	clave CHAR(3),
	nombre VARCHAR(128),

	clave_estado CHAR(2) NOT NULL,
	FOREIGN KEY(clave_estado) REFERENCES estado(clave)
);

DROP TABLE IF EXISTS asentamiento;
CREATE TABLE asentamiento(
	id_asentamiento_sis INT AUTO_INCREMENT PRIMARY KEY,
	cp char(5) NOT NULL CHECK (cp REGEXP '^[0-9]{5}$'),
	nombre VARCHAR(128) NOT NULL,
	tipo VARCHAR(32),
	latitud VARCHAR(15),
	longitud VARCHAR(15),
	latitud_dec DEC(13,7) NOT NULL,
	longitud_dec DEC(13,7) NOT NULL ,
	
	id_municipio_sis INT NOT NULL,
	clave_estado CHAR(2) NOT NULL,

	FOREIGN KEY (id_municipio_sis) references municipio(id_municipio_sis),
	FOREIGN KEY (clave_estado) references estado(clave)
);

INSERT INTO estado (clave, nombre, nombre_extendido, abreviatura, min_cp, max_cp, latitud_dec, longitud_dec) VALUES
("01", 'Aguascalientes', 'Estado de Aguascalientes', 'AGS', 20, 20, 22.0724247, -102.3076925),
("02", 'Baja California', 'Estado de Baja California', 'BC', 21, 22, 32.1636117, -116.3031437),
("03", 'Baja California Sur', 'Estado de Baja California Sur', 'BCS', 23, 23, 25.1448734, -111.2262671),
("04", 'Campeche', 'Estado de Campeche', 'CC', 24, 24, 19.1578254, -90.4921726),
("05", 'Coahuila', 'Estado de Coahuila de Zaragoza', 'CC', 25, 27, 27.1719759, -101.5544302),
("06", 'Colima', 'Estado de Colima', 'CL', 28, 28, 19.1719996, -103.8596560),
("07", 'Chiapas', 'Estado de Chiapas', 'CM', 29, 30, 16.4980000, -92.6397034),
("08", 'Chihuahua', 'Estado de Chihuahua', 'CS', 31, 33, 28.3510503, -106.6160957),
("09", 'Ciudad de México', 'Ciudad de México', 'CDMX', 1, 16, 19.3450894, -99.1532516),
("10", 'Durango', 'Estado de Durango', 'DG', 34, 35, 24.9361354, -104.7118333),
("11", 'Guanajuato', 'Estado de Guanajuato', 'GT', 36, 38, 20.7087239, -100.9782212),
("12", 'Guerrero', 'Estado de Guerrero', 'GR', 39, 41, 17.6030727, -99.4330865),
("13", 'Hidalgo', 'Estado de Hidalgo', 'HG', 42, 43, 20.4147457, -98.8285380),
("14", 'Jalisco', 'Estado de Jalisco', 'JC', 44, 49, 20.5039744, -103.4780113),
("15", 'México', 'Estado de México', 'EM', 50, 57, 19.3997811, -99.4181191),
("16", 'Michoacán', 'Estado de Michoacán de Ocampo', 'MC', 58, 61, 19.5920937, -101.7289468),
("17", 'Morelos', 'Estado de Morelos', 'MN', 62, 62, 18.7852731, -99.0644756),
("18", 'Nayarit', 'Estado de Nayarit', 'MS', 63, 63, 21.6120478, -104.9045737),
("19", 'Nuevo León', 'Estado de Nuevo León', 'NL', 64, 67, 25.6778490, -99.9785496),
("20", 'Oaxaca', 'Estado de Oaxaca', 'OA', 68, 71, 17.0948029, -96.8537151),
("21", 'Puebla', 'Estado de Puebla', 'PB', 72, 75, 19.1207678, -97.9056539),
("22", 'Querétaro', 'Estado de Querétaro', 'QT', 76, 76, 20.7879598, -99.9141013),
("23", 'Quintana Roo', 'Estado de Quintana Roo', 'QR', 77, 77, 20.2273805, -87.6169463),
("24", 'San Luis Potosí', 'Estado de San Luis Potosí', 'SLP', 78, 79, 22.2118083, -100.0177798),
("25", 'Sinaloa', 'Estado de Sinaloa', 'SN', 80, 82, 24.7967726, -107.3904539),
("26", 'Sonora', 'Estado de Sonora', 'SR', 83, 85, 29.6204208, -110.2837409),
("27", 'Tabasco', 'Estado de Tabasco', 'TC', 86, 86, 17.9514465, -92.7092385),
("28", 'Tamaulipas', 'Estado de Tamaulipas', 'TM', 87, 89, 24.2199113, -98.8231737),
("29", 'Tlaxcala', 'Estado de Tlaxcala', 'TL', 90, 90, 19.3429507, -98.1770951),
("30", 'Veracruz', 'Estado de Veracruz de Ignacio de la Llave', 'VZ', 91, 96, 19.3461124, -96.6971134),
("31", 'Yucatán', 'Estado de Yucatán', 'YN', 97, 97, 20.8145152, -89.1240009),
("32", 'Zacatecas', 'Estado de Zacatecas', 'ZS', 98, 99, 22.6152649, -102.7721144);

DROP TABLE IF EXISTS Configuracion_global
CREATE TABLE Configuracion_global
(
	nombre VARCHAR(50) PRIMARY KEY,
	valor VARCHAR(50) NOT NULL
);

INSERT INTO Configuracion_global (nombre, valor) VALUES
('version', '1.0.0'),
('fecha_creacion', NOW()),
('fecha_actualizacion', NOW()),
('autor', 'Jorge Luis Sánchez'),
('use_google_services' , 'false');