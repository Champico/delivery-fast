<?php
//  delivery-fast/backend/controllers/ShipmentController.php

include_once(__DIR__ . '/../schemas/ShipmentSchema.php');
include_once(__DIR__ . '/../controllers/ZipCodeController.php');
include_once(__DIR__ . '/../controllers/TaxController.php');
include_once(__DIR__ . '/../models/ZipCodeModel.php');
include_once(__DIR__ . '/../config/ConnZipCodeDB.php');
include_once(__DIR__ . '/../middlewares/validateJsonMiddleware.php');
include_once(__DIR__ . '/../utils/PDFGenerator.php');

class ShipmentController
{
    private $shipmentModel;
    private $taxController;

    public function __construct($shipmentModel, $taxModel)
    {
        $this->shipmentModel = $shipmentModel;
        $this->taxController = new TaxController($taxModel);
    }


/*
==============================================================================================
    S E C C I O N  D E  F U N C I O N E S  Q U E  R E T O R N A N  R E S P U E S T A  H T T P
=============================================================================================
*/

    public function getAll()
    {
        try {
            $envios = $this->shipmentModel->getAll();
            echo json_encode($envios, JSON_UNESCAPED_UNICODE);
        } catch (Exception $e) {
            http_response_code(422);
            echo json_encode(['error' => $e->getMessage()], JSON_UNESCAPED_UNICODE);
        }
    }


    public function getAllBranch($branch)
    {
        try {
            $envios = $this->shipmentModel->getAllBranch($branch);
            echo json_encode($envios, JSON_UNESCAPED_UNICODE);
        } catch (Exception $e) {
            http_response_code(422);
            echo json_encode(['message' => $e->getMessage()], JSON_UNESCAPED_UNICODE);
        }
    }

    public function get($guia)
    {
        try {
            $envio = $this->shipmentModel->get($guia);
            echo json_encode($envio, JSON_UNESCAPED_UNICODE);
        } catch (Exception $e) {
            http_response_code(422);
            echo json_encode(['message' => $e->getMessage()], JSON_UNESCAPED_UNICODE);
        }
    }

    public function create()
    {
        $data = validateJsonMiddleware();
        $error = ShipmentSchema::validateDataToCreateShipment($data);

        if ($error && is_array($error) && sizeof($error) > 0) {
            http_response_code(422);
            echo json_encode([
                "message" => "Error al validar los datos", 
                "details" => $error], JSON_UNESCAPED_UNICODE);
            exit();
        }

        try {
            $data["ticket"] = $this->getTicketPrivate($data);
            $data["costo"] = $data["ticket"]["total"];

            if(!isset($data["metodo_de_pago"])) throw new Exception("Ingrese el metodo de pago");

            $data["ticket"]["metodo_de_pago"] = $data["metodo_de_pago"];
            unset($data["metodo_de_pago"]);

            if($data["ticket"]["metodo_de_pago"]=== "Efectivo" ){
                $data["ticket"]["pago_con"] = (float) $data["pago_con"];
                unset($data["pago_con"]);
                if(isset($data["cambio"])) unset($data["cambio"]);
                $data["ticket"]["cambio"] = $data["ticket"]["pago_con"] - $data["ticket"]["total"];
                if($data["ticket"]["cambio"] < 0) throw new Exception("El dinero con el que paga debe ser igual o mayor al costo del servicio"); 
            }
        } catch (Exception $e) {
            http_response_code(422);
            echo json_encode($e->getMessage(), JSON_UNESCAPED_UNICODE);
            exit();
        }

        try {
            $newShipment = $this->shipmentModel->create($data);
        } catch (Exception $e) {
            http_response_code(404);
            echo json_encode($e->getMessage(), JSON_UNESCAPED_UNICODE);
            exit();
        }

        http_response_code(201);
        echo json_encode($newShipment, JSON_UNESCAPED_UNICODE);
    }

    public function update($guia)
    {
        echo json_encode(['message' => "Se actualizo el envío " . $guia], JSON_UNESCAPED_UNICODE);
    }

