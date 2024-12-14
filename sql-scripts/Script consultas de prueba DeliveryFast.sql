use DEliveryFast;

SELECT
	t.peso_max_amparado,
	p.precio, 
	p.medida_aumento_peso, 
	p.precio_aumento 
FROM 
	Precios AS p
INNER JOIN Tipo_servicio AS t ON p.servicio = t.servicio
WHERE p.zona = "Zona 1" AND p.servicio = "Express";