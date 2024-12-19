<?php
//  delivery-fast/backend/controllers/ShipmentController.php
include_once(__DIR__ . '/../utils/console-js.php');
include_once(__DIR__ . '/../schemas/ShipmentSchema.php');
include_once(__DIR__ . '/../middlewares/validateJsonMiddleware.php');

class ShipmentController
{
    private $shipmentModel;

    public function __construct($shipmentModel)
    {
        $this->shipmentModel = $shipmentModel;
    }


    public function getAll()
    {
        try{
            $envios = $this->shipmentModel->getAll();
            echo json_encode($envios, JSON_UNESCAPED_UNICODE);
        }catch(Exception $e){
            http_response_code(422);
            echo json_encode(['error' => $e->getMessage()], JSON_UNESCAPED_UNICODE);
        }
    }

    
    public function getAllBranch($branch)
    {
        try{
            $envios = $this->shipmentModel->getAllBranch($branch);
            echo json_encode($envios, JSON_UNESCAPED_UNICODE);
        }catch(Exception $e){
            http_response_code(422);
            echo json_encode(['error' => $e->getMessage()], JSON_UNESCAPED_UNICODE);
        }
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
        - Calcular el costo y crear un ticket
        - Enviar los datos al MODEL para crear el envío
        - Crear el primer estatus del envío
        - Obtener los datos del envio y retornarlos

    */

        $data = validateJsonMiddleware();
        $error = ShipmentSchema::validateNewShipmentSchema($data);

        if ($error && sizeof($error) > 0) {
            http_response_code(422);
            echo json_encode($error, JSON_UNESCAPED_UNICODE);
            exit();
        }

        if(!isset($data["ticket"])){
            try{
                $data["ticket"] = $this->create_ticket_without_id($data);
                $data['costo'] = $data['ticket']['total'];
            }catch(Exception $e){
                http_response_code(422);
                echo json_encode($e->getMessage(), JSON_UNESCAPED_UNICODE);
                exit();
            }

        }

        try {
            $newShipment = $this->shipmentModel->create($data);
        } catch (Exception $e) {
            http_response_code(404);
            echo json_encode($e->getMessage(), JSON_UNESCAPED_UNICODE);
            exit();
        }

        if(!isset($data["colaborador"])) $data["colaborador"] = "000000";

        try{
            $this->shipmentModel->createStatus($newShipment["guia"], $data["colaborador"], "Pendiente");
        }catch(Exception $e){
            http_response_code(422);
            echo json_encode($e->getMessage(), JSON_UNESCAPED_UNICODE);
            exit();
        }


        http_response_code(201);
        echo json_encode($newShipment);
    }

    public function update($guia)
    {
        echo json_encode(['message' => "Se actualizo el envío " . $guia], JSON_UNESCAPED_UNICODE);
    }

    public function delete($guia)
    {
        echo json_encode(['message' => "Se actualizo el envío " . $guia], JSON_UNESCAPED_UNICODE);
    }

    public function getTicket(){
        try{
            $data = validateJsonMiddleware();
            $error = ShipmentSchema::validateTicket($data);

            if ($error && sizeof($error) > 0) {
                http_response_code(422);
                echo json_encode($error, JSON_UNESCAPED_UNICODE);
                exit();
            }

            $ticket = $this->create_ticket_without_id($data);
            echo json_encode(["ticket"=>$ticket]);
        }catch(Exception $e){
            http_response_code(422);
            echo json_encode($e->getMessage(), JSON_UNESCAPED_UNICODE);
            exit();
        }
    }


