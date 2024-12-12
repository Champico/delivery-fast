-- -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -
--  S C R I P T  P A R A  I N S E R T A R   D A T O S 
-- -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -

/* Insertar uns nueva sucursal*/
INSERT INTO Sucursales (
    numero_sucursal, correo, telefono, calle, numero_ext, numero_int, cp, colonia, ciudad, estado, hora_salida_diaria
)
VALUES (
    '001', 
    'sucursal1@empresa.com',   
    '2281234567',              
    'Av. Atenas Veracruzana',           
    '100',
    NULL,              
    '91000',    
    'La revo',
    'Xalapa',                 
    'Veracruz',               
    '13:00:00'
);

INSERT INTO Horario (numero_sucursal, dia, hora_apertura, hora_cierre)
VALUES
('001', 'Lunes', '09:00:00', '19:00:00'),
('001', 'Martes', '09:00:00', '19:00:00'),
('001', 'Miércoles', '09:00:00', '19:00:00'),
('001', 'Jueves', '09:00:00', '19:00:00'),
('001', 'Viernes', '09:00:00', '19:00:00'),
('001', 'Sábado', '10:00:00', '14:00:00');

SELECT * FROM Sucursales INNER JOIN Horario ON Sucursales.numero_sucursal = Horario.numero_sucursal;