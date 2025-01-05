<?php
// delivery-fast/backend/routes/shipmentRoutes.php

include_once(__DIR__ . '/../controllers/shipmentController.php');
include_once(__DIR__ . '/../models/ShipmentModel.php');
include_once(__DIR__ . '/../config/ConnDeliveryDB.php');
include_once(__DIR__ . '/../models/TaxModel.php');

$shipmentController = null;

try{
    $shipmentController = new ShipmentController(new ShipmentModel(ConnDeliveryDB::getInstance()), new TaxModel(ConnDeliveryDB::getInstance()));
}catch(Exception $e){
    http_response_code(500);
    echo json_encode(['error' => 'Error 500 Internal Server', 'details'=>$e->getMessage()]);
}

switch ($method) {
    case 'GET':
        if ($action) {
            switch($action){
                case 'branch':
                    if(isset($_GET['search'])) {
                        $shipmentController->getOfBranchIf();
                    }else{
                        $shipmentController->getAllBranch($a2); break;
                    }
                case 'search': $shipmentController->get($a2); break;
                case 'ticket-pdf': $shipmentController->getTicketPDF($a2); break;
                case 'guide-pdf': $shipmentController->getGuidePDF($a2); break;
                case 'exits' : $shipmentController->exists($a2); break;
                default: http_response_code(405);
                echo json_encode(['error' => 'Dirección no encontrada']);
                break;
            }
        } else {
            $shipmentController->getAll();
        }
        break;
    case 'POST':
        if ($action) {
            switch($action){
                case 'ticket' : $shipmentController->getTicketPreview(); break;
                default: http_response_code(405);
                echo json_encode(['error' => 'Dirección no encontrada']);
                break;
            }
        }else{
            $shipmentController->create();
        }

        break;

    case 'PUT':
        $shipmentController->update($action);
        break;

    case 'DELETE':
        http_response_code(405);
        echo json_encode(['error' => 'No se pueden eliminar los envíos']);
        break;

    default:
        http_response_code(405);
        echo json_encode(['error' => 'Método no permitido']);
        break;
}