    private function create_ticket_without_id($data){
        $ticket = [];
        
        $codigo_postal_sucursal_envio = null;

        try{
            $sucursal = $this->shipmentModel->getSucursal($data['sucursal']);

            $codigo_postal_sucursal_envio = $sucursal['cp'];
        }catch(Exception $e){
            return new Exception("No se encuentra la sucursal");
        }
        
        $conceptos_ticket = $this->calcular_conceptos_costo(
            $data["servicio"],
            $data["peso"],
            $data["largo"],
            $data["ancho"],
            $data["alto"],
            $data["seguro"],
            $codigo_postal_sucursal_envio,
            $data["cp_destinatario"]
        );

        if($conceptos_ticket){
            $ticket["total"] = $conceptos_ticket['total'];
            unset($conceptos_ticket['total']);
            $ticket["conceptos_ticket"] = $conceptos_ticket;
            $ticket["metodo_de_pago"] = "Efectivo";
            $ticket["pago_con"] = $ticket["total"];
            $ticket["cambio"] = 0;
        }

        return $ticket;
    }

    private function calcular_conceptos_costo( $servicio, $peso, $largo, $ancho, $alto, $seguro, $codigo_postal_salida, $codigo_postal_destino){
    /* > LOGICA PARA CREAR UN ENVIO CONTROLLER <
    
    Pre-condición: Datos con el formato correcto de peso, largo, ancho y alto

    Pasos:
        - Calcular peso voumetrico
        - Calcular precio de guia
        - Calcular precio sobrepeso
        - Calcular precio por combustible
        
        */

        $conceptos_ticket = [];

        $peso_volumetrico = ($peso * $largo * $alto * $ancho)/6000;
        if($peso_volumetrico >= $peso){ 
            $peso = $peso_volumetrico;
        }else{ 
            $peso_volumetrico = $peso;
        }

        $zona = $this->obtener_zona($codigo_postal_salida, $codigo_postal_destino);

        $precios = $this->shipmentModel->getPreciosServicios($zona, $servicio);
        if(!$precios) return null;

        $precio_guia = (float) $precios["precio"];
        $conceptos_ticket["precio_guia"] = $precio_guia;

        $peso_max_amparado = (float) $precios["peso_max_amparado"];

        $porcentaje_por_combustible = (float) $this->shipmentModel->getPorcentajeCombustible();
        $constante_por_combustible = $porcentaje_por_combustible/100;
        $cargo_por_combustible = null;

        if($peso_volumetrico > $peso_max_amparado){
            $precio_aumento =  (float) $precios["precio_aumento"];
            $precio_aumento_peso = (float)  $precios["medida_aumento_peso"];

            $precio_sobrepeso = (($peso_volumetrico - $peso_max_amparado)/$precio_aumento_peso)*$precio_aumento;
            $conceptos_ticket["precio_sobrepeso"] = $precio_sobrepeso;

            $cargo_por_combustible = $constante_por_combustible * ($precio_guia + $precio_sobrepeso);
        }else{
            $cargo_por_combustible = $constante_por_combustible * $precio_guia;
        }

        $conceptos_ticket["cargo_por_combustible"] = $cargo_por_combustible;

        if($seguro == true) $conceptos_ticket["seguro"] = $this->shipmentModel->getPrecioSeguro();

        $costo_total = 0;
        foreach($conceptos_ticket as $nombre => $valor ){
            $costo_total+=$valor;
        }
        $conceptos_ticket['total'] = $costo_total;
        return $conceptos_ticket;
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

    private function obtener_distancia($codigo_postal_salida, $codigo_postal_destino)
    {
        $codigo_entidad_1 = (int)substr($codigo_postal_salida, 0, 2);
        $codigo_entidad_2 = (int)substr($codigo_postal_destino, 0, 2);

        $entidad1 = $this->shipmentModel->getCoordinatesOfState($codigo_entidad_1);
        $entidad2 = $this->shipmentModel->getCoordinatesOfState($codigo_entidad_2);

        if (!$entidad1 || !$entidad2) {
            return null;
        }
        $distancia = $this->calcular_distancia($entidad1['latitud'], $entidad1['longitud'], $entidad2['latitud'], $entidad2['longitud']);
    return $distancia;
    }

    private function obtener_zona($codigo_postal_salida, $codigo_postal_destino){
        $distancia = $this->obtener_distancia($codigo_postal_salida, $codigo_postal_destino);
        return $this->shipmentModel->getZonaOf($distancia);
    }
}