    public function getTicketPreview()
    {
        try {
            $data = validateJsonMiddleware();
            $error = ShipmentSchema::validateDataToTicket($data);

            if ($error && sizeof($error) > 0) {
                http_response_code(422);
                echo json_encode($error, JSON_UNESCAPED_UNICODE);
                exit();
            }

            $ticket = $this->getTicketPrivate($data);
            echo json_encode(["ticket" => $ticket]);
            exit();
        } catch (Exception $e) {
            http_response_code(422);
            if ($e->getMessage()){
                 echo json_encode(['error' => $e->getMessage()], JSON_UNESCAPED_UNICODE);
            }else{
                echo json_encode(['error' => 'Error al crear el ticket'], JSON_UNESCAPED_UNICODE);
            }
        }
    }

    public function exists($guia)
    {
        try {
            $envio = $this->shipmentModel->exists($guia);
            echo json_encode($envio, JSON_UNESCAPED_UNICODE);
            exit();
        } catch (Exception $e) {
            http_response_code(422);
            echo json_encode(['message' => $e->getMessage()], JSON_UNESCAPED_UNICODE);
        }
    }

    public function getOfBranchIf(){
        $params = [];
        
        $params['limite_min'] = isset($_GET['limite_min']) ? $_GET['limite_min'] : "0";
        $params['limite_max'] = isset($_GET['limite_max']) ? $_GET['limite_max'] : "20";
        $params['orden'] = isset($_GET['orden']) ? $_GET['orden'] : 'desc';

        if(isset($_GET['numero_sucursal'])) $params['numero_sucursal'] = $_GET['numero_sucursal'];
        if(isset($_GET['servicio'])) $params['servicio'] = $_GET['servicio'];
        if(isset($_GET['estatus'])) $params['estatus'] = $_GET['estatus'];
        if(isset($_GET['seguro'])) $params['seguro'] = $_GET['seguro'];
        if(isset($_GET['fecha_inicio'])) $params['fecha_inicio'] = $_GET['fecha_inicio'];
        if(isset($_GET['fecha_final'])) $params['fecha_final'] = $_GET['fecha_final'];


        $error = ShipmentSchema::validateParamsToSearch($params);

        if ($error && sizeof($error) > 0) {
            http_response_code(422);
            echo json_encode($error, JSON_UNESCAPED_UNICODE);
            exit();
        }

        try {
            $shipments = $this->shipmentModel->getAllBrWithParams($params);
            http_response_code(200);
            echo json_encode($shipments, JSON_UNESCAPED_UNICODE);
            exit();
        } catch (Exception $e) {
            http_response_code(422);
            echo json_encode($e->getMessage(), JSON_UNESCAPED_UNICODE);
            exit();
        }
    }

    public function getTicketPDF($guia){
        if(empty($guia)){
            echo json_encode(["message" => "Ingrese la guia"], JSON_UNESCAPED_UNICODE);
            exit();
        }

        $new_shipment = null;

        try {
            $new_shipment = $this->shipmentModel->get($guia);
        } catch (Exception $e) {
            http_response_code(404);
            echo json_encode($e->getMessage(), JSON_UNESCAPED_UNICODE);
            exit();
        }

        if(empty($new_shipment)){
            http_response_code(404);
            echo json_encode(["message" => "No se encontro el envío con esa guía"], JSON_UNESCAPED_UNICODE);
            exit();
        }

        $tax_data = $this->taxController->getTaxDataToTicket();
        $sucursal = $this->shipmentModel->getSucursal($new_shipment['numero_sucursal']);
        $ticket = $this->getTicketCreated($guia);
        
        $pdf = PDFGenerator::createTicketPDF($ticket, $tax_data, $sucursal, $new_shipment);

        if(empty($pdf)){
            http_response_code(404);
            echo json_encode(["message" => "No se pudo generar el ticket"], JSON_UNESCAPED_UNICODE);
            exit();
        }

        header('Content-Type: application/pdf');
        header('Content-Disposition: inline; filename="ticket-' .$guia. '.pdf"');
        header('Content-Transfer-Encoding: binary');
        header('Content-Length: ' . strlen($pdf));

        echo $pdf;
        exit;
    }

