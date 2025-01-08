-- ----------------------------------------------------------------------
--     I N S E R T A R  S U C U R S A L  P O R  D E F E C T O 
-- ----------------------------------------------------------------------
-- La sucursal por defecto es el domicilio fiscal de la empresa
-- ----------------------------------------------------------------------

-- S U C U R S A L / D O M I C I L I O  F I S C A L (No se hacen envíos desde esta referencia)
INSERT INTO Sucursales (numero_sucursal, correo, telefono, calle, numero_ext, cp, colonia, ciudad, estado, hora_salida_diaria, latitud_dec, longitud_dec) VALUES 
('00000', 'deliveryFastNacional@deliveryfast.com', '5551234567', 'Av. Miguel Aleman', '157', '91140', 'Federal', 'Xalapa-Enríquez', '30','13:00:00', 19.548383, -96.915791);

-- C O L A B O R A D O R / S I S T E M A
INSERT INTO Colaboradores (numero_personal, contrasena, nombre, apellido_paterno, apellido_materno, curp, correo, telefono, fecha_contratacion, id_rol, numero_sucursal)
VALUES ('000000', 'password', 'Sistema', NULL, NULL, 'SIS000000HDFSRNA1', 'deliveryFastNacional@deliveryfast.com', NULL, CURDATE(), 1, '00000');

-- S U C U R S A L  M A T R I Z  /  (Puede ser la misma que el domicilio fiscal) --
INSERT INTO Sucursales ( numero_sucursal, correo, telefono, calle, numero_ext, numero_int, cp, colonia, ciudad, estado, hora_salida_diaria, latitud_dec, longitud_dec)
VALUES ('00001','sucursal1@empresa.com','2281234567','Av. Miguel Aleman','157',NULL,'91140','Federal','Xalapa-Enríquez','30','13:00:00', 19.548383,-96.915791);

-- H O R A R I O S  S U C U R S A L  1 --
INSERT INTO Horario (numero_sucursal, dia, hora_apertura, hora_cierre)
VALUES
('00001', 'Lunes', '09:00:00', '19:00:00'),
('00001', 'Martes', '09:00:00', '19:00:00'),
('00001', 'Miércoles', '09:00:00', '19:00:00'),
('00001', 'Jueves', '09:00:00', '19:00:00'),
('00001', 'Viernes', '09:00:00', '19:00:00'),
('00001', 'Sábado', '10:00:00', '14:00:00');

-- U S U A R I O S  A D M I N I S T R A D O R   /  S U C U R S A L  1 --
INSERT INTO Colaboradores (numero_personal, contrasena, nombre, apellido_paterno, apellido_materno, curp, correo, telefono, fecha_contratacion, id_rol, numero_sucursal)
VALUES ('111111','password','Edgar Yael','Cortes','Carrillo','COCE010216HDFRRDA0','edgaryaelcc22@gmail.com','2281567570','2024-12-14',1,'00001'),
VALUES ('222222','password','Julio Aldair','Morales','Romero','MORJ030625HVZRJEA0', 'julioaldair@gmail.com','2234846756','2024-12-14',1,'00001');

-- D A T O S  F I S C A L E S --
INSERT INTO Datos_fiscales (
    RFC,
    nombre,
    apellido_paterno,
    apellido_materno,
    curp, 
    fecha_inicio_de_operaciones,
    estatus_en_el_padron,
    fecha_ultimo_cambio_estado,
    nombre_comercial, 
    codigo_postal,
    tipo_vialidad,
    nombre_vialidad,
    numero_exterior,
    numero_interior,
    colonia, 
    localidad,
    municipio, 
    entidad_federativa, 
    orden_ae,
    descripcion_actividad_economica_ae,
    porcentaje_ae,
    fecha_inicio_ae, 
    regimen,
    fecha_inicio_regimen,
    constancia_de_situacion_fiscal
)
VALUES (
    'COCE010216CY8', -- RFC
    'Delivery Fast', -- nombre
    NULL, -- apellido_paterno
    NULL, -- apellido_materno
    NULL, -- curp
    '1995-08-16', -- fecha_inicio_de_operaciones
    'Reactivado', -- estatus_en_el_padron
    '2009-08-01', -- fecha_ultimo_cambio_estado
    NULL, -- nombre_comercial
    '91140', -- codigo_postal
    'Avenida', -- tipo_vialidad
    'Miguel Aleman', -- nombre_vialidad
    '156', -- numero_exterior
    NULL, -- numero_interior
    'Col. Federal', -- colonia
    'Xalapa', -- localidad
    'Xalapa', -- municipio
    '30', -- entidad_federativa
    '1', -- orden_ae (principal)
    'Envio de paquetes al publico en general', -- descripcion_actividad_economica_ae
    '100%', -- porcentaje_ae
    '1995-08-16', -- fecha_inicio_ae
    'Régimen General de Ley Personas Morales', -- regimen
    '1995-08-16', -- fecha_inicio_regimen
    NULL -- constancia_de_situacion_fiscal
);

select * FROM sucursales;
