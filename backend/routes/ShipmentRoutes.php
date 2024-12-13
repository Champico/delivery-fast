<?php
// delivery-fast/backend/routes/shipmentRoutes.php

include_once(__DIR__ . '/../controllers/shipmentController.php');
include_once(__DIR__ . '/../models/ShipmentModel.php');
include_once(__DIR__ . '/../config/conexion-bd.php');

$shipmentController = new ShipmentController(new ShipmentModel($conexionDB));

switch ($method) {
    case 'GET':
        if ($action) {
            $shipmentController->get($action);
        } else {
            $shipmentController->getAll();
        }
        break;
    case 'POST':
        $shipmentController->create();
        break;

    case 'PUT':
        $shipmentController->update($action);
        break;

    case 'DELETE':
        $shipmentController->delete($action);
        break;

    default:
        http_response_code(405);
        echo json_encode(['message' => 'Método no permitido']);
        break;
}