    public function getGuidePDF($guia){
        if(empty($guia)){
            echo json_encode(["message" => "Ingrese la guia"], JSON_UNESCAPED_UNICODE);
            exit();
        }
        
        $new_shipment = null;

        try {
            $new_shipment = $this->shipmentModel->get($guia);
        } catch (Exception $e) {
            http_response_code(404);
            echo json_encode($e->getMessage(), JSON_UNESCAPED_UNICODE);
            exit();
        }

        if(empty($new_shipment)){
            http_response_code(404);
            echo json_encode(["message" => "No se pudo generar la guía impresa"], JSON_UNESCAPED_UNICODE);
            exit();
        }

        $pdf = PDFGenerator::createGuidePDF($new_shipment);

        
        if(empty($pdf)){
            http_response_code(404);
            echo json_encode(["message" => "No se pudo generar el ticket"], JSON_UNESCAPED_UNICODE);
            exit();
        }

        header('Content-Type: application/pdf');
        header('Content-Disposition: inline; filename="ticket-' .$guia. '.pdf"');
        header('Content-Transfer-Encoding: binary');
        header('Content-Length: ' . strlen($pdf));

        echo $pdf;
        exit;
    }



    
/*
=========================================================================
    S E C C I O N  D E  F U N C I O N E S  A U X I L I A R E S 
=========================================================================
*/

    private function getTicketPrivate($data)
    {
        $ticket = [];
        $conceptos_ticket = [];
        $coordinates_branch = null;

        try {
            $coordinates_branch = $this->getCoordinatesOfBranch($data['sucursal']);
        } catch (Exception $e) {
        }

        try {
            if ($coordinates_branch) {
                $zona = $this->getZonaWithCoordAndZipCode($coordinates_branch['latitud_dec'], $coordinates_branch['longitud_dec'], $data["cp_destinatario"]);
            } else {
                $sucursal = $this->shipmentModel->getSucursal($data['sucursal']);
                $zip_code_branch = $sucursal['cp'];
                $zona = $this->getZonaWithTwoZipCodes($zip_code_branch, $data["cp_destinatario"]);
            }
        } catch (Exception $e) {
            if ($e->getMessage())  throw new Exception($e->getMessage());
            throw new Exception($e->getMessage());
        }

        try {
            $conceptos_ticket = $this->calcular_conceptos_costo(
                $data["servicio"],
                $zona,
                $data["peso"],
                $data["largo"],
                $data["ancho"],
                $data["alto"],
                $data["seguro"],
            );
        } catch (Exception $e) {
            if ($e->getMessage())  throw new Exception($e->getMessage());
            throw new Exception("No se pudo crear el ticket");
        }

        if ($conceptos_ticket && !empty($conceptos_ticket)) {
            $last_child = count($conceptos_ticket) - 1;
            $ticket["total"] = $conceptos_ticket[$last_child]["valor"];
            unset($conceptos_ticket[$last_child]);
            $ticket["conceptos_ticket"] = $conceptos_ticket;
        }
        return $ticket;
    }

    private function calcular_conceptos_costo($servicio, $zona, $peso, $largo, $ancho, $alto, $seguro)
    {
        $conceptos_ticket = [];

            if ($precio_guia = $this->getShippingGuidePrice($zona, $servicio)) {
                $conceptos_ticket[] = [
                    "descripcion" => "precio_guia",
                    "valor" => $precio_guia
                ];
            }

        if ($costo_de_sobrepeso = $this->calculateOverWeigth($zona, $servicio, $peso, $largo, $ancho, $alto)) {
            $conceptos_ticket[] = [
                "descripcion" => "costo_de_sobrepeso",
                "valor" => $costo_de_sobrepeso
            ];
        }

        if ($seguro == true && $precio_seguro = $this->getInsuranseCost()) {
            $conceptos_ticket[] = [
                "descripcion" => "seguro",
                "valor" => $precio_seguro
            ];
        }

        if (isset($conceptos_ticket[0]) && $conceptos_ticket[0]["descripcion"] === "precio_guia" && !empty($conceptos_ticket[0]["valor"])) {
            if (isset($conceptos_ticket[1]) && $conceptos_ticket[1]["descripcion"] === "precio_guia" && !empty($conceptos_ticket[1]["valor"])) {
                $cargo_por_combustible = $this->getCostoCombustible(($conceptos_ticket[0]["valor"] + $conceptos_ticket[1]["valor"]));
            } else {
                $cargo_por_combustible = $this->getCostoCombustible($conceptos_ticket[0]["valor"]);
            }
            $conceptos_ticket[] = [
                "descripcion" => "cargo_por_combustible",
                "valor" => $cargo_por_combustible
            ];
        }

        $costo_total = 0.0;

        foreach ($conceptos_ticket as $concepto) {
            $costo_total += $concepto["valor"];
        }

        $conceptos_ticket[] = [
            "descripcion" => "costo_total",
            "valor" => $costo_total
        ];

        return $conceptos_ticket;
    }

