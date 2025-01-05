<?php
// delivery-fast/backend/routes/utilsRoutes.php

include_once(__DIR__ . '/../controllers/UtilsController.php');
include_once(__DIR__ . '/../models/ZipCodeModel.php');
include_once(__DIR__ . '/../models/ShipmentModel.php');
include_once(__DIR__ . '/../config/ConnDeliveryDB.php');
include_once(__DIR__ . '/../config/ConnZipCodeDB.php');

$utilController = null;

try{
    $utilsController = new UtilsController(new ShipmentModel(ConnDeliveryDB::getInstance()), new ZipCodeModel(ConnZipCodeDB::getInstance()));
}catch(Exception $e){
    http_response_code(500);
    echo json_encode(['error' => 'Error 500 Internal Server', 'details'=>$e->getMessage()]);
}

switch ($method) {
    case 'GET':
        switch ($action){
            case 'states': $utilsController->getStatesOfMexico(); break;
            case 'services': $utilsController->getNameServices(); break;
            case 'status': $utilsController->getNameStatus(); break;

            default:
            http_response_code(404);
            echo json_encode(['message' => 'No existe la accion solicitada']);
            break;
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(['message' => 'Método no permitido']);
        break;
}
