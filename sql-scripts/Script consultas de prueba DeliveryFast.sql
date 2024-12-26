use DEliveryFast;

-- CONSULTAS

SELECT * FROM envios;
SELECT * FROM Sucursales;
SELECT * FROM Zonas;


SELECT
	t.peso_max_amparado,
	p.precio, 
	p.medida_aumento_peso, 
	p.precio_aumento 
FROM 
	Precios AS p
INNER JOIN Tipo_servicio AS t ON p.servicio = t.nombre
WHERE p.zona = "Zona 1" AND p.servicio = "Express";



select * from Sucursales where numero_sucursal="00001";
SELECT cargo_por_combustible FROM Configuracion_global;


SELECT t.peso_max_amparado, p.precio,  p.medida_aumento_peso,  p.precio_aumento 
            FROM Precios AS p INNER JOIN Tipo_servicio AS t ON p.servicio = t.nombre WHERE p.zona = "Zona 1" AND p.servicio = "Express";
            
  SELECT nombre FROM zonas WHERE 285.49019482947 BETWEEN rango_min AND rango_max LIMIT 1;


  SELECT 
ts.peso_max_amparado,
p.medida_aumento_peso,
p.precio_aumento
FROM Tipo_servicio AS ts
INNER JOIN Precios AS p ON p.servicio = ts.nombre
WHERE p.servicio = 'Express' AND p.zona = 'Zona 1';

            
            