    private function getZonaWithTwoZipCodes($codigo_postal_salida, $codigo_postal_destino)
    {
        $temp_controller = new ZipCodeController(new ZipCodeModel(ConnZipCodeDB::getInstance()));
        $distancia = $temp_controller->getDistanceOfTwoZipCode($codigo_postal_salida, $codigo_postal_destino);
        return $this->shipmentModel->getZonaOf($distancia);
    }

    private function getZonaWithCoordAndZipCode($latitud_decimal, $longitud_decimal, $codigo_postal_destino)
    {
        $temp_controller = new ZipCodeController(new ZipCodeModel(ConnZipCodeDB::getInstance()));
        $distancia = $temp_controller->getDistanceOfCoordAndZipCode($latitud_decimal, $longitud_decimal, $codigo_postal_destino);
        return $this->shipmentModel->getZonaOf($distancia);
    }

    private function getShippingGuidePrice($zona, $servicio)
    {
        try {
            $precios = $this->shipmentModel->getShippingGuidePrice($zona, $servicio);
            return  (float) $precios;
        } catch (Exception $e) {
            if ($e->getMessage()) return $e->getMessage();
            throw new Exception("Error al calcular los costos / Zonas");
        }
    }

    private function getCostoCombustible($costo)
    {
        if(!is_numeric($costo)) throw new Exception("Error al calular los costos / Combustible");
        $costo = (float) $costo;

        try {
            $porcentaje_por_combustible = (float) $this->shipmentModel->getAdditionalPercentageForFuel();
            $constante_por_combustible = $porcentaje_por_combustible / 100;
            return $constante_por_combustible * $costo;
        } catch (Exception $e) {
            throw new Exception("Error al calular los costos / Combustible");
        }
    }

    private function getInsuranseCost()
    {
        try {
            return $this->shipmentModel->getInsuranseCost();
        } catch (Exception $e) {
            if ($e->getMessage()) return $e->getMessage();
            throw new Exception("No se encontro el precio del seguro");
        }
    }

    private function calculateOverWeigth($zona, $servicio, $peso, $largo, $ancho, $alto)
    {
        $final_weight = $this->calculateFinalWeigth($peso, $largo, $ancho, $alto);
        
        try {
            $sobrepeso_constantes = $this->shipmentModel->getPricesForOverweight($zona, $servicio);
        } catch (Exception $e) {
            if ($e->getMessage()) return $e->getMessage();
        }

        $peso_max_amparado = (float) $sobrepeso_constantes["peso_max_amparado"];
        $precio_aumento =  (float) $sobrepeso_constantes["precio_aumento"];
        $medida_aumento_peso = (float) $sobrepeso_constantes["medida_aumento_peso"];
        
        if($final_weight <= $peso_max_amparado) return null;
        return (float) (($final_weight - $peso_max_amparado) / $medida_aumento_peso) * $precio_aumento;
    }

    private function calculateFinalWeigth($peso, $largo, $ancho, $alto)
    {
        $peso_volumetrico = ($peso * $largo * $alto * $ancho) / 6000;
        if ($peso_volumetrico > $peso) {
            return $peso_volumetrico;
        } else {
            return $peso;
        }
    }

    private function getCoordinatesOfBranch($id_branch)
    {
        try {
            $coordinates = $this->shipmentModel->getCoordinatesOfBranch($id_branch);
            return $coordinates;
        } catch (Exception $e) {
            throw new Exception($e->getMessage());
        }
    }


    private function getTicketCreated($guia){
        try {
            $ticket = $this->shipmentModel->getTicket($guia);
            return $ticket;
        } catch (Exception $e) {
            throw new Exception($e->getMessage());
        }
    }
}
