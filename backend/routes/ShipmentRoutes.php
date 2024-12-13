<?php
// delivery-fast/backend/routes/shipmentRoutes.php

include_once(__DIR__ . '/../controllers/shipmentController.php');


switch ($method) {
    case 'GET':
        if ($action) {
            ShipmentController::getShipment($action);
        } else {
            ShipmentController::getShipments();
        }
        break;
    case 'POST':
        ShipmentController::createShipment();
        break;

    case 'PUT':
        ShipmentController::updateShipment($action);
        break;

    case 'DELETE':
        ShipmentController::deleteShipment($action);
        break;

    default:
        http_response_code(405);
        echo json_encode(['message' => 'Método no permitido']);
        break;
}
