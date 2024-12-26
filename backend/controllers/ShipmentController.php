<?php
//  delivery-fast/backend/controllers/ShipmentController.php

include_once(__DIR__ . '/../schemas/ShipmentSchema.php');
include_once(__DIR__ . '/../controllers/ZipCodeController.php');
include_once(__DIR__ . '/../models/ZipCodeModel.php');
include_once(__DIR__ . '/../config/ConnZipCodeDB.php');
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
            echo json_encode(['error' => $e->getMessage()], JSON_UNESCAPED_UNICODE);
        }
    }

    public function get($guia)
    {
        echo json_encode(['message' => "Envío con la guía " . $guia], JSON_UNESCAPED_UNICODE);
    }

    public function create()
    {
        $data = validateJsonMiddleware();
        $error = ShipmentSchema::validateNewShipmentSchema($data);

        if ($error && sizeof($error) > 0) {
            http_response_code(422);
            echo json_encode($error, JSON_UNESCAPED_UNICODE);
            exit();
        }


            try {
                $data["ticket"] = $this->getTicketPrivate($data);
                $data["costo"] = $data["ticket"]["total"];

                if(!isset($data["metodo_de_pago"])) throw new Exception("Ingrese el metodo de pago");

                $data["ticket"]["metodo_de_pago"] = $data["metodo_de_pago"];
                unset($data["metodo_de_pago"]);

                if($data["ticket"]["metodo_de_pago"]=== "Efectivo" ){
                    if(!isset($data["pago_con"])) throw new Exception("En los pagos en efectivo debe ingresar un monto con el que paga");
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

        if (!isset($data["colaborador"])) $data["colaborador"] = "000000";

        try {
            $this->shipmentModel->createStatus($newShipment["guia"], $data["colaborador"], "Pendiente");
        } catch (Exception $e) {
            http_response_code(422);
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

    public function delete($guia)
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
        } catch (Exception $e) {
            http_response_code(422);
            if ($e->getMessage()){
                 echo json_encode(['error' => $e->getMessage()], JSON_UNESCAPED_UNICODE);
            }else{
                echo json_encode(['error' => 'Eror al crear el ticket'], JSON_UNESCAPED_UNICODE);
            }
            exit();
        }
    }


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

        if ($costo_sobrepeso = $this->calculateOverWeigth($zona, $servicio, $peso, $largo, $ancho, $alto)) {
            $conceptos_ticket[] = [
                "descripcion" => "costo_de_sobrepeso",
                "valor" => $costo_sobrepeso
            ];
        }

        if ($seguro == true && $precio_seguro = $this->getInsuranseCost()) {
            $conceptos_ticket[] = [
                "descripcion" => "seguro",
                "valor" => $precio_seguro
            ];
        }

        if (isset($conceptos_ticket["precio_guia"])) {
            if ($conceptos_ticket["costo_de_sobrepeso"]) {
                $cargo_por_combustible = $this->getCostoCombustible(($conceptos_ticket["precio_guia"] + $conceptos_ticket["costo_de_sobrepeso"]));
            } else {
                $cargo_por_combustible = $this->getCostoCombustible($conceptos_ticket["precio_guia"]);
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
        try {
            $porcentaje_por_combustible = (float) $this->shipmentModel->getAdditionalPercentageForFuel();
            $constante_por_combustible = $porcentaje_por_combustible / 100;
            return $constante_por_combustible * $costo;
        } catch (Exception $e) {
            throw new Exception("Error al calular los costos / Combutible");
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

        $peso_max_amparado = $sobrepeso_constantes["peso_max_amparado"];
        $precio_aumento =  $sobrepeso_constantes["precio_aumento"];
        $precio_aumento_peso = (float) $sobrepeso_constantes["medida_aumento_peso"];

        return (float) (($final_weight - $peso_max_amparado) / $precio_aumento_peso) * $precio_aumento;
    }

    private function calculateFinalWeigth($peso, $largo, $ancho, $alto)
    {
        $peso_volumetrico = ($peso * $largo * $alto * $ancho) / 6000;
        if ($peso_volumetrico >= $peso) {
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
}
