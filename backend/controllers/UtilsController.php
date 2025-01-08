<?php

//  delivery-fast/backend/controllers/UtilsController.php
include_once(__DIR__ . '/../schemas/ShipmentSchema.php');
include_once(__DIR__ . '/../controllers/ZipCodeController.php');

class UtilsController
{
    private $zipCodeController;
    private $shipmentModel;

    public function __construct($shipmentModel, $zipCodesModel)
    {
        $this->zipCodeController = new ZipCodeController($zipCodesModel);
        $this->shipmentModel = $shipmentModel;
    }

    public function getStatesOfMexico()
    {
        try {
            $estados = $this->zipCodeController->getStatesOfMexico();
            echo json_encode($estados, JSON_UNESCAPED_UNICODE);
        } catch (Exception $e) {
            http_response_code(422);
            echo json_encode(['error' => $e->getMessage()], JSON_UNESCAPED_UNICODE);
        }
    }

    public function getNameServices()
    {
        try {
            $services = $this->shipmentModel->getNameServices();
            echo json_encode($services, JSON_UNESCAPED_UNICODE);
        } catch (Exception $e) {
            http_response_code(422);
            echo json_encode(['error' => $e->getMessage()], JSON_UNESCAPED_UNICODE);
        }
    }

    public function getNameStatus()
    {
        try {
            $services = $this->shipmentModel->getNameStatus();
            echo json_encode($services, JSON_UNESCAPED_UNICODE);
        } catch (Exception $e) {
            http_response_code(422);
            echo json_encode(['error' => $e->getMessage()], JSON_UNESCAPED_UNICODE);
        }
    }

    public function getLocationDataOfZipCode($zipCode){
        try {
            $error = ShipmentSchema::validateZipCode($zipCode);

            if ($error && sizeof($error) > 0) {
                http_response_code(422);
                echo json_encode($error, JSON_UNESCAPED_UNICODE);
                exit();
            }

            $locationInfo = $this->zipCodeController->getLocationDataOfZipCode($zipCode);
            echo json_encode($locationInfo, JSON_UNESCAPED_UNICODE);
        } catch (Exception $e) {
            http_response_code(422);
            echo json_encode(['error' => $e->getMessage()], JSON_UNESCAPED_UNICODE);
        }
    }
}
