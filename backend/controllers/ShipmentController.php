<?php

include_once(__DIR__ . '/../schemas/ShipmentSchema.php');
include_once(__DIR__ . '/../middlewares/validateJsonMiddleware.php');

class ShipmentController
{
    private $shipmentModel;

    public function __construct($shipmentModel)
    {
        $this->$shipmentModel = $shipmentModel;
    }


    public function getAll()
    {
        echo json_encode(['message' => 'Lista de envíos'], JSON_UNESCAPED_UNICODE);
    }

    public function get($guia)
    {
        echo json_encode(['message' => "Envío con la guía " . $guia], JSON_UNESCAPED_UNICODE);
    }

    public function create()
    {
    /* > LOGICA PARA CREAR UN ENVIO CONTROLLER <
    
    Pre-condición: Ninguna

    Pasos:
    1. Verificar que existan los datos de otras tablas
        - Validar que los datos que llegaron sea un JSON
        - Validar los datos segun las reglas de negocio
        - Calcular el costo
        - Enviar datos a el MODEL
    */

        $data = validateJsonMiddleware();
        $data2 = ShipmentSchema::validateNewShipmentSchema($data);

        if (isset($data->error)) {
            http_response_code(422);
            echo json_encode($data2);
        }

        try {
            $this->shipmentModel->create($data2);
        } catch (Exception $e) {
        }

        echo json_encode(['message' => 'Se creo el envio'], JSON_UNESCAPED_UNICODE);
    }

    public function update($guia)
    {
        echo json_encode(['message' => "Se actualizo el envío " . $guia], JSON_UNESCAPED_UNICODE);
    }

    public function delete($guia)
    {
        echo json_encode(['message' => "Se actualizo el envío " . $guia], JSON_UNESCAPED_UNICODE);
    }













    private function calcular_costo($peso, $largo, $ancho, $alto){
    /* > LOGICA PARA CREAR UN ENVIO CONTROLLER <
    
    Pre-condición: Datos con el formato correcto de peso, largo, ancho y alto

    Pasos:
        - Verificar las reglas de negocio para crear costos. Checar el archivo Terminos y condiciones para Costos.txt
        - Retornar un ticket
    */

    }

    private function calcular_distancia($lat1, $lon1, $lat2, $lon2)
    {
        $radio_tierra = 6371;
        $dlat = deg2rad($lat2 - $lat1);
        $dlon = deg2rad($lon2 - $lon1);
        $a = sin($dlat / 2) * sin($dlat / 2) + cos(deg2rad($lat1)) * cos(deg2rad($lat2)) * sin($dlon / 2) * sin($dlon / 2);
        $c = 2 * atan2(sqrt($a), sqrt(1 - $a));
        return $radio_tierra * $c;
    }

    private function obtener_distancia($codigo_postal_salida, $codigo_postal_destino, $conexion)
    {
        $codigo_entidad_1 = (int)substr($codigo_postal_salida, 0, 2);
        $codigo_entidad_2 = (int)substr($codigo_postal_destino, 0, 2);

        $entidad1 = $this->shipmentModel->getCoordinatesOfState($codigo_entidad_1);
        $entidad2 = $this->shipmentModel->getCoordinatesOfState($codigo_entidad_1);

        if (!$entidad1 || !$entidad2) {
            return "Entidades no encontradas para los códigos postales dados.";
        }

        $distancia = $this->calcular_distancia($entidad1['latitud'], $entidad1['longitud'], $entidad2['latitud'], $entidad2['longitud']);

        return $distancia;
    }
}
